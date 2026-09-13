/**
 * One-off asset pipeline.
 *
 * Every photo below is from Unsplash (free, commercial use permitted, no attribution
 * required — we credit anyway in public/images/CREDITS.md). All shots are generic and
 * representative: none is a specific, identifiable Kampala building. Real photography of
 * CMT's managed listings replaces these in a later phase — drop the new file in at the
 * same path and nothing else has to change.
 *
 * Usage: node scripts/prepare-images.mjs [--force]
 * Sources are fetched from https://images.unsplash.com/photo-<id> (see SOURCES) and cached
 * in .cache/photos/, so a re-run costs nothing and the pipeline is reproducible on any
 * machine rather than depending on a folder someone happened to have locally.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const CACHE = '.cache/photos';
const OUT = 'public/images';
const force = process.argv.includes('--force');

// candidate file -> Unsplash photo id, for the credits file
const SOURCES = {
  '01': '1560518883-ce09059eeffa', '02': '1564013799919-ab600027ffc6',
  '03': '1600585154340-be6161a56a0c', '05': '1449844908441-8829872d2607',
  '06': '1486406146926-c627a92ad1ab', '07': '1496307653780-42ee777d4833',
  '08': '1497366754035-f200968a6e72', '09': '1553413077-190dd305871c',
  '10': '1578575437130-527eed3abbec', '11': '1500382017468-9049fed747ef',
  '12': '1523348837708-15d4a09cfac2', '13': '1441974231531-c6227db76b6e',
  '14': '1472214103451-9374bd1c798e', '15': '1560448204-e02f11c3d0e2',
  '16': '1613490493576-7fde63acd811', '17': '1600607687939-ce8a6c25118c',
  '18': '1582407947304-fd86f028f716', '19': '1545324418-cc1a3fa10c00',
  '23': '1590487988256-9ed24133863e', '24': '1499529112087-3cb3b73cec95',
  // Service imagery.
  '30': '1503387762-592deb58ef4e', '31': '1450101499163-c8848c66ca85',
  '32': '1454165804606-c3d57bc86b40', '33': '1568605114967-8130f3a36994',
};

/** [source, output path, width, height, human description] */
const JOBS = [
  ['03', 'hero-home.jpg', 2000, 1250, 'Modern house at dusk — homepage hero'],
  ['08', 'identity-office.jpg', 1400, 1000, 'Light modern office interior — About / identity section'],
  ['18', 'cta-skyline.jpg', 2000, 1000, 'Mixed-use towers — CTA banner background'],
  ['01', 'valuation-keys.jpg', 1200, 800, 'House model and keys — Services / valuation'],

  ['30', 'services/valuation.jpg', 1200, 900, 'Measuring a drawing — property valuation'],
  ['31', 'services/lending.jpg', 1200, 900, 'Signing a report — valuation for lending'],
  ['32', 'services/consultancy.jpg', 1200, 900, 'Working over plans — real estate consultancy'],
  ['33', 'services/listing.jpg', 1200, 900, 'A home at dusk — listing and sales management'],

  ['19', 'categories/residential.jpg', 1600, 1000, 'Generic modern apartment block'],
  ['06', 'categories/commercial.jpg', 1600, 1000, 'Generic office towers'],
  ['09', 'categories/industrial.jpg', 1600, 1000, 'Generic warehouse interior'],
  ['13', 'categories/land.jpg', 1600, 1000, 'Wooded land before clearing'],
  ['11', 'categories/agricultural.jpg', 1600, 1000, 'Farmland at sunset'],

  ['02', 'listings/res-villa-pool.jpg', 1200, 800, 'House with pool'],
  ['16', 'listings/res-modern-villa.jpg', 1200, 800, 'Modern villa'],
  ['15', 'listings/res-living-room.jpg', 1200, 800, 'Furnished living room'],
  ['17', 'listings/res-apartment-interior.jpg', 1200, 800, 'Modern apartment interior'],
  ['05', 'listings/res-family-house.jpg', 1200, 800, 'Family house, wooded plot'],
  ['08', 'listings/com-office-interior.jpg', 1200, 800, 'Open-plan office interior'],
  ['06', 'listings/com-office-towers.jpg', 1200, 800, 'Office towers from below'],
  ['07', 'listings/com-glass-facade.jpg', 1200, 800, 'Glass facade detail'],
  ['09', 'listings/ind-warehouse.jpg', 1200, 800, 'Racked warehouse interior'],
  ['10', 'listings/ind-port-yard.jpg', 1200, 800, 'Container handling yard'],
  ['23', 'listings/ind-workshop.jpg', 1200, 800, 'Light industrial workshop'],
  ['14', 'listings/land-green-plot.jpg', 1200, 800, 'Green open plot'],
  ['13', 'listings/land-wooded-plot.jpg', 1200, 800, 'Wooded plot'],
  ['11', 'listings/agri-farmland.jpg', 1200, 800, 'Farmland'],
  ['24', 'listings/agri-wheat.jpg', 1200, 800, 'Cereal crop close-up'],
  ['12', 'listings/agri-seedlings.jpg', 1200, 800, 'Seedlings / nursery'],
];

