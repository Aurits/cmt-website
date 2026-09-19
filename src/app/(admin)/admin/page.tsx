'use client';

import Link from 'next/link';
import { MetricCard } from '@/components/admin/MetricCard';
import { StatusPill } from '@/components/admin/StatusPill';
import { BuildingIcon, HandshakeIcon, InboxIcon, PlusIcon, UsersIcon } from '@/components/admin/icons';
import { useAdmin } from '@/lib/admin/store';
import { formatPrice } from '@/lib/format';
import { cx } from '@/lib/cx';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function AdminOverviewPage() {
  const { state, ready } = useAdmin();

  if (!ready) {
    return <p className="text-body text-muted">Loading the admin session…</p>;
  }

  const activeListings = state.listings.filter((l) => l.status === 'published');
  const pendingInquiries = state.inquiries.filter((i) => i.status === 'New');

  const recentListings = [...state.listings]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 4)
    .map((listing) => ({
      key: `listing-${listing.slug}`,
      icon: <BuildingIcon width={16} height={16} className="text-gold-deep" />,
      text: (
        <>
          <span className="font-medium text-ink">{listing.title || 'Untitled listing'}</span>{' '}
          updated — {formatPrice(listing.price)}
        </>
      ),
      when: listing.updatedAt,
    }));

  const recentInquiries = [...state.inquiries]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4)
    .map((inquiry) => ({
      key: `inquiry-${inquiry.id}`,
      icon: <InboxIcon width={16} height={16} className="text-gold-deep" />,
      text: (
        <>
          <span className="font-medium text-ink">{inquiry.name}</span> sent a{' '}
          {inquiry.type.replace('-', ' ')} enquiry
        </>
      ),
      when: inquiry.createdAt,
    }));

  const activity = [...recentListings, ...recentInquiries]
    .sort((a, b) => (a.when < b.when ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active listings"
          value={activeListings.length}
          hint={`${state.listings.length} total, including drafts and archived`}
        />
        <MetricCard
          label="Pending inquiries"
          value={pendingInquiries.length}
          hint={`${state.inquiries.length} received in total`}
        />
        <MetricCard label="Partners & clients" value={state.partners.length} hint="Across all groups" />
        <MetricCard label="Active agents" value={state.agents.length} hint="Directors, valuers and agents" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-brand border border-rule bg-paper">
          <div className="border-b border-rule px-5 py-4">
            <h2 className="font-display text-h4 text-green">Recent activity</h2>
          </div>
          <ul className="divide-y divide-rule/70">
            {activity.length === 0 && (
              <li className="px-5 py-6 text-body text-muted">Nothing has happened yet.</li>
            )}
            {activity.map((entry) => (
              <li key={entry.key} className="flex items-start gap-3 px-5 py-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-gold/15">
                  {entry.icon}
                </span>
                <p className="text-body text-ink">{entry.text}</p>
                <span className="ml-auto shrink-0 text-micro text-muted">{relativeTime(entry.when)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-brand border border-rule bg-paper">
          <div className="border-b border-rule px-5 py-4">
            <h2 className="font-display text-h4 text-green">Quick actions</h2>
          </div>
          <div className="grid gap-2.5 p-5">
            {[
              { href: '/admin/listings/new', label: 'New listing', icon: BuildingIcon },
              { href: '/admin/agents/new', label: 'Add a team member', icon: UsersIcon },
              { href: '/admin/partners', label: 'Add a partner logo', icon: HandshakeIcon },
              { href: '/admin/inquiries', label: 'Review inquiries', icon: InboxIcon },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cx(
                  'flex items-center gap-3 rounded-control border border-rule-strong px-4 py-3 text-body text-ink transition-colors hover:border-green/50 hover:bg-green/5',
                )}
              >
                <action.icon width={18} height={18} className="text-green" />
                {action.label}
                <PlusIcon width={15} height={15} className="ml-auto text-muted" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {pendingInquiries.length > 0 && (
        <section className="rounded-brand border border-gold/40 bg-gold/8 px-5 py-4">
          <p className="flex flex-wrap items-center gap-2 text-body text-ink">
            <StatusPill tone="attention">{pendingInquiries.length} new</StatusPill>
            {pendingInquiries.length === 1 ? 'inquiry needs' : 'inquiries need'} a first response.
            <Link
              href="/admin/inquiries"
              className="ml-1 font-medium text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep"
            >
              Go to inquiries
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
