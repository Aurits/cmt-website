'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { useAdmin } from '@/lib/admin/store';
import type { Inquiry, InquiryStatus, InquiryType } from '@/lib/admin/types';

const typeLabels: Record<InquiryType, string> = {
  valuation: 'Request a valuation',
  'agent-contact': 'Contact agent',
  'list-a-property': 'List a property',
  general: 'General enquiry',
};

const statusOptions: { value: InquiryStatus; label: string }[] = [
  { value: 'New', label: 'New' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Closed', label: 'Closed' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminInquiriesPage() {
  const { state, ready, setInquiryStatus } = useAdmin();
  const [status, setStatus] = useState<'all' | InquiryStatus>('all');
  const [type, setType] = useState<'all' | InquiryType>('all');

  const filtered = useMemo(() => {
    return state.inquiries.filter((inquiry) => {
      if (status !== 'all' && inquiry.status !== status) return false;
      if (type !== 'all' && inquiry.type !== type) return false;
      return true;
    });
  }, [state.inquiries, status, type]);

  const columns: DataTableColumn<Inquiry>[] = [
    {
      key: 'contact',
      header: 'Contact',
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="font-medium text-ink">{row.name}</p>
          <p className="tnum text-micro text-muted">{row.phone ?? row.email ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortValue: (row) => row.type,
      render: (row) => <span className="text-body text-muted">{typeLabels[row.type]}</span>,
    },
    {
      key: 'message',
      header: 'Message',
      render: (row) => (
        <div>
          <p className="line-clamp-2 max-w-[36ch] text-body text-ink">{row.message}</p>
          {row.listingSlug && (
            <Link
              href={`/admin/listings/${row.listingSlug}`}
              className="mt-1 inline-block text-micro text-green underline decoration-gold decoration-2 underline-offset-4"
            >
              Related listing
            </Link>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortValue: (row) => row.createdAt,
      render: (row) => <span className="tnum text-micro text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="w-44">
          <AdminSelectField
            id={`status-${row.id}`}
            label={`Status for ${row.name}`}
            hideLabel
            value={row.status}
            onChange={(value) => setInquiryStatus(row.id, value as InquiryStatus)}
            options={statusOptions}
          />
        </div>
      ),
    },
  ];

  if (!ready) return <p className="text-body text-muted">Loading inquiries…</p>;

  return (
    <div className="grid gap-6">
      <FilterTabs
        tabs={[
          { value: 'all', label: 'All statuses', count: state.inquiries.length },
          ...statusOptions.map((option) => ({
            value: option.value,
            label: option.label,
            count: state.inquiries.filter((i) => i.status === option.value).length,
          })),
        ]}
        value={status}
        onChange={(value) => setStatus(value as typeof status)}
      />
      <FilterTabs
        tabs={[
          { value: 'all', label: 'All types' },
          ...Object.entries(typeLabels).map(([value, label]) => ({ value, label })),
        ]}
        value={type}
        onChange={(value) => setType(value as typeof type)}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.id}
        emptyMessage="No inquiries match these filters."
      />
    </div>
  );
}
