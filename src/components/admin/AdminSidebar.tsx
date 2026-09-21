'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BuildingIcon,
  GearIcon,
  GridIcon,
  HandshakeIcon,
  InboxIcon,
  LogoutIcon,
  NotesIcon,
  QuoteIcon,
  UsersIcon,
} from '@/components/admin/icons';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';

const items = [
  { label: 'Overview', href: '/admin', icon: GridIcon, exact: true },
  { label: 'Listings', href: '/admin/listings', icon: BuildingIcon },
  { label: 'Agents & team', href: '/admin/agents', icon: UsersIcon },
  { label: 'Partners & clients', href: '/admin/partners', icon: HandshakeIcon },
  { label: 'Blog', href: '/admin/blog', icon: NotesIcon },
  { label: 'Testimonials', href: '/admin/testimonials', icon: QuoteIcon },
  { label: 'Inquiries', href: '/admin/inquiries', icon: InboxIcon },
  { label: 'Site settings', href: '/admin/settings', icon: GearIcon },
] as const;

/**
 * The CMS masthead-equivalent: same brand green as the public Header, so the admin still
 * reads as CMT's own tool, but its own layout — a fixed rail rather than a sticky bar,
 * because an admin spends the session here rather than passing through.
 */
export function AdminSidebar({
  mobileOpen,
  onNavigate,
}: {
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col bg-green text-cream transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <Link
        href="/admin"
        className="flex h-[80px] shrink-0 items-center border-b border-cream/12 px-6"
        onClick={onNavigate}
      >
        <Image
          src="/brand/cmt-logo.png"
          alt={site.name}
          width={900}
          height={431}
          className="h-10 w-auto shrink-0"
        />
        <span className="ml-3 border-l border-cream/25 pl-3 text-micro uppercase tracking-[0.14em] text-cream/70">
          CMS
        </span>
      </Link>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="grid gap-1">
          {items.map((item) => {
            const active = isActive(item.href, 'exact' in item ? item.exact : false);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'flex items-center gap-3 rounded-control px-3.5 py-2.5 text-body transition-colors',
                    active
                      ? 'bg-gold text-green font-medium'
                      : 'text-cream/85 hover:bg-cream/10 hover:text-cream',
                  )}
                >
                  <Icon width={18} height={18} className={active ? 'text-green' : 'text-gold'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-cream/12 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-control px-3.5 py-2.5 text-body text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <LogoutIcon width={18} height={18} className="text-gold" />
          Back to the live site
        </Link>
      </div>
    </aside>
  );
}
