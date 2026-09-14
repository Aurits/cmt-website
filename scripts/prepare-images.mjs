/**
 * One-off asset pipeline.
 *
 * Every photo below is from Unsplash (free, commercial use permitted, no attribution
 * required — we credit anyway in public/images/CREDITS.md). Two tiers:
 *
 *  - Listings imagery (public/images/listings/*) stays deliberately generic: none of it
 *    is a specific, identifiable building, because none of it is a real CMT property yet.
 *    Real photography of CMT's managed listings replaces these in a later phase — drop
 *    the new file in at the same path and nothing else has to change.
 *  - Everything else — the hero, the identity photo, the closing CTA banner and four of
 *    the five property-class cards — is genuine, identifiable Kampala/Uganda photography
 *    (the `ug-*` source keys below), since those spots are the site's own atmosphere
 *    rather than a stand-in for a specific listing.
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
  // Service imagery — close-ups of the work itself (tape, signature, blueprint, keys)
  // rather than a place, so there's no location to verify one way or the other; run in
  // black and white (see services/page.tsx) so the set reads as one deliberate style
  // rather than four unrelated stock photos. Two are Pexels rather than Unsplash (a
  // `pexels:<id>` value, handled in source() below) — the only two, of everything tried
  // for this page, that were both a genuine free-license close-up AND depicted a Black
  // subject rather than defaulting to a white one, which is worth having on a Ugandan
  // firm's own site even where the photo itself carries no geography.
  'svc-valuation': '1716698286313-9a2349d41110', // a tape measure, held up
  'svc-lending': 'pexels:8730964', // Mikhail Nilov — a hand signing a report
  'svc-consultancy': 'pexels:6282116', // Yaroslav Shuraev — hands over an architectural blueprint
  'svc-listing': '1741156386380-0236c72eb6f9', // a set of house keys, held up at the door

  // Genuine Kampala / Uganda photography — see the docblock above for where these run.
  'ug-hero': '1752654605009-3b12790fe738', // wavy, layered apartment balconies — ribbon-like curves
  'ug-cta': '1763220207281-c4d0febb61a8', // Robin Kutesa: Kampala skyline at sunset, from Nsambya
  'ug-office': '1675756261486-09bd1e0f6c8a', // Keith Kasaija: Kampala business district by day
  'ug-commercial': '1777887544354-74a7248c8a74', // Michael Starkie: Kampala towers above the trees
  'ug-residential': '1578325872347-6cc1795a5fea', // aerial: Kampala rooftops, Lake Victoria, a rainbow
  'ug-land': '1696963609168-5c3d93857ea4', // terraced plots on a Ugandan hillside
  'ug-agri': '1741012253817-67aacc8e25c6', // coffee cherries ripening, Kampala
};

/** [source, output path, width, height, human description] */
const JOBS = [
  ['ug-hero', 'hero-home.jpg', 2200, 1760, 'Wavy, ribbon-like apartment balconies — homepage hero'],
  ['ug-office', 'identity-office.jpg', 1400, 1000, "Kampala's business district by day — About / identity section"],
  ['ug-cta', 'cta-skyline.jpg', 2000, 1000, 'Kampala skyline at sunset, from Nsambya — CTA banner background'],
  ['01', 'valuation-keys.jpg', 1200, 800, 'House model and keys — Services / valuation'],

  ['svc-valuation', 'services/valuation.jpg', 1200, 900, 'A tape measure, held up — property valuation'],
  ['svc-lending', 'services/lending.jpg', 1200, 900, 'A report being signed — valuation for lending'],
  ['svc-consultancy', 'services/consultancy.jpg', 1200, 900, 'Hands over a blueprint — real estate consultancy'],
  ['svc-listing', 'services/listing.jpg', 1200, 900, 'House keys at the door — listing and sales management'],

  ['ug-residential', 'categories/residential.jpg', 1600, 1000, 'Kampala rooftops, Lake Victoria and a rainbow'],
  ['ug-commercial', 'categories/commercial.jpg', 1600, 1000, "Kampala's commercial towers above the trees"],
  ['09', 'categories/industrial.jpg', 1600, 1000, 'Generic warehouse interior'],
  ['ug-land', 'categories/land.jpg', 1600, 1000, 'Terraced plots on a Ugandan hillside'],
  ['ug-agri', 'categories/agricultural.jpg', 1600, 1000, 'Coffee cherries ripening, Kampala'],

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
  const ref = SOURCES[id];
  const url = ref.startsWith('pexels:')
    ? `https://images.pexels.com/photos/${ref.slice(7)}/pexels-photo-${ref.slice(7)}.jpeg?cs=srgb&fm=jpg&w=2400`
    : `https://images.unsplash.com/photo-${ref}?w=2400&q=80&fm=jpg`;
  // Unsplash (and Pexels) occasionally refuse a cold connection; three tries is plenty.
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

// Most sources crop fine from the centre. This one is sky-heavy — the skyline sits in the
// bottom half of the frame — so a plain centred cover crop (which, going from a wide
// source to a narrower target, only trims left/right) leaves it mostly cloud. Trim the top
// fraction of the source off first so the skyline dominates whatever box it lands in.
const TOP_TRIM = {
  'identity-office.jpg': 0.42,
};

for (const [src, out, w, h] of JOBS) {
  const dest = path.join(OUT, out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let pipeline = sharp(await source(src));
  const trim = TOP_TRIM[out];
  if (trim) {
    const { width: sw, height: sh } = await pipeline.metadata();
    const top = Math.round(sh * trim);
    pipeline = pipeline.extract({ left: 0, top, width: sw, height: sh - top });
  }
  await pipeline
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 72, mozjpeg: true, progressive: true })
    .toFile(dest);
  console.log(`${out}  ${(fs.statSync(dest).size / 1024).toFixed(0)}kB`);
}

