'use client';

import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PlusIcon, QuoteIcon } from '@/components/admin/icons';
import { inputClass } from '@/components/forms/fields';
import { useAdmin } from '@/lib/admin/store';
import type { AdminTestimonial } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

/**
 * The brief forbids invented testimonials — see data/testimonials.ts and docs/OPEN-ITEMS.md #6.
 * This module exists so a real, named quote can be added the moment CMT supplies one; it
 * does not pre-fill anything.
 */
export default function AdminTestimonialsPage() {
  const { state, ready, upsertTestimonial, deleteTestimonial, createTestimonialDraft } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading testimonials…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted">
          {state.testimonials.length} real, named testimonial{state.testimonials.length === 1 ? '' : 's'}.
          Never invent a quote — an honest empty state beats a fabricated one.
        </p>
        <button
          type="button"
          onClick={() => upsertTestimonial(createTestimonialDraft())}
          className="flex shrink-0 items-center gap-1.5 rounded-control border border-green/35 px-3.5 py-2 text-micro font-medium text-green transition-colors hover:border-green hover:bg-green/8"
        >
          <PlusIcon width={14} height={14} /> Add testimonial
        </button>
      </div>

      {state.testimonials.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-brand border border-dashed border-rule-strong bg-paper px-6 py-14 text-center">
          <QuoteIcon width={28} height={28} className="text-gold-deep" />
          <p className="max-w-[46ch] text-body text-muted">
            No testimonials yet. The homepage shows an honest empty state until a real, named quote is
            added here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
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
  return (
    <li className="grid gap-3 rounded-brand border border-rule bg-paper p-5">
      <textarea
        value={testimonial.quote}
        onChange={(e) => onChange({ quote: e.target.value })}
        rows={3}
        placeholder="The quote, verbatim, with permission to publish."
        className={cx(inputClass, 'resize-y')}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={testimonial.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Full name"
          className={cx(inputClass, '!py-2')}
        />
        <input
          value={testimonial.organisation}
          onChange={(e) => onChange({ organisation: e.target.value })}
          placeholder="Organisation"
          className={cx(inputClass, '!py-2')}
        />
      </div>
      <input
        value={testimonial.role ?? ''}
        onChange={(e) => onChange({ role: e.target.value || undefined })}
        placeholder="Role (optional)"
        className={cx(inputClass, '!py-2')}
      />
      <div className="flex justify-end border-t border-rule pt-3">
        <ConfirmButton onConfirm={onDelete} label="Delete" />
      </div>
    </li>
  );
}
