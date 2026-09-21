/**
 * Move the images the CMS manages into the bucket, and point the database at them.
 *
 *   node scripts/upload-images.mjs           upload anything missing, then update paths
 *   node scripts/upload-images.mjs --dry-run show what would happen
 *
 * WHAT MOVES, AND WHAT DOES NOT. Only the files an editor can replace through the CMS: listing
 * photographs and partner logos. Site furniture stays in public/ — the hero, the five category
 * cards, the service photographs, the closing skyline. No admin screen manages those, they change
 * when the design changes rather than when the content does, and serving them from the app's own
 * static output is faster and cheaper than a round trip to a bucket.
 *
 * Listing stock goes under seed/ rather than listings/<id>/ because these photographs are shared
 * between properties and illustrative rather than owned by one — which the property pages already
 * say on the page. Real photography, uploaded per property, lands under listings/<id>/ and
 * replaces a row at a time.
 *
 * Idempotent: a key that already exists is skipped, so re-running costs a HEAD per file.
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const DRY = process.argv.includes('--dry-run');

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^"|"$/g, '');
      }
    }
  }
}

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

async function main() {
  loadEnv();
  const E = process.env;
  if (!E.S3_BUCKET || !E.S3_ENDPOINT) throw new Error('S3 is not configured.');

  const s3 = new S3Client({
    endpoint: E.S3_ENDPOINT,
    region: E.S3_REGION ?? 'auto',
    forcePathStyle: true,
    credentials: {
      accessKeyId: E.S3_ACCESS_KEY_ID,
      secretAccessKey: E.S3_SECRET_ACCESS_KEY,
    },
  });

  const ref = new URL(E.S3_ENDPOINT).hostname.split('.')[0];
  const base = (E.S3_PUBLIC_URL || `https://${ref}.supabase.co/storage/v1/object/public/${E.S3_BUCKET}`)
    .replace(/\/$/, '');

  async function exists(key) {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: E.S3_BUCKET, Key: key }));
      return true;
    } catch {
      return false;
    }
  }

  async function upload(localPath, key) {
    if (await exists(key)) return 'skipped';
    if (DRY) return 'would upload';
    const body = fs.readFileSync(localPath);
    await s3.send(
      new PutObjectCommand({
        Bucket: E.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: TYPES[path.extname(localPath).toLowerCase()] ?? 'application/octet-stream',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    return 'uploaded';
  }

  const db = new pg.Client({
    connectionString: E.DATABASE_POOL_URL ?? E.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await db.connect();

  const tally = { uploaded: 0, skipped: 0, 'would upload': 0, missing: 0, repointed: 0 };

  // ── listing photographs ──────────────────────────────────────────────────────────────────
  const { rows: images } = await db.query('select id, path from listing_images order by path');
  const seen = new Map();

  for (const row of images) {
    if (!row.path.startsWith('/')) continue; // already a bucket key
    const local = path.join('public', row.path.replace(/^\//, ''));
    if (!fs.existsSync(local)) {
      console.log(`  MISSING FILE  ${row.path}`);
      tally.missing += 1;
      continue;
    }
    const key = `seed/listings/${path.basename(row.path)}`;
    if (!seen.has(key)) seen.set(key, await upload(local, key));
    tally[seen.get(key)] += 1;
    if (!DRY) {
      await db.query('update listing_images set path = $1 where id = $2', [key, row.id]);
      tally.repointed += 1;
    }
  }

  // ── partner logos, which are one per partner and so keyed by partner ────────────────────
  const { rows: partners } = await db.query(
    'select id, name, logo_path from partners where logo_path is not null order by name',
  );
  for (const partner of partners) {
    if (!partner.logo_path.startsWith('/')) continue;
    const local = path.join('public', partner.logo_path.replace(/^\//, ''));
    if (!fs.existsSync(local)) {
      console.log(`  MISSING FILE  ${partner.logo_path}  (${partner.name})`);
      tally.missing += 1;
      continue;
    }
    const key = `partners/${partner.id}/${path.basename(partner.logo_path)}`;
    tally[await upload(local, key)] += 1;
    if (!DRY) {
      await db.query('update partners set logo_path = $1 where id = $2', [key, partner.id]);
      tally.repointed += 1;
    }
  }

  console.log(`\n${DRY ? 'dry run' : 'done'}`);
  for (const [k, v] of Object.entries(tally)) if (v) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log(`\n  ${seen.size} unique listing files, ${partners.length} partner logos`);

  // Prove one of them is actually fetchable rather than assuming the upload meant anything.
  if (!DRY && seen.size) {
    const sample = [...seen.keys()][0];
    const url = `${base}/${sample}`;
    const res = await fetch(url);
    console.log(`\n  sample  ${url}`);
    console.log(`  fetch   ${res.status} ${res.statusText}  ${res.headers.get('content-type')}` +
      `  ${res.headers.get('content-length')} bytes`);
  }

  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
