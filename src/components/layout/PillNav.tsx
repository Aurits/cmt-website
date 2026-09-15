'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { nav } from '@/data/site';
import { cx } from '@/lib/cx';

// Layout effect on the client, no-op on the server — same reasoning as Reveal.tsx: without
// this guard, measuring a ref during server rendering both does nothing useful and prints
// React's "useLayoutEffect does nothing on the server" warning.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Same ease as hero-rise and .reveal (globals.css) — one curve for every deliberate motion
// on the site, rather than each component picking its own.
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

type Rect = { left: number; width: number };

/**
 * The desktop nav, as a pill: one rounded-full track holding every link, with a single gold
 * capsule sliding beneath whichever one is the current page. Where every surface on the site
 * is square and every control takes a 4px --radius-control (globals.css), this is the one
 * element deliberately allowed to go all the way to a pill: a signature shape rather than
 * the house style repeated, and the sharper everything around it is, the more it reads as
 * the exception it was meant to be.
 *
 * The capsule tracks the ROUTE only, never the pointer. An earlier version also slid to
 * whatever link was under the cursor, which sounds nice in the abstract but felt exactly as
 * bad as it sounds in practice: sweep the pointer across six links and the capsule chases it
 * through six mid-flight interruptions, arriving nowhere smoothly. Hover here is just a text
 * colour change — cheap, instant, and it never fights the one animation that matters, which
 * is the capsule settling under wherever navigation actually took you.
 *
 * The slide itself is measured, not guessed: each link reports its own position through a
 * ref map, so the capsule lands exactly under text of any length at any breakpoint instead
 * of a set of hand-picked positions that would drift the moment a label or a breakpoint's
 * gap changed. That position comes from getBoundingClientRect, not offsetLeft/offsetWidth —
 * offsetLeft resolves against the nearest POSITIONED ancestor, which silently stops being
 * the track the moment any element between a link and the track picks up its own `relative`
 * (for stacking, say), and reports 0 instead of a real position with no error either side.
 * Diffing two bounding rects is immune to that: it's absolute viewport geometry, unaffected
 * by whatever position anything in between happens to have. The capsule moves by
 * `transform`, not `left`/`width`, so the browser can composite the glide on its own layer
 * rather than reflowing the track on every frame.
 */
export function PillNav({ isActive }: { isActive: (href: string) => boolean }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [rect, setRect] = useState<Rect | null>(null);

  const active = nav.find((item) => isActive(item.href))?.href ?? null;

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const el = active ? itemRefs.current.get(active) : undefined;
      if (!track || !el) {
        setRect(null);
        return;
      }
      const trackBox = track.getBoundingClientRect();
      const elBox = el.getBoundingClientRect();
      setRect({ left: elBox.left - trackBox.left, width: elBox.width });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul
        ref={trackRef}
        className="relative flex items-center gap-1 rounded-full border border-cream/15 bg-cream/[0.06] p-1"
      >
        {rect && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-0 rounded-full bg-gold transition-transform duration-[420ms]"
            style={{
              width: rect.width,
              transform: `translateX(${rect.left}px)`,
              transitionTimingFunction: EASE,
            }}
          />
        )}
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
                else itemRefs.current.delete(item.href);
              }}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cx(
                'relative z-10 block rounded-full px-4 py-2 text-body transition-colors duration-200',
                item.href === active ? 'text-green' : 'text-cream/85 hover:text-cream',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
