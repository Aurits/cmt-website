'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MenuIcon } from '@/components/ui/icons';
import {
  InboxIcon,
  ListingsIcon,
  LogoutIcon,
  SearchIcon,
  UsersIcon,
} from '@/components/admin/icons';
import { useAdmin } from '@/lib/admin/store';
import { signOut } from '@/lib/auth/actions';
import { cx } from '@/lib/cx';

const titles: { match: (path: string) => boolean; label: string }[] = [
  { match: (p) => p === '/admin', label: 'Overview' },
  { match: (p) => p === '/admin/listings/new', label: 'New listing' },
  { match: (p) => /^\/admin\/listings\/[^/]+$/.test(p), label: 'Edit listing' },
  { match: (p) => p === '/admin/listings', label: 'Listings' },
  { match: (p) => p === '/admin/agents/new', label: 'New team member' },
  { match: (p) => /^\/admin\/agents\/[^/]+$/.test(p), label: 'Edit team member' },
  { match: (p) => p === '/admin/agents', label: 'Agents & team' },
  { match: (p) => p === '/admin/partners', label: 'Partners & clients' },
  { match: (p) => p === '/admin/testimonials', label: 'Testimonials' },
  { match: (p) => p === '/admin/blog/new', label: 'New post' },
  { match: (p) => /^\/admin\/blog\/[^/]+$/.test(p), label: 'Edit post' },
  { match: (p) => p === '/admin/blog', label: 'Blog' },
  { match: (p) => p === '/admin/inquiries', label: 'Inquiries' },
  { match: (p) => p === '/admin/settings', label: 'Site settings' },
];

function titleFor(pathname: string): string {
  return titles.find((t) => t.match(pathname))?.label ?? 'Admin';
}

type Hit = {
  key: string;
  label: string;
  detail: string;
  href: string;
  kind: 'listing' | 'person' | 'inquiry';
};

/**
 * The CMS top bar, as the admin design draws it: the page title in Fraunces with today's date
 * under it, a search across listings, the team and enquiries, then who is signed in and the
 * sign-out button.
 *
 * The search reads the CMS state already in the browser (AdminProvider), so it needs no request:
 * type, and up to eight matches drop below the field; Enter opens the first.
 */
export function AdminTopbar({ onMenu, adminEmail }: { onMenu: () => void; adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useAdmin();
  const initials = (adminEmail.slice(0, 2) || 'AD').toUpperCase();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  // Phones: the search is a button that opens the field as a full-width row under the bar.
  const [mobileSearch, setMobileSearch] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  // Rendered on both sides; suppressHydrationWarning on the line covers the rare case where the
  // server's clock and the reader's fall either side of midnight.
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const has = (...values: (string | undefined)[]) =>
      values.some((value) => value?.toLowerCase().includes(q));
    return [
      ...state.listings
        .filter((l) => has(l.title, l.reference, l.area, l.city))
        .map((l) => ({
          key: `l-${l.slug}`,
          label: l.title || 'Untitled listing',
          detail: `${l.reference} · ${l.area}, ${l.city}`,
          href: `/admin/listings/${l.slug}`,
          kind: 'listing' as const,
        })),
      ...state.agents
        .filter((a) => has(a.name, a.role))
        .map((a) => ({
          key: `a-${a.id}`,
          label: a.name,
          detail: a.role,
          href: `/admin/agents/${a.id}`,
          kind: 'person' as const,
        })),
      ...state.inquiries
        .filter((i) => has(i.name, i.email, i.phone, i.message))
        .map((i) => ({
          key: `i-${i.id}`,
          label: i.name,
          detail: `${i.type.replace('-', ' ')} enquiry · ${i.status}`,
          href: '/admin/inquiries',
          kind: 'inquiry' as const,
        })),
    ].slice(0, 8);
  }, [query, state.listings, state.agents, state.inquiries]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setMobileSearch(false);
    setQuery('');
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[60px] items-center justify-between gap-4 border-b border-hair bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green/20 text-green lg:hidden"
          aria-label="Open admin menu"
        >
          <MenuIcon width={18} height={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[22px] leading-tight font-semibold text-green">
            {titleFor(pathname)}
          </h1>
          <p className="truncate text-[12.5px] text-muted" suppressHydrationWarning>
            {today} · CMT Realtors
          </p>
        </div>
      </div>

      <div
        ref={boxRef}
        className={cx(
          'w-full md:relative md:block md:max-w-[280px]',
          mobileSearch
            ? 'absolute inset-x-0 top-full block border-b border-hair bg-white p-3 md:static md:border-0 md:bg-transparent md:p-0'
            : 'hidden',
        )}
      >
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (hits[0]) go(hits[0].href);
          }}
        >
          <label htmlFor="admin-search" className="sr-only">
            Search listings, agents and inquiries
          </label>
          <SearchIcon
            width={16}
            height={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
          />
          <input
            id="admin-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false);
                setMobileSearch(false);
              }
            }}
            autoFocus={mobileSearch}
            placeholder="Search listings, agents, inquiries"
            autoComplete="off"
            className="h-10 w-full rounded-full border border-green/15 bg-cream pr-4 pl-10 text-small text-green placeholder:text-muted focus:border-green focus:shadow-[0_0_0_3px_rgb(15_42_26/0.12)] focus:outline-none"
          />
        </form>
        {open && query.trim().length >= 2 && (
          <div className="absolute top-[calc(100%+6px)] right-3 left-3 z-10 overflow-hidden rounded-[18px] md:right-0 md:left-0 border border-green/12 bg-white shadow-[0_24px_48px_-20px_rgba(15,42,26,0.35)]">
            {hits.length === 0 ? (
              <p className="px-4 py-3 text-small text-muted">
                Nothing matches &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              <ul>
                {hits.map((hit) => {
                  const Icon =
                    hit.kind === 'listing'
                      ? ListingsIcon
                      : hit.kind === 'person'
                        ? UsersIcon
                        : InboxIcon;
                  return (
                    <li key={hit.key}>
                      <Link
                        href={hit.href}
                        onClick={() => go(hit.href)}
                        className="flex items-center gap-3 border-b border-hair px-4 py-2.5 last:border-b-0 hover:bg-cream"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tag text-green">
                          <Icon width={14} height={14} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-small font-medium text-green">
                            {hit.label}
                          </span>
                          <span className="block truncate text-[12px] text-muted">
                            {hit.detail}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setMobileSearch((value) => !value)}
          aria-expanded={mobileSearch}
          aria-controls="admin-search"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-green/25 text-green md:hidden"
          aria-label={mobileSearch ? 'Close search' : 'Search'}
        >
          <SearchIcon width={16} height={16} />
        </button>
        <span className="hidden text-small text-green lg:inline">{adminEmail}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-[12px] font-bold text-gold">
          {initials}
        </span>
        {/*
          A form rather than an onClick, because signing out destroys a session row and clears an
          httpOnly cookie, and neither is something the browser can do on its own. It also means
          sign-out survives a failed bundle, which a click handler does not.
        */}
        <form action={signOut}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-green/25 text-green transition-colors hover:bg-green/6"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogoutIcon width={16} height={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
