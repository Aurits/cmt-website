'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  ChevronIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
  WhatsAppIcon,
} from '@/components/ui/icons';
import { PillNav } from '@/components/layout/PillNav';
import { navMenus } from '@/components/layout/NavMenus';
import { nav, site, whatsappHref } from '@/data/site';
import { cx } from '@/lib/cx';

/**
 * Masthead.
 *
 * Everything green on this site is one colour — the green inside the logo tile — so the
 * badge merges into the bar instead of reading as a pasted-on rectangle. The utility strip
 * carries that same green and is divided from the nav by a hairline rather than by a
 * change of colour: one continuous green block, articulated by rules.
 *
 * The gold hairline along the bottom edge marks where the masthead ends, which matters now
 * that the page header below it is the same green.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
      {/* Utility strip: scrolls away, unlike the nav bar, but shares its green. */}
      <div className="hidden bg-green text-cream/85 md:block">
        <Container className="flex h-9 items-center justify-between border-b border-cream/12 text-micro">
          <div className="flex items-center gap-6">
            <a href={site.phone.href} className="flex items-center gap-2 hover:text-gold">
              <PhoneIcon width={14} height={14} />
              <span className="tnum">{site.phone.display}</span>
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-gold">
              <MailIcon width={14} height={14} />
              {site.email}
            </a>
          </div>
          <p className="flex items-center gap-2 text-cream/70">
            <ShieldIcon width={14} height={14} />
            Regulated by the {site.regulator}
          </p>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-gold/45 bg-green">
        <Container className="flex h-[80px] items-center justify-between gap-6 lg:h-[92px] xl:h-[104px]">
          {/*
            The badge carries 120px of its own left padding (16-20px once rendered).
            Invisible while the tile was, but now that the green matches, it reads as the
            wordmark being indented from everything below it — so the link is pulled back
            by that amount to sit flush with the page margin.

            The offset lives on the LINK, not on the image. The image is a flex item here,
            and a negative margin on a shrinkable flex item reduces its resolved width:
            with the height pinned, that squashed the mark horizontally (ratio 1.81 against
            a true 2.088). shrink-0 on both is the belt to that braces.
          */}
          <Link
            href="/"
            className="-ml-4 flex shrink-0 items-center lg:-ml-[18px] xl:-ml-5"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/brand/cmt-logo.png"
              alt={site.name}
              width={900}
              height={431}
              priority
              className="h-14 w-auto shrink-0 lg:h-16 xl:h-[72px]"
            />
          </Link>

          <PillNav isActive={isActive} />

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={whatsappHref('Hello CMT Realtors, I have a property enquiry.')}
              className="flex h-10 w-10 items-center justify-center rounded-control border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label={
                site.whatsapp
                  ? 'Message us on WhatsApp'
                  : 'WhatsApp, number pending. Opens the contact page'
              }
            >
              <WhatsAppIcon width={18} height={18} />
            </a>
            {/* Valuation is the business; listing is a service. The masthead says so. */}
            <Button href="/contact/request-a-valuation" variant="gold" size="sm">
              Request a valuation
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-control border border-cream/30 text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </button>
        </Container>
      </header>

      {/* Mobile drawer: same green, so the mark merges here too. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-green text-cream lg:hidden"
      >
        <div className="flex h-[80px] items-center justify-between border-b border-cream/15 px-4">
          <Image
            src="/brand/cmt-logo.png"
            alt={site.name}
            width={900}
            height={431}
            className="-ml-4 h-14 w-auto shrink-0"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-control border border-cream/30"
          >
            <CloseIcon />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-6">
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
                      className="flex h-11 w-11 items-center justify-center rounded-control border border-cream/20 text-cream"
                    >
                      <ChevronIcon
                        width={18}
                        height={18}
                        className={cx(
                          'transition-transform duration-200',
                          expandedHref === item.href ? '-rotate-90' : 'rotate-90',
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
                          className="block py-1.5 text-base text-cream/75 hover:text-gold"
                        >
                          {row.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={navMenus[item.menu].feature.cta.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-base font-medium text-gold"
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
              className="inline-flex items-center justify-center whitespace-nowrap rounded-control bg-gold px-6 py-3.5 text-base font-medium text-green transition-colors hover:bg-gold-deep hover:text-cream"
            >
              Request a valuation
            </Link>
            <Button href={site.phone.href} variant="onDark" size="lg" fullWidth>
              <PhoneIcon width={18} height={18} />
              {site.phone.display}
            </Button>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-cream/70">
            {site.address.building}, {site.address.line1}
            <br />
            {site.address.street}, {site.address.city}
          </p>
        </nav>
      </div>
    </>
  );
}
