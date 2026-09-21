'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ImageIcon, PlusIcon, TrashIcon } from '@/components/admin/icons';
import { StatusPill } from '@/components/admin/StatusPill';
import { inputClass } from '@/components/forms/fields';
import { partnerGroups } from '@/data/partners';
import { useAdmin } from '@/lib/admin/store';
import type { AdminPartner } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

export default function AdminPartnersPage() {
  const { state, ready, upsertPartner, deletePartner, reorderPartner, createPartnerDraft } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading partners…</p>;

  return (
    <div className="grid gap-6">
      <p className="text-body text-muted">
        {state.partners.length} logos across {partnerGroups.length} groups. Order here is the order they
        appear on the client conveyor. Upload a logo file directly, or point the path field at a file
        already in <span className="tnum">public/brand/partners/</span>, an uploaded file previews for
        this browser tab only, since there is no image storage backend yet.
      </p>

      {partnerGroups.map((group) => {
        const rows = state.partners.filter((p) => p.groupId === group.id).sort((a, b) => a.order - b.order);
        return (
          <section key={group.id} className="rounded-brand border border-rule bg-paper">
            <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-4">
              <div>
                <h2 className="font-display text-h4 text-green">{group.title}</h2>
                <p className="mt-0.5 text-micro text-muted">{group.description}</p>
              </div>
              <button
                type="button"
                onClick={() => upsertPartner(createPartnerDraft(group.id))}
                className="flex shrink-0 items-center gap-1.5 rounded-control border border-green/35 px-3 py-2 text-micro font-medium text-green transition-colors hover:border-green hover:bg-green/8"
              >
                <PlusIcon width={14} height={14} /> Add
              </button>
            </div>

            <ul className="divide-y divide-rule/70">
              {rows.length === 0 && <li className="px-5 py-6 text-body text-muted">No logos in this group.</li>}
              {rows.map((partner, index) => (
                <PartnerRow
                  key={partner.id}
                  partner={partner}
                  isFirst={index === 0}
                  isLast={index === rows.length - 1}
                  onChange={(patch) => upsertPartner({ ...partner, ...patch })}
                  onMove={(direction) => reorderPartner(partner.id, direction)}
                  onDelete={() => deletePartner(partner.id)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function PartnerRow({
  partner,
  isFirst,
  isLast,
  onChange,
  onMove,
  onDelete,
}: {
  partner: AdminPartner;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<AdminPartner>) => void;
  onMove: (direction: 'up' | 'down') => void;
  onDelete: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange({ logo: URL.createObjectURL(file) });
    event.target.value = '';
  };

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start">
      <span className="relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-brand border border-rule bg-cream">
        {partner.logo ? (
          <Image src={partner.logo} alt="" fill unoptimized className="object-contain p-1.5" />
        ) : (
          <span className="text-micro text-muted">{partner.shortName || partner.name.slice(0, 3) || '—'}</span>
        )}
      </span>

      <div className="grid flex-1 gap-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={partner.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Organisation name"
            className={cx(inputClass, '!py-2')}
          />
          <input
            value={partner.shortName ?? ''}
            onChange={(e) => onChange({ shortName: e.target.value || undefined })}
            placeholder="Short name (optional)"
            className={cx(inputClass, '!py-2')}
          />
        </div>
        <div className="flex gap-2">
          <input
            value={partner.logo ?? ''}
            onChange={(e) => onChange({ logo: e.target.value || undefined })}
            placeholder="/brand/partners/logo.png, or upload one"
            className={cx(inputClass, '!py-2 tnum flex-1')}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex shrink-0 items-center gap-1.5 rounded-control border border-rule-strong px-3 text-micro font-medium text-muted transition-colors hover:border-green/50 hover:text-green"
          >
            <ImageIcon width={14} height={14} /> Upload
          </button>
          <input ref={fileInput} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
        <button
          type="button"
          onClick={() => onChange({ verified: !partner.verified })}
          aria-pressed={partner.verified}
        >
          <StatusPill tone={partner.verified ? 'positive' : 'muted'}>
            {partner.verified ? 'Verified' : 'Unverified'}
          </StatusPill>
        </button>
        <button
          type="button"
          onClick={() => onMove('up')}
          disabled={isFirst}
          aria-label="Move up"
          className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-30"
        >
          <ArrowUpIcon width={14} height={14} />
        </button>
        <button
          type="button"
          onClick={() => onMove('down')}
          disabled={isLast}
          aria-label="Move down"
          className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-30"
        >
          <ArrowDownIcon width={14} height={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove partner"
          className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-flag hover:text-flag"
        >
          <TrashIcon width={14} height={14} />
        </button>
      </div>
    </li>
  );
}
