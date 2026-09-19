'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ListingForm } from '@/components/admin/ListingForm';
import { useAdmin } from '@/lib/admin/store';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { state, ready } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading listing…</p>;

  const listing = state.listings.find((l) => l.slug === id);
  if (!listing) {
    return (
      <div className="rounded-brand border border-rule bg-paper p-8 text-center">
        <p className="text-body text-ink">No listing found for &ldquo;{id}&rdquo;.</p>
        <Link
          href="/admin/listings"
          className="mt-3 inline-block text-body text-green underline decoration-gold decoration-2 underline-offset-4"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  return <ListingForm initial={listing} isNew={false} key={listing.slug} />;
}
