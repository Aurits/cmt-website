'use client';

import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PlusIcon, QuoteIcon } from '@/components/admin/icons';
import { Label, inputClass } from '@/components/forms/fields';
import { PageToolbar, softButtonClass } from '@/components/admin/PageToolbar';
import { useAdmin } from '@/lib/admin/store';
import type { AdminTestimonial } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

/**
 * The brief forbids invented testimonials. See data/testimonials.ts and docs/open-items.md #6.
 * This module exists so a real, named quote can be added the moment CMT supplies one; it
 * does not pre-fill anything.
 */
export default function AdminTestimonialsPage() {
  const { state, ready, upsertTestimonial, deleteTestimonial, createTestimonialDraft } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading testimonials…</p>;

  return (
    <div className="grid gap-5">
      <PageToolbar
        summary={
          <>
            <span className="font-semibold text-green">{state.testimonials.length}</span> real,
            named testimonial{state.testimonials.length === 1 ? '' : 's'}. Never invent a quote: an
            honest empty state beats a fabricated one.
          </>
        }
        action={
          <button
            type="button"
            onClick={() => upsertTestimonial(createTestimonialDraft())}
            className={softButtonClass}
          >
            <PlusIcon width={14} height={14} /> Add testimonial
          </button>
        }
      />

      {state.testimonials.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-green/10 bg-white px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tag text-green">
            <QuoteIcon width={22} height={22} />
          </span>
          <p className="max-w-[46ch] text-body text-muted">
            No testimonials yet. The site shows a short &ldquo;in brief&rdquo; section instead until
            a real, named quote is added here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {state.testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onChange={(patch) => upsertTestimonial({ ...testimonial, ...patch })}
              onDelete={() => deleteTestimonial(testimonial.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onChange,
  onDelete,
}: {
  testimonial: AdminTestimonial;
  onChange: (patch: Partial<AdminTestimonial>) => void;
  onDelete: () => void;
}) {
  const field = (id: string) => `${id}-${testimonial.id}`;
  return (
    <li className="relative grid gap-4 border border-green/10 bg-white p-5">
      <span aria-hidden="true" className="absolute -top-px left-5 h-[3px] w-7 bg-gold" />
      <div>
        <Label htmlFor={field('quote')}>Quote</Label>
        <textarea
          id={field('quote')}
          value={testimonial.quote}
          onChange={(e) => onChange({ quote: e.target.value })}
          rows={3}
          placeholder="The quote, verbatim, with permission to publish."
          className={cx(inputClass, 'resize-y')}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={field('name')}>Full name</Label>
          <input
            id={field('name')}
            value={testimonial.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={cx(inputClass, '!py-2')}
          />
        </div>
        <div>
          <Label htmlFor={field('organisation')}>Organisation</Label>
          <input
            id={field('organisation')}
            value={testimonial.organisation}
            onChange={(e) => onChange({ organisation: e.target.value })}
            className={cx(inputClass, '!py-2')}
          />
        </div>
        <div>
          <Label htmlFor={field('role')} optional>
            Role
          </Label>
          <input
            id={field('role')}
            value={testimonial.role ?? ''}
            onChange={(e) => onChange({ role: e.target.value || undefined })}
            className={cx(inputClass, '!py-2')}
          />
        </div>
        {/* What the quote vouches for. The public card prints it beside the quote, because a
            reference that names the job is worth more than one that does not. */}
        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <div>
            <Label htmlFor={field('instruction')} optional>
              Instruction
            </Label>
            <input
              id={field('instruction')}
              value={testimonial.instruction ?? ''}
              onChange={(e) => onChange({ instruction: e.target.value || undefined })}
              placeholder="Mortgage valuation"
              className={cx(inputClass, '!py-2')}
            />
          </div>
          <div>
            <Label htmlFor={field('year')} optional>
              Year
            </Label>
            <input
              id={field('year')}
              value={testimonial.year ?? ''}
              onChange={(e) => onChange({ year: e.target.value || undefined })}
              inputMode="numeric"
              placeholder="2025"
              className={cx(inputClass, 'tnum !py-2')}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-hair pt-3">
        <p className="text-[12.5px] text-muted">
          {testimonial.name && testimonial.organisation
            ? `Shows as: ${testimonial.name}, ${testimonial.organisation}${testimonial.instruction ? `, ${testimonial.instruction}` : ''}${testimonial.year ? ` (${testimonial.year})` : ''}`
            : 'Needs a name and an organisation before it can be shown.'}
        </p>
        <ConfirmButton onConfirm={onDelete} label="Delete" />
      </div>
    </li>
  );
}
