'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImageIcon,
  PlusIcon,
  TrashIcon,
} from '@/components/admin/icons';
import { softButtonClass } from '@/components/admin/PageToolbar';
import { StatusPill } from '@/components/admin/StatusPill';
import { inputClass } from '@/components/forms/fields';
import { partnerGroups } from '@/data/partners';
import { useAdmin } from '@/lib/admin/store';
import { uploadImage } from '@/lib/admin/upload';
import type { AdminPartner } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

export default function AdminPartnersPage() {
  const { state, ready, upsertPartner, deletePartner, reorderPartner, createPartnerDraft } =
    useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading partners…</p>;

  return (
    <div className="grid gap-6">
      <p className="text-body text-muted">
        {state.partners.length} logos across {partnerGroups.length} groups. Order here is the order
        they appear on the client belt. Upload a logo (JPEG, PNG or WebP, up to 8MB) and it goes
        straight to the site&rsquo;s image storage, or point the path field at a file already in{' '}
        <span className="tnum">public/brand/partners/</span>.
      </p>

      {partnerGroups.map((group) => {
        const rows = state.partners
          .filter((p) => p.groupId === group.id)
          .sort((a, b) => a.order - b.order);
        return (
          <section key={group.id} className="border border-green/10 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-hair px-5 py-4">
              <div>
                <h2 className="font-display text-h4 text-green">{group.title}</h2>
                <p className="mt-0.5 text-micro text-muted">{group.description}</p>
              </div>
              <button
                type="button"
                onClick={() => upsertPartner(createPartnerDraft(group.id))}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-green/20 px-4 py-2 text-small font-medium text-green transition-colors hover:bg-cream"
              >
                <PlusIcon width={14} height={14} /> Add
              </button>
            </div>

            <ul className="divide-y divide-hair">
              {rows.length === 0 && (
                <li className="px-5 py-6 text-body text-muted">No logos in this group.</li>
              )}
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
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  /*
   * The file goes to the image storage through the same checked server action as listing photos
   * (lib/admin/upload.ts), and the logo field takes the stored URL. It used to take a blob: URL
   * from URL.createObjectURL, which showed in this tab and was saved to the database as a link
   * that worked for nobody else, so the public belt showed a broken image.
   */
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadError(null);
    startUpload(async () => {
      const body = new FormData();
      body.set('file', file);
      body.set('folder', 'partners');
      const result = await uploadImage(body);
      if (result.error || !result.url) {
        setUploadError(result.error ?? 'The upload failed.');
        return;
      }
      onChange({ logo: result.url });
    });
  };

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start">
      <span className="relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-brand border border-hair bg-cream">
        {partner.logo ? (
          <Image src={partner.logo} alt="" fill unoptimized className="object-contain p-1.5" />
        ) : (
          <span className="text-micro text-muted">
            {partner.shortName || partner.name.slice(0, 3) || '—'}
          </span>
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
            disabled={uploading}
            className={cx(softButtonClass, 'disabled:opacity-60')}
          >
            <ImageIcon width={14} height={14} /> {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
        {uploadError && (
          <p role="alert" className="text-[12.5px] text-flag">
            {uploadError}
          </p>
        )}
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
          className="flex h-8 w-8 items-center justify-center rounded-full border border-green/15 text-green/70 transition-colors hover:bg-cream hover:text-green disabled:opacity-30"
        >
          <ArrowUpIcon width={14} height={14} />
        </button>
        <button
          type="button"
          onClick={() => onMove('down')}
          disabled={isLast}
          aria-label="Move down"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-green/15 text-green/70 transition-colors hover:bg-cream hover:text-green disabled:opacity-30"
        >
          <ArrowDownIcon width={14} height={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove partner"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-green/15 text-green/70 transition-colors hover:border-flag/50 hover:text-flag"
        >
          <TrashIcon width={14} height={14} />
        </button>
      </div>
    </li>
  );
}
