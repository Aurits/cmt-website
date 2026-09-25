/**
 * Create or update a CMS user.
 *
 *   node scripts/create-admin.mjs "you@cmtrealtors.com" "Full Name" [admin|editor]
 *
 * Three ways to set the password, in order of preference:
 *
 *   1. ADMIN_PASSWORD=… in .env.local        never touches shell history
 *   2. a fourth argument                     convenient, but your shell remembers it
 *   3. neither                               one is generated and printed once
 *
 * This script never waits for input. An earlier version prompted with the echo turned off, which
 * is the nicer idea and the wrong one here: across WSL, npm run and a Windows node.exe,
 * process.stdin.isTTY comes back true, false and undefined in different combinations, and where
 * it is true the prompt sits there invisibly and looks like a hang. A tool run occasionally by
 * one developer is not worth that.
 *
 * Note for WSL: an inline `ADMIN_PASSWORD=… node …` does NOT reach a Windows node.exe unless the
 * name is in WSLENV. The variable vanishes silently and a password is generated instead. Put it
 * in .env.local, or pass it as the fourth argument.
 *
 * There is no signup screen and there should not be one: accounts are created here, by someone
 * with database access.
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
  console.error('usage: node scripts/create-admin.mjs "email" "Full Name" [admin|editor] [password]');
  console.error('   or: ADMIN_PASSWORD in .env.local, which keeps it out of shell history');
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

const chosen = (process.env.ADMIN_PASSWORD ?? process.argv[5] ?? '').trim();
if (chosen && chosen.length < 12) {
  console.error('  That password is under 12 characters. Use a longer one.');
  process.exit(1);
}
const password = chosen || generatePassword();
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

const rule = '─'.repeat(52);
console.log(`\n${user.created ? 'created' : 'updated'}  ${user.email}  (${user.role})`);
if (rowCount) console.log(`  ${rowCount} existing session(s) revoked`);

if (chosen) {
  console.log('\n  Password set to the one you supplied.\n');
} else {
  // Loud on purpose. The first version printed this as one quiet line among several and it was
  // missed, which cost an afternoon of "why can I not log in" — the password was never the one
  // being typed, because nobody chose it.
  console.log(`\n${rule}`);
  console.log('  A PASSWORD WAS GENERATED. It is shown only here.');
  console.log(`${rule}`);
  console.log(`\n      ${password}\n`);
  console.log(`${rule}`);
  console.log('  Copy it now. To choose your own instead, run this again and type one');
  console.log('  at the prompt rather than pressing enter.');
  console.log(`${rule}\n`);
}

await db.end();
