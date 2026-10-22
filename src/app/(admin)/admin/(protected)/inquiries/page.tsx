'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { ArrowRightIcon } from '@/components/admin/icons';
import { PageToolbar, iconButtonClass, softButtonClass } from '@/components/admin/PageToolbar';
import { StatusPill, type PillTone } from '@/components/admin/StatusPill';
import { CloseIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { assetBySlug, purposeBySlug } from '@/data/valuations';
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

const statusTone: Record<InquiryStatus, PillTone> = {
  New: 'attention',
  'In Progress': 'neutral',
  Contacted: 'positive',
  Closed: 'muted',
};

function formatDate(iso: string, withTime = false): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

/** International digits for wa.me, from whatever the visitor typed. */
function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `256${digits.slice(1)}` : digits;
}

/**
 * Enquiries. The table is for scanning (who, what kind, when, status); choosing a row opens it in
 * a panel on the right with the whole message, one-tap ways to reply, what a valuation request
 * actually asked for and the page it came from. The table used to clip every message to two lines
 * with no way to read the rest, which made it a list of people you could not answer.
 */
export default function AdminInquiriesPage() {
  const { state, ready, setInquiryStatus } = useAdmin();
  const [status, setStatus] = useState<'all' | InquiryStatus>('all');
  const [type, setType] = useState<'all' | InquiryType>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.inquiries.filter((inquiry) => {
      if (status !== 'all' && inquiry.status !== status) return false;
      if (type !== 'all' && inquiry.type !== type) return false;
      if (
        q &&
        ![inquiry.name, inquiry.email, inquiry.phone, inquiry.message].some((value) =>
          value?.toLowerCase().includes(q),
        )
      )
        return false;
      return true;
    });
  }, [state.inquiries, status, type, query]);

  const open = state.inquiries.find((inquiry) => inquiry.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId]);

  const columns: DataTableColumn<Inquiry>[] = [
    {
      key: 'contact',
      header: 'Contact',
      sortValue: (row) => row.name,
      render: (row) => (
        <button type="button" onClick={() => setOpenId(row.id)} className="text-left">
          <span className="block font-medium text-green hover:text-moss">{row.name}</span>
          <span className="tnum block text-[12.5px] text-muted">
            {row.phone ?? row.email ?? ''}
          </span>
        </button>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortValue: (row) => row.type,
      render: (row) => <span className="text-small text-muted">{typeLabels[row.type]}</span>,
    },
    {
      key: 'message',
      header: 'Message',
      render: (row) => (
        <p className="line-clamp-2 max-w-[38ch] text-small text-green">{row.message}</p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortValue: (row) => row.createdAt,
      render: (row) => (
        <span className="tnum text-[12.5px] text-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      render: (row) => <StatusPill tone={statusTone[row.status]}>{row.status}</StatusPill>,
    },
    {
      key: 'open',
      header: '',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setOpenId(row.id)}
          className={iconButtonClass}
          aria-label={`Open the enquiry from ${row.name}`}
        >
          <ArrowRightIcon width={14} height={14} />
        </button>
      ),
    },
  ];

  if (!ready) return <p className="text-body text-muted">Loading inquiries…</p>;

  const fresh = state.inquiries.filter((i) => i.status === 'New').length;

  return (
    <div className="grid gap-5">
      <PageToolbar
        summary={
          <>
            <span className="font-semibold text-green">{state.inquiries.length}</span> received,{' '}
            {fresh === 0 ? 'none waiting for a first reply' : `${fresh} waiting for a first reply`}
          </>
        }
        search={query}
        onSearch={setQuery}
        searchLabel="Search name, contact or message"
      />

      <div className="flex flex-wrap items-center gap-3">
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
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.id}
        emptyMessage={
          state.inquiries.length === 0
            ? 'No enquiries yet. They arrive here from the forms on the site.'
            : 'No enquiries match these filters.'
        }
      />

      {open && (
        <>
          <button
            type="button"
            aria-label="Close the enquiry"
            onClick={() => setOpenId(null)}
            className="fixed inset-0 z-40 bg-green/40"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-[-24px_0_60px_-24px_rgba(15,42,26,0.4)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-hair px-6 py-5">
              <div>
                <p className="text-[11.5px] font-semibold tracking-[0.14em] text-moss uppercase">
                  {typeLabels[open.type]}
                </p>
                <h2
                  id="inquiry-title"
                  className="mt-1 font-display text-[22px] font-semibold text-green"
                >
                  {open.name}
                </h2>
                <p className="tnum mt-0.5 text-[12.5px] text-muted">
                  Received {formatDate(open.createdAt, true)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className={iconButtonClass}
                aria-label="Close"
                autoFocus
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-wrap gap-2">
                {open.phone && (
                  <a href={`tel:${open.phone.replace(/\s+/g, '')}`} className={softButtonClass}>
                    <PhoneIcon width={14} height={14} /> Call
                  </a>
                )}
                {open.email && (
                  <a href={`mailto:${open.email}`} className={softButtonClass}>
                    <MailIcon width={14} height={14} /> Email
                  </a>
                )}
                {open.phone && (
                  <a
                    href={`https://wa.me/${whatsappNumber(open.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={softButtonClass}
                  >
                    <WhatsAppIcon width={14} height={14} /> WhatsApp
                  </a>
                )}
              </div>

              <dl className="mt-5 text-small">
                {[
                  ['Phone', open.phone],
                  ['Email', open.email],
                  [
                    'What needs valuing',
                    open.valuationAsset
                      ? (assetBySlug[open.valuationAsset as keyof typeof assetBySlug]?.name ??
                        open.valuationAsset)
                      : undefined,
                  ],
                  [
                    'What the figure is for',
                    open.valuationPurpose
                      ? (purposeBySlug[open.valuationPurpose as keyof typeof purposeBySlug]?.name ??
                        open.valuationPurpose)
                      : undefined,
                  ],
                  ['Sent from', open.sourcePath],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 border-t border-hair py-2.5"
                    >
                      <dt className="text-muted">{label}</dt>
                      <dd className="tnum text-right break-all text-green">{value}</dd>
                    </div>
                  ))}
              </dl>

              <h3 className="mt-6 text-[11.5px] font-semibold tracking-[0.14em] text-green/70 uppercase">
                Message
              </h3>
              <p className="mt-2 border border-hair bg-cream/60 p-4 text-body leading-relaxed whitespace-pre-wrap text-green">
                {open.message}
              </p>

              {open.listingSlug && (
                <Link
                  href={`/admin/listings/${open.listingSlug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-green hover:text-moss"
                >
                  Open the related listing
                  <ArrowRightIcon width={14} height={14} />
                </Link>
              )}
            </div>

            <div className="border-t border-hair px-6 py-4">
              <AdminSelectField
                id={`status-${open.id}`}
                label="Status"
                value={open.status}
                onChange={(value) => setInquiryStatus(open.id, value as InquiryStatus)}
                options={statusOptions}
              />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
