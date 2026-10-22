'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSite } from '@/components/SiteProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  ChatIcon,
  ChevronDownIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
} from '@/components/ui/icons';
import { Wordmark } from '@/components/layout/Wordmark';
import { PillNav } from '@/components/layout/PillNav';
import { buildNavMenus } from '@/components/layout/NavMenus';
import { nav, site, whatsappHref } from '@/data/site';
import type { NavFacts } from '@/lib/content';
import { cx } from '@/lib/cx';

/**
 * Masthead, as the client's hero design (Hero.html) draws it.
 *
 * Two rows. The utility strip is ink, 40px, and scrolls away: phone and email on the left, the
 * regulator on the right (the right half drops below 960px, as in the design). The nav row sits
 * on the page's own paper rather than on a coloured bar, so the masthead and the hero read as
 * one sheet: the type wordmark, the pill nav, then a round WhatsApp button and the gold
 * "Request a valuation" pill. It stays pinned while the page scrolls, and only once the page has
 * moved does it take a hairline and a slight frost, so at rest it matches the design exactly.
 *
 * The social links moved to the footer (Footer.tsx): the design keeps the strip to the three
 * facts a first-time visitor needs.
 */
export function Header({ facts }: { facts: NavFacts }) {
  const info = useSite();
  const pathname = usePathname();
  // The menus print counts from the repository, read once on the server by the site layout.
  const navMenus = useMemo(() => buildNavMenus(facts), [facts]);
  const [open, setOpen] = useState(false);
  // Pinned masthead: plain paper at rest, a hairline and frost once the page has scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Which drawer section is expanded. A choice only holds on the page it was made on; otherwise
  // the section containing the current page is the one open, so the drawer starts short.
  const [expanded, setExpanded] = useState<{ path: string; href: string | null } | null>(null);

  // Escape closes the drawer, and the page behind it does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // A nav item lights up for its own href and for any extra prefixes it claims (see `nav` in
  // data/site.ts). Only the most specific match lights up, so /contact/list-a-property marks
  // Properties and not Contact as well.
  const matchLength = (item: (typeof nav)[number]) => {
    if (item.href === '/') return pathname === '/' ? 1 : 0;
    const extra = (item as { match?: readonly string[] }).match ?? [];
    return Math.max(
      0,
      ...[item.href, ...extra].filter((prefix) => pathname.startsWith(prefix)).map((p) => p.length),
    );
  };
  const activeHref = nav.reduce<{ href: string | null; length: number }>(
    (best, item) => {
      const length = matchLength(item);
      return length > best.length ? { href: item.href, length } : best;
    },
    { href: null, length: 0 },
  ).href;
  const isActive = (href: string) => href === activeHref;
  const expandedHref = expanded?.path === pathname ? expanded.href : activeHref;

  return (
    <>
      <div className="bg-green text-[13px] text-white/85">
        <Container className="flex min-h-10 flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 min-[601px]:gap-7">
            <a href={info.phone.href} className="inline-flex items-center gap-2 hover:text-gold">
              <PhoneIcon width={16} height={16} />
              <span className="tnum">{info.phone.display}</span>
            </a>
            <a href={`mailto:${info.email}`} className="inline-flex items-center gap-2 hover:text-gold">
              <MailIcon width={16} height={16} />
              {info.email}
            </a>
          </div>
          <p className="hidden items-center gap-2 min-[961px]:inline-flex">
            <ShieldIcon width={16} height={16} />
            Regulated by the {site.regulator}
          </p>
        </Container>
      </div>

      <header
        className={cx(
          'sticky top-0 z-(--z-header) border-b transition-[background-color,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-green/10 bg-cream/90 shadow-[0_10px_30px_-24px_rgba(15,42,26,0.5)] backdrop-blur-md'
            : 'border-transparent bg-cream',
        )}
      >
        <Container className="flex min-h-[92px] items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
            <Wordmark />
          </Link>

          <PillNav isActive={isActive} menus={navMenus} />

          <div className="flex items-center gap-3">
            <a
              href={whatsappHref(info.whatsapp, 'Hello CMT Realtors, I have a property enquiry.')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-green/25 text-green transition-colors hover:bg-green/6"
              aria-label={
                info.whatsapp ? 'Chat on WhatsApp' : 'WhatsApp, number pending. Opens the contact page'
              }
            >
              <ChatIcon width={20} height={20} />
            </a>
            {/* Valuation is the business; listing is a service. The masthead says so. */}
            <Button
              href="/contact/request-a-valuation"
              variant="gold"
              size="sm"
              className="max-nav:hidden"
            >
              Request a valuation
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-green/25 text-green nav:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <MenuIcon width={20} height={20} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer: ink, the design's dark, with the light wordmark. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 z-(--z-drawer) flex flex-col bg-green text-cream nav:hidden"
      >
        <div className="flex min-h-[92px] items-center justify-between border-b border-white/12 px-5 min-[601px]:px-10">
          <Wordmark tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30"
          >
            <CloseIcon />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-6 min-[601px]:px-10">
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-b border-cream/12">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cx(
                      'block flex-1 py-4 font-display text-2xl',
                      isActive(item.href) ? 'text-gold' : 'text-cream',
                    )}
                  >
                    {item.label}
                  </Link>
                  {'menu' in item && (
                    <button
                      type="button"
                      aria-expanded={expandedHref === item.href}
                      aria-controls={`drawer-${item.menu}`}
                      onClick={() =>
                        setExpanded({
                          path: pathname,
                          href: expandedHref === item.href ? null : item.href,
                        })
                      }
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cream"
                    >
                      <ChevronDownIcon
                        width={18}
                        height={18}
                        className={cx(
                          'transition-transform duration-200',
                          expandedHref === item.href && 'rotate-180',
                        )}
                      />
                      <span className="sr-only">{item.label} sections</span>
                    </button>
                  )}
                </div>
                {/* The drawer carries the same menus as the desktop panels, minus the intro:
                    the item itself already links to the section's landing page. */}
                {'menu' in item && expandedHref === item.href && (
                  <ul
                    id={`drawer-${item.menu}`}
                    className="-mt-1 mb-4 space-y-1 border-l border-cream/15 pl-4"
                  >
                    {navMenus[item.menu].schedule.rows.map((row) => (
                      <li key={row.href}>
                        <Link
                          href={row.href}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-lead text-cream/75 hover:text-gold"
                        >
                          {row.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={navMenus[item.menu].feature.cta.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-lead font-medium text-gold"
                      >
                        {navMenus[item.menu].feature.cta.label}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3">
            <Link
              href="/contact/request-a-valuation"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-gold px-[26px] text-body font-semibold text-green hover:brightness-[1.06]"
            >
              Request a valuation
            </Link>
            <Button href={info.phone.href} variant="onDark" size="lg" fullWidth>
              <PhoneIcon width={18} height={18} />
              {info.phone.display}
            </Button>
          </div>

          <p className="mt-8 text-body leading-relaxed text-cream/70">
            {info.address.building}, {info.address.line1}
            <br />
            {info.address.street}, {info.address.city}
          </p>
        </nav>
      </div>
    </>
  );
}
