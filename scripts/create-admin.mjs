/**
 * Create or update a CMS user.
 *
 *   node scripts/create-admin.mjs "you@cmtrealtors.com" "Full Name" [admin|editor]
 *
 * There is no signup screen and there should not be one: accounts are created here, by someone
 * with database access. A password is generated rather than accepted on the command line, so it
 * never reaches shell history, and it is printed once.
 */
import fs from 'node:fs';
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import pg from 'pg';

for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue;
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(l.trim());
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}

// Kept in step with src/lib/auth/password.ts by hand. Two copies, because this script runs
// outside the bundler and importing a 'server-only' module here would fail.
const N = 2 ** 17, R = 8, P = 1, KEY_LENGTH = 64, MAXMEM = 256 * 1024 * 1024;

const scrypt = (password, salt, keylen, options) =>
  new Promise((resolve, reject) =>
    scryptCb(password, salt, keylen, options, (e, k) => (e ? reject(e) : resolve(k))));

async function hashPassword(plain) {
  const salt = randomBytes(16);
  const key = await scrypt(plain.normalize('NFKC'), salt, KEY_LENGTH, { N, r: R, p: P, maxmem: MAXMEM });
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

/** Readable out loud, and still 90+ bits of entropy. */
function generatePassword() {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(randomBytes(18)).map((b) => alphabet[b % alphabet.length]).join('');
}

const [email, name, role = 'admin'] = process.argv.slice(2);
if (!email) {
  console.error('usage: node scripts/create-admin.mjs "email" "Full Name" [admin|editor]');
  process.exit(1);
}
if (!['admin', 'editor'].includes(role)) {
  console.error(`role must be admin or editor, not "${role}"`);
  process.exit(1);
}

const db = new pg.Client({
  connectionString: process.env.DATABASE_POOL_URL ?? process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await db.connect();

const password = generatePassword();
const hash = await hashPassword(password);

const { rows } = await db.query(
  `insert into users (email, full_name, password_hash, role, activated_at)
   values ($1, $2, $3, $4, now())
   on conflict (email) do update set
     full_name = excluded.full_name, password_hash = excluded.password_hash,
     role = excluded.role, activated_at = now()
   returning id, email, role, (xmax = 0) as created`,
  [email.toLowerCase().trim(), name ?? null, hash, role],
);

const user = rows[0];
// Any existing session is dropped: changing a password should end the sessions it opened.
const { rowCount } = await db.query('delete from sessions where user_id = $1', [user.id]);

console.log(`\n${user.created ? 'created' : 'updated'}  ${user.email}  (${user.role})`);
if (rowCount) console.log(`  ${rowCount} existing session(s) revoked`);
console.log(`\n  password:  ${password}`);
console.log('\n  Shown once. Store it in a password manager and change it after first sign-in.\n');

await db.end();
