'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
  WhatsAppIcon,
} from '@/components/ui/icons';
import { PillNav } from '@/components/layout/PillNav';
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Utility strip: scrolls away, unlike the nav bar, but shares its green. */}
      <div className="hidden bg-green text-cream/85 md:block">
        <Container className="flex h-9 items-center justify-between border-b border-cream/12 text-[0.8125rem]">
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
              className="flex h-10 w-10 items-center justify-center rounded-brand border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label={
                site.whatsapp
                  ? 'Message us on WhatsApp'
                  : 'WhatsApp — number pending, opens contact page'
              }
            >
              <WhatsAppIcon width={18} height={18} />
            </a>
            <Button href="/contact?subject=listing" variant="gold" size="sm">
              List Your Property
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-brand border border-cream/30 text-cream lg:hidden"
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
            className="flex h-11 w-11 items-center justify-center rounded-brand border border-cream/30"
          >
            <CloseIcon />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-6">
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-b border-cream/12">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cx(
                    'block py-4 font-display text-2xl',
                    isActive(item.href) ? 'text-gold' : 'text-cream',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3">
            <Link
              href="/contact?subject=listing"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-brand bg-gold px-6 py-3.5 text-base font-medium text-green transition-colors hover:bg-gold-deep hover:text-cream"
            >
              List Your Property
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
