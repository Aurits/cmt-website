/**
 * Partner logo pipeline.
 *
 * Provenance: every file is downloaded from CMT's own live site
 * (cmtrealtors.com/our-clients/), which the brief identifies as the source to reuse —
 * "These are existing partner logos, already public on the current site, and can be reused
 * rather than resourced" (section 9). Each mark remains the trademark of the institution
 * it belongs to; they appear here as a client list, which is how CMT already publishes
 * them. Nothing is redrawn or recoloured.
 *
 * Processing is deliberately minimal: flatten away any baked-in background, trim the dead
 * margin, and fit each mark into a common box so the conveyor gives every institution the
 * same optical weight. Alpha is preserved where the source has it.
 *
 * Usage: node scripts/prepare-partner-logos.mjs [--force]
 * Sources are cached in .cache/partner-logos/ so re-runs do not re-download.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://cmtrealtors.com/wp-content/uploads/2025/04/';
const CACHE = '.cache/partner-logos';
const OUT = 'public/brand/partners';

/** Box every mark is fitted into. 2x the ~130x40 it renders at, so it stays crisp. */
const BOX = { width: 260, height: 80 };

const LOGOS = [
  { id: 'bank-of-uganda', file: 'Bank-Of-Uganda-Logo-1.png' },
  { id: 'standard-chartered', file: 'standardchartered@2x.png' },
  { id: 'uba', file: 'U-B-A.png' },
  { id: 'gtbank', file: 'GTBank_logo.svg_.png' },
  { id: 'stanbic-bank', file: 'Stanbic-bank.png' },
  { id: 'kcb-bank', file: 'KCB-Bank.png' },
  {
    id: 'african-development-bank',
    file: 'african-development-bank-logo-04.png',
    /*
     * The source holds two seals side by side: the African Development Bank (left) and the
     * African Development Fund (right). They are different institutions and CMT's client
     * is the Bank, so we keep the left seal only. Fraction of the trimmed width to retain.
     */
     cropLeftFraction: 0.52,
  },
  { id: 'exim-bank', file: 'images-1.png' },
  { id: 'uganda-development-bank', file: 'JiXJuJJN_400x400.jpg' },
  { id: 'ucc', file: 'ucc-logo.png' },
  { id: 'nwsc', file: 'national-water-and-sewerage-corporation-nwsc-logo-png_seeklogo-550101.png' },
  { id: 'vivo-energy', file: 'Vivo_Energy_logo.svg_.png' },
  { id: 'vision-fund-uganda', file: 'Logo-Vision-Fund-Uganda-e1744269671208.png' },
  { id: 'unfcu', file: 'UNFCU_Logo_New-Photoroom.png' },
];

const force = process.argv.includes('--force');
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

async function source({ id, file }) {
  const cached = path.join(CACHE, `${id}${path.extname(file)}`);
  if (fs.existsSync(cached) && !force) return cached;
  const url = BASE + encodeURIComponent(file).replace(/%2F/g, '/');
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`${id}: ${response.status} ${url}`);
  fs.writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
  return cached;
}

const manifest = [];

for (const logo of LOGOS) {
  const input = await source(logo);

  // Flatten first so a baked-in white background trims like a transparent one.
  let image = sharp(input).flatten({ background: '#ffffff' }).trim({ threshold: 8 });

  if (logo.cropLeftFraction) {
    const buf = await image.png().toBuffer();
    const meta = await sharp(buf).metadata();
    image = sharp(buf).extract({
      left: 0,
      top: 0,
      width: Math.round(meta.width * logo.cropLeftFraction),
      height: meta.height,
    });
  }

  const dest = path.join(OUT, `${logo.id}.png`);
  await image
    .resize({ ...BOX, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  const { width, height } = await sharp(dest).metadata();
  const kb = Math.round(fs.statSync(dest).size / 1024);
  manifest.push({ id: logo.id, file: logo.file, width, height, kb });
  console.log(`${logo.id.padEnd(26)} ${width}x${height}  ${kb}kB`);
}

const credits = [
  '# Partner logo credits',
  '',
  'Downloaded from CMT Realtors\' own site (https://cmtrealtors.com/our-clients/), which the',
  'build brief names as the source to reuse. Each mark is the trademark of the institution',
  'it identifies and is shown here as part of CMT\'s client list. None has been redrawn or',
  'recoloured: processing is limited to flattening the background, trimming dead margin and',
  'fitting to a common box.',
  '',
  '| File | Source filename | Size |',
  '| --- | --- | --- |',
  ...manifest.map((m) => `| \`${m.id}.png\` | \`${m.file}\` | ${m.width}x${m.height}, ${m.kb}kB |`),
  '',
  'Run `node scripts/prepare-partner-logos.mjs --force` to re-pull from source.',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT, 'CREDITS.md'), credits);
console.log('\nwrote', path.join(OUT, 'CREDITS.md'));
