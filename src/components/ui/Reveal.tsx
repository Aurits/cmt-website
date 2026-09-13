'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '@/lib/cx';

/**
 * Reveals its children once, as they scroll into view.
 *
 * The important part is what it does NOT do: the server HTML carries no hidden state. If
 * content shipped at opacity:0 and waited for JavaScript, then slow hydration, a failed
 * bundle or a crawler that renders without scrolling would all be looking at a blank page.
 * So children render visible, and only on the client, before the first paint, does an
 * element that is genuinely below the fold get hidden and handed to an observer. Anything
 * already on screen is left alone and never animates.
 *
 * Motion is opacity plus 18px of travel, applied to sections and card groups rather than
 * to every element, so scrolling reads as content arriving rather than as a slideshow.
 */

// Layout effect on the client, no-op on the server — this must run before paint or the
// hide would flash.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type State = 'static' | 'hidden' | 'revealed';

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  /** Stagger within a group, in milliseconds. Keep under ~240ms or it reads as lag. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const node = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>('static');

  /*
   * A callback ref typed to HTMLElement rather than useRef on the element: `as` can render
   * a div, section, li or article, and one callback accepting the base type satisfies all
   * of them, where a typed RefObject satisfies none.
   */
  const assignRef = (element: HTMLElement | null) => {
    node.current = element;
  };

  useIsomorphicLayoutEffect(() => {
    const element = node.current;
    if (!element) return;

    // Honour the OS setting here as well as in CSS, so we never even hide the content.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already on screen: leave it visible. Only what is below the fold animates in.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState('hidden');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('revealed');
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={assignRef}
      className={cx(
        state !== 'static' && 'reveal',
        state === 'revealed' && 'is-revealed',
        className,
      )}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
