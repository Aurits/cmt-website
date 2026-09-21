'use client';

import { usePathname } from 'next/navigation';
import { MenuIcon } from '@/components/ui/icons';
import { LogoutIcon } from '@/components/admin/icons';
import { signOut } from '@/lib/auth/actions';

const titles: { match: (path: string) => boolean; label: string }[] = [
  { match: (p) => p === '/admin', label: 'Overview' },
  { match: (p) => p === '/admin/listings/new', label: 'New listing' },
  { match: (p) => /^\/admin\/listings\/[^/]+$/.test(p), label: 'Edit listing' },
  { match: (p) => p === '/admin/listings', label: 'Listings' },
  { match: (p) => p === '/admin/agents/new', label: 'New agent' },
  { match: (p) => /^\/admin\/agents\/[^/]+$/.test(p), label: 'Edit agent' },
  { match: (p) => p === '/admin/agents', label: 'Agents & team' },
  { match: (p) => p === '/admin/partners', label: 'Partners & clients' },
  { match: (p) => p === '/admin/testimonials', label: 'Testimonials' },
  { match: (p) => p === '/admin/inquiries', label: 'Inquiries' },
  { match: (p) => p === '/admin/settings', label: 'Site settings' },
];

function titleFor(pathname: string): string {
  return titles.find((t) => t.match(pathname))?.label ?? 'Admin';
}

/** Identifies who is editing. This is a single-admin prototype, not an auth system. */
export function AdminTopbar({ onMenu, adminEmail }: { onMenu: () => void; adminEmail: string }) {
  const pathname = usePathname();
  const initials = (adminEmail.slice(0, 2) || 'AD').toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-rule bg-paper px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-control border border-rule-strong text-green lg:hidden"
          aria-label="Open admin menu"
        >
          <MenuIcon width={18} height={18} />
        </button>
        <h1 className="font-display text-h4 text-green">{titleFor(pathname)}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="hidden text-micro text-muted sm:inline">{adminEmail}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-control bg-green text-micro font-medium text-gold">
          {initials}
        </span>
        {/*
          A form rather than an onClick, because signing out now destroys a session row and
          clears an httpOnly cookie, and neither is something the browser can do on its own.
          It also means sign-out survives a failed bundle, which a click handler does not.
        */}
        <form action={signOut}>
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green"
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
