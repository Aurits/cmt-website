'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField, TextArea, TextField } from '@/components/forms/fields';
import { valuationAssets, valuationPurposes } from '@/data/valuations';
import { site } from '@/data/site';
import type { ValuationAssetSlug, ValuationPurposeSlug } from '@/lib/types';

/**
 * The form the whole site funnels into.
 *
 * Six fields, and two of them are the axes of the matrix on /valuations — so a visitor who
 * arrived by picking a cell finds both already answered rather than being asked to explain
 * themselves again. That was the leak in the first cut of this navigation: every route said
 * "request a valuation" and then landed on a generic enquiry box with a subject dropdown.
 *
 * `asset` and `purpose` arrive from the URL (the matrix, a purpose page, the hero counter). They
 * are still editable — a pre-filled field the visitor cannot correct is worse than an empty one.
 *
 * UI only this phase. The submitted state says so plainly rather than showing a "message sent"
 * confirmation that would be a lie.
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
  const [submitted, setSubmitted] = useState(false);

  const purpose = lockedPurpose ?? defaultPurpose;
  const purposeName = purpose
    ? valuationPurposes.find((item) => item.slug === purpose)?.name
    : undefined;

  if (submitted) {
    return (
      <div className="border border-green/25 bg-green/8 p-6">
        <h3 className="text-[1.25rem] text-green">Not sent — the site is still in build</h3>
        <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
          Nothing has reached CMT. Until the form is connected, call the office and a valuer will
          scope the instruction with you on the phone
          {purposeName ? ` — mention it is ${purposeName.toLowerCase()}` : ''}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={site.phone.href} variant="primary" size="md">
            Call {site.phone.display}
          </Button>
          <Button href={`mailto:${site.email}`} variant="outline" size="md">
            Email the office
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-[0.875rem] text-green underline decoration-gold decoration-2 underline-offset-4"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="v-name" label="Your name" autoComplete="name" placeholder="Full name" />
        <TextField
          id="v-phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+256"
        />
      </div>

      <TextField
        id="v-email"
        label="Email address"
        type="email"
        autoComplete="email"
        optional
        placeholder="you@example.com"
      />

      {/* The two axes of the matrix. */}
      <div className={compact ? 'grid gap-5' : 'grid gap-5 sm:grid-cols-2'}>
        <SelectField
          id="v-asset"
          label="What needs valuing"
          defaultValue={defaultAsset ?? valuationAssets[0].slug}
          options={valuationAssets.map((asset) => ({ value: asset.slug, label: asset.short }))}
        />
        {lockedPurpose ? (
          <input type="hidden" name="v-purpose" value={lockedPurpose} />
        ) : (
          <SelectField
            id="v-purpose"
            label="What the figure is for"
            defaultValue={defaultPurpose ?? valuationPurposes[0].slug}
            options={valuationPurposes.map((item) => ({ value: item.slug, label: item.name }))}
          />
        )}
      </div>

      <TextField
        id="v-location"
        label="Where it is"
        optional
        placeholder="Town or neighbourhood is enough at this stage"
      />

      <TextArea
        id="v-message"
        label="Anything else we should know"
        optional
        rows={compact ? 3 : 4}
        placeholder="A deadline, a lender's template, the number of assets — whatever affects the scope."
      />

      <div
        className={
          compact
            ? 'grid gap-3'
            : 'flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between'
        }
      >
        <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-muted">
          Form not connected yet — this page is a prototype.
        </p>
        <Button type="submit" variant="primary" size="lg" fullWidth={compact}>
          Request a valuation
        </Button>
      </div>
    </form>
  );
}
