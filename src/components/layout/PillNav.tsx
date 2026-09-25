'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NavMenuPanel, navMenus, type NavMenuKey } from '@/components/layout/NavMenus';
import { ChevronIcon } from '@/components/ui/icons';
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
type PanelBox = { left: number; width: number; bridge: number };

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
 *
 * Items with a `menu` (see data/site.ts) are disclosures, not links: each opens its NavMenuPanel,
 * whose intro links to the page the item used to go to. One menu is open at a time. Hover opens
 * after a short pause, so sweeping the pointer across the pill does not flash panels; once one
 * is open, moving to a neighbour switches instantly, the way a menu bar does. Hover closes on a
 * short delay so the pointer can cross the gap into the panel; Escape, a click outside and
 * tabbing out all close it too. Closed, a panel is `invisible`, which also takes its links out
 * of the tab order.
 *
 * Each panel stays inside its <li> so it follows its item in the tab order, but it is sized to
 * the header's content box (the Container, less its padding) and dropped to the masthead's
 * bottom edge. Both are measured, like the capsule: the track is centred by flex, so its offset
 * from the page margin changes with every breakpoint. `bridge` is the padding that spans the
 * gap between the pill and the hairline, so the pointer never leaves the menu on its way down.
 */
export function PillNav({ isActive }: { isActive: (href: string) => boolean }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const [rect, setRect] = useState<Rect | null>(null);
  const [openMenu, setOpenMenu] = useState<NavMenuKey | null>(null);
  const [panelBox, setPanelBox] = useState<PanelBox | null>(null);
  const menuItemRefs = useRef(new Map<NavMenuKey, HTMLLIElement>());
  const menuButtonRefs = useRef(new Map<NavMenuKey, HTMLButtonElement>());
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const container = track?.closest('nav')?.parentElement;
      const header = track?.closest('header');
      if (!track || !container || !header) return;
      const trackBox = track.getBoundingClientRect();
      const box = container.getBoundingClientRect();
      const style = getComputedStyle(container);
      const left = box.left + parseFloat(style.paddingLeft);
      const right = box.right - parseFloat(style.paddingRight);
      setPanelBox({
        left: left - trackBox.left,
        width: right - left,
        bridge: header.getBoundingClientRect().bottom - trackBox.bottom,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenMenu(null);
      menuButtonRefs.current.get(openMenu)?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!menuItemRefs.current.get(openMenu)?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openMenu]);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  const show = (key: NavMenuKey) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const hoverIn = (key: NavMenuKey) => {
    clearTimeout(closeTimer.current);
    if (openMenu) show(key);
    else openTimer.current = setTimeout(() => setOpenMenu(key), 90);
  };
  const hoverOut = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };
  const close = () => setOpenMenu(null);

  const setItemRef = (href: string) => (el: HTMLElement | null) => {
    if (el) itemRefs.current.set(href, el);
    else itemRefs.current.delete(href);
  };

  const itemClass = (href: string) =>
    cx(
      'relative z-10 block rounded-full px-3 py-2 text-body transition-colors duration-200 xl:px-4',
      href === active ? 'text-green' : 'text-cream/85 hover:text-cream',
    );

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
        {nav.map((item) =>
          'menu' in item ? (
            <li
              key={item.href}
              ref={(el) => {
                if (el) menuItemRefs.current.set(item.menu, el);
                else menuItemRefs.current.delete(item.menu);
              }}
              onMouseEnter={() => hoverIn(item.menu)}
              onMouseLeave={hoverOut}
              onBlur={(event) => {
                if (openMenu === item.menu && !event.currentTarget.contains(event.relatedTarget as Node))
                  close();
              }}
            >
              <button
                ref={(el) => {
                  if (el) menuButtonRefs.current.set(item.menu, el);
                  else menuButtonRefs.current.delete(item.menu);
                  setItemRef(item.href)(el);
                }}
                type="button"
                aria-expanded={openMenu === item.menu}
                aria-controls={`${item.menu}-menu`}
                // A mouse has already opened the menu by hovering, so its click must not close it
                // again; only a keyboard press (detail 0) toggles.
                onClick={(event) =>
                  event.detail === 0 && openMenu === item.menu ? close() : show(item.menu)
                }
                className={cx(itemClass(item.href), 'flex items-center gap-1')}
              >
                {item.label}
                <ChevronIcon
                  width={14}
                  height={14}
                  className={cx(
                    'transition-transform duration-200',
                    openMenu === item.menu ? '-rotate-90' : 'rotate-90',
                  )}
                />
              </button>
              <div
                className={cx(
                  'absolute top-full z-50 transition-[opacity,transform,visibility] duration-200',
                  openMenu === item.menu
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible -translate-y-1 opacity-0',
                  !panelBox && 'hidden',
                )}
                style={
                  panelBox
                    ? { left: panelBox.left, width: panelBox.width, paddingTop: panelBox.bridge }
                    : undefined
                }
              >
                <NavMenuPanel menu={navMenus[item.menu]} id={`${item.menu}-menu`} onNavigate={close} />
              </div>
            </li>
          ) : (
            <li key={item.href}>
              <Link
                ref={setItemRef(item.href)}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={itemClass(item.href)}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
