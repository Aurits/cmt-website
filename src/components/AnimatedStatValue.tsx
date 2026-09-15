'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts a stat's numeric value up from zero once it scrolls into view — "12" arrives as
 * 0, 1, 2... 12, not just as a number sitting there.
 *
 * Same posture as Reveal and HeroVideo: the server HTML already carries the true final
 * value, and this only intercepts it on the client, after mount, for a visitor who scrolls
 * to it with JavaScript and motion both available. Anyone else — no JS, a failed bundle,
 * prefers-reduced-motion, or simply catching the page before the observer fires — reads the
 * real number, never a mid-count one. Values that aren't purely numeric ("UIS") can't be
 * counted and are left alone; the check is a plain regex against the value itself, not a
 * per-stat flag that data/site.ts would have to keep in sync.
 */
export function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\d+)(\D*)$/); // "16+" -> ["16+", "16", "+"], "UIS" -> null
    const el = ref.current;
    if (!match || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = Number(match[1]);
    const suffix = match[2];
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3; // ease-out cubic — quick start, settles gently
          setDisplay(`${Math.round(eased * target)}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tnum">
      {display}
    </span>
  );
}
