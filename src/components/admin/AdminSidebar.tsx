'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  FileTextIcon,
  GridIcon,
  InboxIcon,
  ListingsIcon,
  MessageIcon,
  PanelCloseIcon,
  PanelOpenIcon,
  SlidersIcon,
  UsersIcon,
} from '@/components/admin/icons';
import { cx } from '@/lib/cx';

/*
 * Three groups, in the order an editor reaches for them: the day's work (what is on the books and
 * who has written in), the people the site names, and the website's own pages and settings.
 */
const groups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', href: '/admin', icon: GridIcon, exact: true },
      { label: 'Listings', href: '/admin/listings', icon: ListingsIcon },
      { label: 'Inquiries', href: '/admin/inquiries', icon: InboxIcon },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Agents & team', href: '/admin/agents', icon: UsersIcon },
      { label: 'Partners & clients', href: '/admin/partners', icon: BriefcaseIcon },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageIcon },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Blog', href: '/admin/blog', icon: FileTextIcon },
      { label: 'Site settings', href: '/admin/settings', icon: SlidersIcon },
    ],
  },
] as const;

/**
 * The CMS rail, as the admin design draws it: ink, with the CMT wordmark in gold beside a "CMS"
 * tag, the sections under small capital labels, and the current page as a solid gold bar. Square,
 * like everything in the admin (.admin-sharp). A fixed rail rather than a sticky bar, because an
 * editor spends the session here rather than passing through.
 *
 * COLLAPSIBLE on a desktop: the button at the foot folds it to a 72px rail of icons (each named by
 * a tooltip and to screen readers) and back, and AdminShell remembers the choice. On a phone it is
 * the slide-in drawer and always shows its labels, so `collapsed` only takes effect from lg.
 */
export function AdminSidebar({
  mobileOpen,
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
}: {
  mobileOpen: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  // Classes that apply only when folded, and only on a desktop.
  const folded = (classes: string) => (collapsed ? classes : '');
  const rowClass = cx(
    'flex items-center gap-3 px-3 py-[9px] text-small font-medium transition-colors',
    folded('lg:justify-center lg:px-0 lg:py-2.5'),
  );

  return (
    <aside
      className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col bg-green text-white transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        folded('lg:w-[72px]'),
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <Link
        href="/admin"
        onClick={onNavigate}
        aria-label="CMT Realtors CMS, overview"
        className={cx(
          'flex h-[60px] shrink-0 items-center gap-3 border-b border-white/12 px-5',
          folded('lg:justify-center lg:px-0'),
        )}
      >
        <span className="font-display text-[26px] leading-none font-bold tracking-[-0.01em] text-gold">
          CMT
        </span>
        <span aria-hidden="true" className={cx('h-5 w-px bg-white/25', folded('lg:hidden'))} />
        <span
          className={cx('text-[11px] font-bold tracking-[0.18em] text-white', folded('lg:hidden'))}
        >
          CMS
        </span>
      </Link>

      <nav aria-label="Admin" className="flex-1 overflow-x-hidden overflow-y-auto py-5">
        {groups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p
              className={cx(
                'mb-2 px-5 text-[11px] font-semibold tracking-[0.14em] text-white/55 uppercase',
                folded('lg:sr-only'),
              )}
            >
              {group.label}
            </p>
            {/* Folded, a short rule stands in for the group label. */}
            <span
              aria-hidden="true"
              className={cx('mx-5 mb-2 hidden h-px bg-white/12', folded('lg:block'))}
            />
            <ul className="grid gap-0.5 px-2.5">
              {group.items.map((item) => {
                const active = isActive(item.href, 'exact' in item ? item.exact : false);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cx(
                        rowClass,
                        active
                          ? 'bg-gold text-green'
                          : 'text-white/88 hover:bg-white/8 hover:text-white',
                      )}
                    >
                      <Icon
                        width={18}
                        height={18}
                        className={cx('shrink-0', active ? 'text-green' : 'text-white/80')}
                      />
                      <span className={folded('lg:sr-only')}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="grid gap-0.5 border-t border-white/12 px-2.5 py-3">
        <Link
          href="/"
          title={collapsed ? 'Back to the live site' : undefined}
          className={cx(rowClass, 'text-white/88 hover:bg-white/8 hover:text-white')}
        >
          <ArrowUpRightIcon width={18} height={18} className="shrink-0 text-white/80" />
          <span className={folded('lg:sr-only')}>Back to the live site</span>
        </Link>
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand the menu' : undefined}
            className={cx(
              rowClass,
              'hidden text-white/70 hover:bg-white/8 hover:text-white lg:flex',
            )}
          >
            {collapsed ? (
              <PanelOpenIcon width={18} height={18} className="shrink-0" />
            ) : (
              <PanelCloseIcon width={18} height={18} className="shrink-0" />
            )}
            <span className={folded('lg:sr-only')}>
              {collapsed ? 'Expand the menu' : 'Collapse the menu'}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
