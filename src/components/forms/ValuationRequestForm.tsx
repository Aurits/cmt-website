'use client';

import { useActionState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Honeypot } from '@/components/forms/Honeypot';
import { submitInquiry, type InquiryState } from '@/lib/inquiries/actions';
import { SelectField, TextArea, TextField } from '@/components/forms/fields';
import { valuationAssets, valuationPurposes } from '@/data/valuations';
import { site } from '@/data/site';
import type { ValuationAssetSlug, ValuationPurposeSlug } from '@/lib/types';

/**
 * The form the whole site funnels into.
 *
 * Six fields, and two of them are the axes of the matrix on /valuations, so a visitor who
 * arrived by picking a cell finds both already answered rather than being asked to explain
 * themselves again. That was the leak in the first cut of this navigation: every route said
 * "request a valuation" and then landed on a generic enquiry box with a subject dropdown.
 *
 * `asset` and `purpose` arrive from the URL (the matrix, a purpose page, the hero counter). They
 * are still editable, a pre-filled field the visitor cannot correct is worse than an empty one.
 *
 * This form sends for real now. It reaches the enquiries table, appears in the CMS inbox, and the
 * confirmation below says what happens next rather than the old honest apology about the site
 * being in build.
 */
export function ValuationRequestForm({
  defaultAsset,
  defaultPurpose,
  lockedPurpose,
  compact = false,
}: {
  defaultAsset?: ValuationAssetSlug;
  defaultPurpose?: ValuationPurposeSlug;
  /** Set on a purpose page, where the question is already answered by the page you are on. */
  lockedPurpose?: ValuationPurposeSlug;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});

  const purpose = lockedPurpose ?? defaultPurpose;
  const purposeName = purpose
    ? valuationPurposes.find((item) => item.slug === purpose)?.name
    : undefined;

  if (state.ok) {
    return (
      <div className="border border-green/25 bg-green/8 p-6">
        <h3 className="text-h4 text-green">Thank you, that has reached us</h3>
        <p className="mt-3 max-w-[54ch] text-body leading-relaxed text-muted">
          A valuer will come back to you the same working day
          {purposeName ? ` about ${purposeName.toLowerCase()}` : ''}. If it is urgent, calling the
          office is always faster than waiting for a reply.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={site.phone.href} variant="primary" size="md">
            Call {site.phone.display}
          </Button>
          <Button href={`mailto:${site.email}`} variant="outline" size="md">
            Email the office
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      action={action}
    >
      <Honeypot />
      <input type="hidden" name="type" value="valuation" />
      <input type="hidden" name="sourcePath" value={pathname} />
      {lockedPurpose && <input type="hidden" name="valuationPurpose" value={lockedPurpose} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Your name" autoComplete="name" placeholder="Full name" />
        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+256"
        />
      </div>

      <TextField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        optional
        placeholder="you@example.com"
      />

      {/* The two axes of the matrix. */}
      <div className={compact ? 'grid gap-5' : 'grid gap-5 sm:grid-cols-2'}>
        <SelectField
          id="valuationAsset"
          label="What needs valuing"
          defaultValue={defaultAsset ?? valuationAssets[0].slug}
          options={valuationAssets.map((asset) => ({ value: asset.slug, label: asset.short }))}
        />
        {lockedPurpose ? (
          <input type="hidden" name="v-purpose" value={lockedPurpose} />
        ) : (
          <SelectField
            id="valuationPurpose"
            label="What the figure is for"
            defaultValue={defaultPurpose ?? valuationPurposes[0].slug}
            options={valuationPurposes.map((item) => ({ value: item.slug, label: item.name }))}
          />
        )}
      </div>

      <TextField
        id="location"
        label="Where it is"
        optional
        placeholder="Town or neighbourhood is enough at this stage"
      />

      <TextArea
        id="message"
        label="Anything else we should know"
        optional
        rows={compact ? 3 : 4}
        placeholder="A deadline, a lender's template, the number of assets, or anything else that affects the scope."
      />

      <div
        className={
          compact
            ? 'grid gap-3'
            : 'flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between'
        }
      >
        {state.error ? (
          <p role="alert" className="max-w-[38ch] text-micro leading-relaxed text-flag">
            {state.error}
          </p>
        ) : (
          <p className="max-w-[38ch] text-micro leading-relaxed text-muted">
            We reply the same working day.
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" fullWidth={compact} disabled={pending}>
          {pending ? 'Sending…' : 'Request a valuation'}
        </Button>
      </div>
    </form>
  );
}
