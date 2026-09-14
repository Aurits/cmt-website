/**
 * Hero video pipeline.
 *
 * The homepage hero photograph (public/images/hero-home.jpg — the balcony facade at
 * ug-hero in prepare-images.mjs) now also exists as a short AI-generated animation of the
 * same building, supplied by the client rather than fetched from a source URL. That raw
 * export is heavy (1920x1080, ~5MB for 4 seconds, an unused audio track) and arrives as a
 * single file rather than something safe to commit, so it lives in .cache/videos/ — same
 * treatment as .cache/photos/, gitignored, reproducible from there rather than depended on.
 *
 * This script transcodes it into what the hero actually serves: two small, silent, looping
 * H.264 clips in public/videos/ — desktop and mobile widths, HeroVideo.tsx picks between
 * them with a <source media> query. A VP9/WebM pass was tried for the usual 30-40% saving
 * over H.264, but on this source — a mostly-static, near-macro shot with GPU-encoded
 * H.264 input — it came out larger at a matching CRF, not smaller; not worth a second
 * codec and a bigger download for the privilege. Re-run with `node
 * scripts/prepare-hero-video.mjs` any time the source clip changes; nothing here reaches
 * into public/ except the two output files.
 *
 * Usage: node scripts/prepare-hero-video.mjs
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SOURCE = '.cache/videos/hero-source.mp4';
const OUT = 'public/videos';

if (!fs.existsSync(SOURCE)) {
  console.error(`Missing ${SOURCE} — drop the raw export there first.`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

/**
 * [output file, width, height, codec args]
 *
 * CRF, not a fixed bitrate: the clip is a static camera on a mostly-static facade, so a
 * quality target compresses the (plentiful) still frames hard and only spends bytes where
 * the animation actually moves, rather than paying a flat rate throughout. Values are the
 * video equivalent of prepare-images.mjs's `quality: 72` — well past the point of visible
 * loss for a decorative background loop, not archival quality.
 */
const JOBS = [
  ['hero-loop.mp4', 1600, 900, ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '27']],
  ['hero-loop-mobile.mp4', 960, 540, ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '29']],
];

for (const [out, w, h, codec] of JOBS) {
  const dest = path.join(OUT, out);
  const args = [
    '-y',
    '-i', SOURCE,
    // force_original_aspect_ratio + crop is a no-op on this 16:9 source and a safe centre
    // crop if a future re-shoot isn't exactly 16:9.
    '-vf', `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`,
    '-an', // silent background loop — no audio track to ship or to autoplay-block on
    ...codec,
    '-pix_fmt', 'yuv420p',
    ...(out.endsWith('.mp4') ? ['-movflags', '+faststart'] : []),
    dest,
  ];
  const result = spawnSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`ffmpeg failed on ${out}:\n${result.stderr}`);
    process.exit(result.status ?? 1);
  }
  console.log(`${out}  ${(fs.statSync(dest).size / 1024).toFixed(0)}kB`);
}
