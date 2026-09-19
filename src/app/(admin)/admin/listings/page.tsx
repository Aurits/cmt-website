'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { PencilIcon, PlusIcon } from '@/components/admin/icons';
import { StatusPill, type PillTone } from '@/components/admin/StatusPill';
import { Button } from '@/components/ui/Button';
import { categories } from '@/data/categories';
import { useAdmin } from '@/lib/admin/store';
import type { AdminListing, ListingStatus } from '@/lib/admin/types';
import { formatPrice } from '@/lib/format';

type StatusFilter = 'all' | 'for-sale' | 'to-let' | 'draft' | 'archived';

const statusMeta: Record<ListingStatus, { label: string; tone: PillTone }> = {
  published: { label: 'Published', tone: 'positive' },
  draft: { label: 'Draft', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'muted' },
};

export default function AdminListingsPage() {
  const { state, ready, deleteListing } = useAdmin();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    return state.listings.filter((listing) => {
      if (category !== 'all' && listing.category !== category) return false;
      if (status === 'for-sale') return listing.status === 'published' && listing.listingType === 'sale';
      if (status === 'to-let') return listing.status === 'published' && listing.listingType === 'rent';
      if (status === 'draft') return listing.status === 'draft';
      if (status === 'archived') return listing.status === 'archived';
      return true;
    });
  }, [state.listings, category, status]);

  const columns: DataTableColumn<AdminListing>[] = [
    {
      key: 'title',
      header: 'Listing',
      sortValue: (row) => row.title,
      render: (row) => (
        <Link href={`/admin/listings/${row.slug}`} className="flex items-center gap-3">
          <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-brand border border-rule bg-cream-deep">
            {row.images[0] && (
              <Image src={row.images[0].src} alt="" fill unoptimized className="object-cover" />
            )}
          </span>
          <span>
            <span className="block font-medium text-ink hover:text-green">
              {row.title || 'Untitled listing'}
            </span>
            <span className="tnum block text-micro text-muted">{row.reference}</span>
          </span>
        </Link>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortValue: (row) => row.category,
      render: (row) => <span className="capitalize text-body text-ink">{row.category}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      sortValue: (row) => row.price,
      render: (row) => (
        <span className="tnum text-body text-ink">
          {formatPrice(row.price)}
          {row.rentPeriod ? '/mo' : ''}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <span className="text-body text-muted">{row.listingType === 'rent' ? 'To let' : 'For sale'}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortValue: (row) => row.city,
      render: (row) => (
        <span className="text-body text-muted">
          {row.area ? `${row.area}, ` : ''}
          {row.city || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      render: (row) => (
        <StatusPill tone={statusMeta[row.status].tone}>{statusMeta[row.status].label}</StatusPill>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/listings/${row.slug}`}
            className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green"
            aria-label={`Edit ${row.title}`}
          >
            <PencilIcon width={14} height={14} />
          </Link>
          <ConfirmButton onConfirm={() => deleteListing(row.slug)} label="" />
        </div>
      ),
    },
  ];

  if (!ready) return <p className="text-body text-muted">Loading listings…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs
          tabs={[
            { value: 'all', label: 'All categories' },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
          value={category}
          onChange={setCategory}
        />
        <Button href="/admin/listings/new" variant="primary" size="sm">
          <PlusIcon width={16} height={16} /> New listing
        </Button>
      </div>

      <FilterTabs
        tabs={[
          { value: 'all', label: 'All statuses', count: state.listings.length },
          {
            value: 'for-sale',
            label: 'For sale',
            count: state.listings.filter((l) => l.status === 'published' && l.listingType === 'sale').length,
          },
          {
            value: 'to-let',
            label: 'To let',
            count: state.listings.filter((l) => l.status === 'published' && l.listingType === 'rent').length,
          },
          { value: 'draft', label: 'Draft', count: state.listings.filter((l) => l.status === 'draft').length },
          {
            value: 'archived',
            label: 'Archived',
            count: state.listings.filter((l) => l.status === 'archived').length,
          },
        ]}
        value={status}
        onChange={(value) => setStatus(value as StatusFilter)}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.slug || row.reference}
        emptyMessage="No listings match these filters."
      />
    </div>
  );
}
