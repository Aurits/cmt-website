'use client';

import Link from 'next/link';
import { MetricCard } from '@/components/admin/MetricCard';
import {
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingIcon,
  CheckIcon,
  FactoryIcon,
  HouseIcon,
  InboxIcon,
  ListingsIcon,
  MapIcon,
  PlusIcon,
  SproutIcon,
  UsersIcon,
} from '@/components/admin/icons';
import { AutoRefresh } from '@/components/admin/AutoRefresh';
import { useAdmin } from '@/lib/admin/store';
import type { CategorySlug } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { cx } from '@/lib/cx';

function relativeTime(iso: string): string {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/* Each listing's mark in the activity list is its property type, so the list can be scanned. */
const categoryIcon: Record<CategorySlug, typeof HouseIcon> = {
  residential: HouseIcon,
  commercial: BuildingIcon,
  industrial: FactoryIcon,
  land: MapIcon,
  agricultural: SproutIcon,
};

const quickActions = [
  { href: '/admin/listings/new', label: 'New listing', icon: ListingsIcon, mark: 'plus' },
  { href: '/admin/agents/new', label: 'Add a team member', icon: UsersIcon, mark: 'plus' },
  { href: '/admin/partners', label: 'Add a partner logo', icon: BriefcaseIcon, mark: 'plus' },
  { href: '/admin/inquiries', label: 'Review inquiries', icon: InboxIcon, mark: 'arrow' },
] as const;

/**
 * The CMS overview, as the admin design lays it out: four figures across the top, then what has
 * changed most recently beside the four things an editor most often comes here to do. Square
 * throughout (.admin-sharp); the only round shapes are the icon discs and the action marks.
 */
export default function AdminOverviewPage() {
  const { state, ready } = useAdmin();

  if (!ready) {
    return <p className="text-body text-muted">Loading the admin session…</p>;
  }

  const activeListings = state.listings.filter((l) => l.status === 'published');
  const pendingInquiries = state.inquiries.filter((i) => i.status === 'New');

  const activity = [
    ...state.listings.map((listing) => ({
      key: `listing-${listing.slug}`,
      Icon: categoryIcon[listing.category] ?? BuildingIcon,
      title: listing.title || 'Untitled listing',
      tag:
        listing.status === 'published'
          ? 'Updated'
          : listing.status === 'draft'
            ? 'Draft'
            : 'Archived',
      kind: 'Listing',
      figure: formatPrice(listing.price),
      when: listing.updatedAt,
      href: `/admin/listings/${listing.slug}`,
    })),
    ...state.inquiries.map((inquiry) => ({
      key: `inquiry-${inquiry.id}`,
      Icon: InboxIcon,
      title: inquiry.name,
      tag: inquiry.status,
      kind: `${inquiry.type.replace('-', ' ')} enquiry`,
      figure: '',
      when: inquiry.createdAt,
      href: '/admin/inquiries',
    })),
  ]
    .sort((a, b) => (a.when < b.when ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="grid gap-5">
      {/* New enquiries arrive from the public forms; pick them up while this is open. */}
      <AutoRefresh />
      {/* Two across from the smallest screen: one per row put the whole first screen of a phone
          into four numbers. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          label="Active listings"
          value={activeListings.length}
          icon={<ListingsIcon width={17} height={17} />}
          hint={`${state.listings.length} total, including drafts and archived`}
        />
        <MetricCard
          label="Pending inquiries"
          value={pendingInquiries.length}
          icon={<InboxIcon width={17} height={17} />}
          badge={
            pendingInquiries.length === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2 py-0.5 text-[12px] font-semibold text-moss">
                <CheckIcon width={12} height={12} />
                All clear
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-tag px-2 py-0.5 text-[12px] font-semibold text-tag-ink">
                {pendingInquiries.length} new
              </span>
            )
          }
          hint={`${state.inquiries.length} received in total`}
        />
        <MetricCard
          label="Partners & clients"
          value={state.partners.length}
          icon={<BriefcaseIcon width={17} height={17} />}
          hint="Across all groups"
        />
        <MetricCard
          label="Active agents"
          value={state.agents.filter((agent) => agent.listed !== false).length}
          icon={<UsersIcon width={17} height={17} />}
          hint="Directors, valuers and agents"
        />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1.45fr_1fr]">
        <section className="border border-green/10 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-hair px-5 py-4">
            <h2 className="font-display text-[19px] font-semibold text-green">Recent activity</h2>
            <Link
              href="/admin/listings"
              className="inline-flex items-center gap-1.5 text-small font-medium text-green hover:text-moss"
            >
              View all listings
              <ArrowRightIcon width={14} height={14} />
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="px-5 py-6 text-body text-muted">Nothing has happened yet.</p>
          ) : (
            <ul>
              {activity.map((entry) => (
                <li key={entry.key} className="border-b border-hair last:border-b-0">
                  <Link
                    href={entry.href}
                    className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-cream/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tag text-green">
                      <entry.Icon width={16} height={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium text-green">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted">
                        <span className="rounded-[4px] bg-tag px-1.5 py-px text-[11px] font-semibold text-tag-ink">
                          {entry.tag}
                        </span>
                        <span className="capitalize">{entry.kind}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      {entry.figure && (
                        <span className="tnum block font-display text-[15px] font-semibold text-green">
                          {entry.figure}
                        </span>
                      )}
                      <span className="block text-[12px] text-muted">
                        {relativeTime(entry.when)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-green/10 bg-white">
          <div className="border-b border-hair px-5 py-4">
            <h2 className="font-display text-[19px] font-semibold text-green">Quick actions</h2>
          </div>
          <div className="grid gap-2.5 p-5">
            {quickActions.map((action, index) => {
              const primary = index === 0;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cx(
                    'flex min-h-[46px] items-center gap-3 rounded-full border py-1.5 pr-1.5 pl-4 text-small font-semibold transition-colors',
                    primary
                      ? 'border-green bg-green text-white hover:brightness-125'
                      : 'border-green/15 text-green hover:bg-cream',
                  )}
                >
                  <action.icon
                    width={17}
                    height={17}
                    className={primary ? 'text-white' : 'text-green'}
                  />
                  {action.label}
                  <span
                    aria-hidden="true"
                    className={cx(
                      'ml-auto flex h-8 w-8 items-center justify-center rounded-full',
                      primary ? 'bg-gold text-green' : 'bg-tag text-green',
                    )}
                  >
                    {action.mark === 'plus' ? (
                      <PlusIcon width={15} height={15} />
                    ) : (
                      <ArrowRightIcon width={15} height={15} />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
