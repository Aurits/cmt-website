'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import { cx } from '@/lib/cx';

type NetworkInformation = { saveData?: boolean };

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Re-render if the visitor flips their OS motion setting while the tab is open. */
function subscribeToMotionPreference(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function shouldAnimate() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  // navigator.connection is Chromium-only; every other browser skips the check and animates,
  // which is the right default where the signal doesn't exist.
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !connection?.saveData;
}

/** SSR, and the client's first render before hydration, both get the safe default. */
function getServerSnapshot() {
  return false;
}

/**
 * The hero photograph, animated — same balcony facade, now a few seconds of subtle motion
 * looping behind the fold.
 *
 * Same principle as Reveal: the server HTML is the safe, complete version — the still
 * photograph, `priority`-loaded, nothing waiting on JavaScript — and only on the client,
 * after mount, does a capable visitor get upgraded to the video. That means a crawler, a
 * failed script, prefers-reduced-motion, or a browser with Data Saver on all just see the
 * photograph and never fetch a single byte of video. Nothing here can make the hero worse
 * than it was before the video existed, only better.
 *
 * Two source widths, not one: <source media> lets the browser itself pick the file before
 * it downloads anything, the same way a <picture> element would for an image, so a phone on
 * mobile data gets the ~360kB clip and never touches the ~1MB desktop one.
 *
 * `gradeClassName` (the hue-rotate/saturate/contrast that matches this shot to the rest of
 * the hero's photography) is kept separate from `className` and applied only to the poster
 * <Image>, not the <video>: a CSS `filter` re-run on every decoded frame at 24fps on a
 * full-bleed element is real per-frame GPU cost a still image never pays, and was read as
 * jitter. The video carries the same grade instead, baked in once at encode time —
 * scripts/prepare-hero-video.mjs.
 */
export function HeroVideo({
  posterSrc,
  posterAlt,
  desktopSrc,
  mobileSrc,
  sizes,
  className,
  gradeClassName,
}: {
  posterSrc: string;
  posterAlt: string;
  desktopSrc: string;
  mobileSrc: string;
  sizes: string;
  className?: string;
  gradeClassName?: string;
}) {
  const animate = useSyncExternalStore(subscribeToMotionPreference, shouldAnimate, getServerSnapshot);

  if (!animate) {
    return (
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        sizes={sizes}
        className={cx(className, gradeClassName)}
      />
    );
  }

  return (
    <video
      className={cx('absolute inset-0 h-full w-full object-cover', className)}
      poster={posterSrc}
      aria-label={posterAlt}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source media="(max-width: 767px)" src={mobileSrc} type="video/mp4" />
      <source src={desktopSrc} type="video/mp4" />
    </video>
  );
}
