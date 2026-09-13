/**
 * Favicon and app icon pipeline.
 *
 * The supplied mark is a 3:1 wordmark inside a wide tile. Dropped whole into a square
 * favicon it renders as an illegible smear at 16px — we tested it. So the icons step down
 * with size, which is ordinary practice for a wide wordmark:
 *
 *   16px, 32px   the C alone, cropped from the artwork. At tab size it is the only form
 *                that stays sharp, and that high-contrast serif C is distinctive.
 *   48px and up  the full CMT wordmark, which is legible from 48px.
 *
 * Nothing is redrawn. Every icon is a crop of the client's own artwork on the brand green,
 * so the letterforms are theirs. A purpose-drawn monogram would be better still, and is
 * noted in OPEN-ITEMS.md.
 *
 * Usage: node scripts/prepare-icons.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/brand/cmt-logo.png';
const GREEN = '#1b361c';

/* Measured ink boxes within the 900x431 mark (see the profiling in prepare-images.mjs). */
const WORDMARK = { left: 136, top: 62, width: 651, height: 213 };
const LETTER_C = { left: 136, top: 62, width: 176, height: 213 };

/** Crop, fit inside a padded square, and set it on the brand green. */
async function icon(crop, size, pad) {
  const mark = await sharp(SRC).extract(crop).png().toBuffer();
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(mark)
    .resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: GREEN } })
    .composite([{ input: fitted, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Minimal ICO writer. The format is a 6-byte header, then one 16-byte directory entry per
 * image, then the image payloads — and since Vista, those payloads may be PNGs, which is
 * what we embed. Browsers pick the entry matching the size they need, so the 16px slot can
 * carry different artwork from the 48px one.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width, 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

fs.mkdirSync('public/icons', { recursive: true });

// Tab and bookmark sizes: the C, with room to breathe.
const ico16 = await icon(LETTER_C, 16, 0.16);
const ico32 = await icon(LETTER_C, 32, 0.16);
// From 48px the whole wordmark holds together.
const ico48 = await icon(WORDMARK, 48, 0.1);

fs.writeFileSync(
  'src/app/favicon.ico',
  buildIco([
    { size: 16, data: ico16 },
    { size: 32, data: ico32 },
    { size: 48, data: ico48 },
  ]),
);

// Next.js file conventions: these are picked up automatically, no metadata needed.
fs.writeFileSync('src/app/icon.png', await icon(WORDMARK, 512, 0.12));
// iOS crops to a rounded square and never shows a transparent background, so pad more.
fs.writeFileSync('src/app/apple-icon.png', await icon(WORDMARK, 180, 0.16));

// Manifest icons, for Android install and the PWA surface.
fs.writeFileSync(path.join('public/icons', 'icon-192.png'), await icon(WORDMARK, 192, 0.12));
fs.writeFileSync(path.join('public/icons', 'icon-512.png'), await icon(WORDMARK, 512, 0.12));
// Maskable icons are cropped to a circle by Android, so keep the mark well inside.
fs.writeFileSync(path.join('public/icons', 'icon-maskable-512.png'), await icon(LETTER_C, 512, 0.28));

for (const file of [
  'src/app/favicon.ico',
  'src/app/icon.png',
  'src/app/apple-icon.png',
  'public/icons/icon-192.png',
  'public/icons/icon-512.png',
  'public/icons/icon-maskable-512.png',
]) {
  console.log(`${file.padEnd(36)} ${(fs.statSync(file).size / 1024).toFixed(1)}kB`);
}
