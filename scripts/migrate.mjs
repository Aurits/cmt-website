/**
 * Migration runner.
 *
 * Plain SQL files applied in filename order, each in its own transaction, recorded in
 * `_migrations` so a re-run is a no-op. Deliberately not a framework: the schema in
 * docs/SCHEMA.md is written as SQL, psql can run the same files, and nothing about the
 * database depends on this script still existing in a year.
 *
 *   node scripts/migrate.mjs           apply anything new
 *   node scripts/migrate.mjs --status  list what has and has not run
 *
 * CONNECTION. Prefers DATABASE_URL and falls back to DATABASE_POOL_URL, because Supabase's
 * direct host is IPv6-only unless the IPv4 add-on is bought, and most machines cannot resolve
 * it. The pooler on port 5432 is session mode, which runs DDL perfectly well. Port 6543 is
 * transaction mode and cannot, so this refuses that one rather than failing halfway through a
 * migration.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';

const DIR = 'migrations';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (!match) continue;
      const [, key, raw] = match;
      if (process.env[key] === undefined) process.env[key] = raw.replace(/^"|"$/g, '');
    }
  }
}

function connectionString() {
  const direct = process.env.DATABASE_URL;
  const pooled = process.env.DATABASE_POOL_URL;
  if (!direct && !pooled) {
    throw new Error('No DATABASE_URL or DATABASE_POOL_URL. Copy .env.example and fill it in.');
  }
  if (pooled && new URL(pooled).port === '6543' && !direct) {
    throw new Error(
      'DATABASE_POOL_URL is the transaction-mode pooler (port 6543), which cannot run DDL. ' +
        'Set DATABASE_URL to the direct connection, or use the session pooler on 5432.',
    );
  }
  return { direct, pooled };
}

async function open() {
  const { direct, pooled } = connectionString();
  for (const [label, url] of [['direct', direct], ['pooled', pooled]]) {
    if (!url) continue;
    const client = new pg.Client({
      connectionString: url,
      connectionTimeoutMillis: 15000,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      console.log(`connected over the ${label} connection to ${new URL(url).hostname}`);
      return client;
    } catch (error) {
      console.log(`  ${label} connection unavailable (${error.code || error.message})`);
      try {
        await client.end();
      } catch {}
    }
  }
  throw new Error('Could not reach the database on any configured connection.');
}

const digest = (sql) => crypto.createHash('sha256').update(sql).digest('hex').slice(0, 12);

async function main() {
  loadEnv();
  const statusOnly = process.argv.includes('--status');
  const client = await open();

  await client.query(`
    create table if not exists _migrations (
      name       text primary key,
      checksum   text not null,
      applied_at timestamptz not null default now()
    )`);

  const { rows } = await client.query('select name, checksum from _migrations');
  const applied = new Map(rows.map((r) => [r.name, r.checksum]));

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();
  let ran = 0;

  for (const name of files) {
    const sql = fs.readFileSync(path.join(DIR, name), 'utf8');
    const checksum = digest(sql);

    if (applied.has(name)) {
      const drifted = applied.get(name) !== checksum;
      console.log(`  ${drifted ? 'CHANGED SINCE APPLIED' : 'already applied'}  ${name}`);
      if (drifted) {
        // Editing an applied migration means two databases silently disagree. Say so loudly.
        console.log('    ^ edit a new migration instead of an applied one');
      }
      continue;
    }

    if (statusOnly) {
      console.log(`  pending        ${name}`);
      continue;
    }

    process.stdout.write(`  applying       ${name} ... `);
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query('insert into _migrations (name, checksum) values ($1, $2)', [
        name,
        checksum,
      ]);
      await client.query('commit');
      console.log('ok');
      ran += 1;
    } catch (error) {
      await client.query('rollback');
      console.log('FAILED');
      console.error(`\n${error.message}\n`);
      await client.end();
      process.exit(1);
    }
  }

  if (!statusOnly) {
    const { rows: tables } = await client.query(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name`,
    );
    console.log(`\n${ran} applied. ${tables.length} tables:`);
    console.log('  ' + tables.map((t) => t.table_name).join(', '));
  }

  await client.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