fs.mkdirSync(CACHE, { recursive: true });

/** Download a source photo once, then reuse the cached copy. */
async function source(id) {
  const cached = path.join(CACHE, `${id}.jpg`);
  if (fs.existsSync(cached) && !force) return cached;
  const url = `https://images.unsplash.com/photo-${SOURCES[id]}?w=2400&q=80&fm=jpg`;
  // Unsplash occasionally refuses a cold connection; three tries is plenty.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      fs.writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
      return cached;
    } catch (error) {
      if (attempt === 3) throw new Error(`${id}: ${url} — ${error}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  return cached;
}

for (const [src, out, w, h] of JOBS) {
  const dest = path.join(OUT, out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(await source(src))
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 72, mozjpeg: true, progressive: true })
    .toFile(dest);
  console.log(`${out}  ${(fs.statSync(dest).size / 1024).toFixed(0)}kB`);
}

/*
 * Brand marks.
 *
 * The badge is used as-is: nothing is recoloured, knocked out or redrawn. The only
 * preparation is a 14px inset that drops the outermost band of the supplied PNG, whose
 * pixels are 4-5 levels lighter than the tile itself (#1f381e against a #1b361c field)
 * from earlier lossy compression. Left in, that band draws a halo round the mark wherever
 * it sits on a green surface. 14px of flat tile out of 1798 changes no proportion in the
 * artwork.
 *
 * The tile's own green is #1b361c, which is NOT the brand green #143d1e. Surfaces the mark
 * has to merge into use --color-green-mark for that reason; see globals.css and
 * OPEN-ITEMS.md, where a transparent-background variant is requested so the masthead can
 * go back to exact brand green.
 */
fs.mkdirSync('public/brand', { recursive: true });
const INSET = 14;
const { width: lw, height: lh } = await sharp('cmt-logo-01.png').metadata();
const trimmed = await sharp('cmt-logo-01.png')
  .extract({ left: INSET, top: INSET, width: lw - INSET * 2, height: lh - INSET * 2 })
  .png()
  .toBuffer();

await sharp(trimmed).resize(900).png({ compressionLevel: 9, palette: true })
  .toFile('public/brand/cmt-logo.png');

// Favicons and app icons are built from this mark by scripts/prepare-icons.mjs, which
// steps the artwork down with size (the whole wordmark is unreadable at 16px).

const credits = [
  '# Image credits and licensing',
  '',
  'Photography: [Unsplash](https://unsplash.com/license) — free for commercial use, no',
  'attribution required. Credited here for traceability. Every shot is generic and',
  'representative; none depicts a specific, identifiable Kampala building or a real CMT',
  'listing. Replace with client-supplied photography at the same paths when available.',
  '',
  '| File | Source | Description |',
  '| --- | --- | --- |',
  ...JOBS.map(([src, out, , , desc]) =>
    `| \`${out}\` | https://unsplash.com/photos/${SOURCES[src]} | ${desc} |`),
  '',
  '`public/brand/cmt-logo.png` is the client-supplied mark (`cmt-logo-01.png`), optimised.',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT, 'CREDITS.md'), credits);
console.log('wrote', path.join(OUT, 'CREDITS.md'));