/*
 * Brand marks.
 *
 * The letterforms are used as-is: nothing about the wordmark itself is recoloured, knocked
 * out or redrawn. cmt-logo-gold.png is the client's gold-on-tile export, swapped in for the
 * original white-on-tile cmt-logo-01.png (kept in the repo for history, no longer read
 * here) at the client's request — gold ink instead of cream, matching the site's own
 * gold-for-emphasis colour rather than sitting apart from it. A 14px inset drops the
 * outermost band of the supplied PNG, matching the trim the original export needed for its
 * own compression halo; 14px of flat tile out of 1798 changes no proportion in the artwork.
 *
 * Both colours in the export are retuned to the site's own tokens rather than kept as
 * supplied: the tile becomes ONE GREEN (globals.css --color-green, #11341b — the client's
 * call, now taken from THIS export rather than cmt-logo-01.png) and the ink becomes the
 * site's own --color-gold (#daa706) rather than the export's own slightly different gold
 * (#e7a70f), so the mark uses the exact same two colours as everything drawn around it
 * instead of a close-but-not-quite pair. remapTwoTone does this by treating the source
 * image as if it were only ever these two flat colours: every pixel's red channel (the
 * widest-spread channel between this green and this gold, so the safest one to measure
 * blend against) places it somewhere on the line between the two, and that same position
 * is used to blend the two NEW colours. Genuinely two-tone art round-trips as flat colour;
 * an anti-aliased edge pixel keeps its antialiasing, just recoloured — nothing is
 * hard-thresholded, so no edge gets harder or softer than the source drew it.
 *
 * Still the opaque tile, not the transparent variant OPEN-ITEMS.md #11 asks CMT for. A
 * transparent gold wordmark, if CMT supplies one, replaces this file at the same path and
 * lets the masthead return to the brief's exact green (#143d1e) instead of the tile's.
 */

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

/** Recolours a flat two-tone image from one {bg, fg} colour pair to another. */
async function remapTwoTone(input, from, to) {
  const [fromBg, fromFg, toBg, toFg] = [from.bg, from.fg, to.bg, to.fg].map(hexToRgb);
  const image = sharp(input).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const t = Math.min(1, Math.max(0, (data[i] - fromBg[0]) / (fromFg[0] - fromBg[0])));
    for (let c = 0; c < 3; c++) data[i + c] = lerp(toBg[c], toFg[c], t);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

fs.mkdirSync('public/brand', { recursive: true });
const INSET = 14;
const LOGO_SOURCE = 'cmt-logo-gold.png';
const { width: lw, height: lh } = await sharp(LOGO_SOURCE).metadata();
const trimmed = await sharp(LOGO_SOURCE)
  .extract({ left: INSET, top: INSET, width: lw - INSET * 2, height: lh - INSET * 2 })
  .png()
  .toBuffer();
const normalized = await remapTwoTone(
  trimmed,
  { bg: '#11341b', fg: '#e7a70f' }, // measured from the export's own flat fills
  { bg: '#11341b', fg: '#daa706' }, // globals.css --color-green / --color-gold
);

await sharp(normalized).resize(900).png({ compressionLevel: 9, palette: true })
  .toFile('public/brand/cmt-logo.png');

// Favicons and app icons are built from this mark by scripts/prepare-icons.mjs, which
// steps the artwork down with size (the whole wordmark is unreadable at 16px).

const creditLink = (src) => {
  const ref = SOURCES[src];
  return ref.startsWith('pexels:')
    ? `https://www.pexels.com/photo/${ref.slice(7)}/`
    : `https://unsplash.com/photos/${ref}`;
};

const credits = [
  '# Image credits and licensing',
  '',
  'Photography: [Unsplash](https://unsplash.com/license) or, for two of the four service',
  'photographs, [Pexels](https://www.pexels.com/license/) — both free for commercial use,',
  'no attribution required. Credited here for traceability, including the photographer of',
  'each Kampala/Uganda shot. Listings imagery (`listings/*`) is generic and',
  'representative on purpose — none of it is a real CMT property yet, and it is replaced',
  'with client-supplied photography at the same paths when that exists. Everywhere else —',
  'hero, identity photo, CTA banner and four of the five property-class cards — is',
  'genuine, identifiable Kampala or Uganda photography.',
  '',
  '| File | Source | Description |',
  '| --- | --- | --- |',
  ...JOBS.map(([src, out, , , desc]) => `| \`${out}\` | ${creditLink(src)} | ${desc} |`),
  '',
  '`public/brand/cmt-logo.png` is the client-supplied mark (`cmt-logo-gold.png`), optimised.',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT, 'CREDITS.md'), credits);
console.log('wrote', path.join(OUT, 'CREDITS.md'));
