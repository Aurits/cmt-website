'use client';

import { useActionState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Honeypot } from '@/components/forms/Honeypot';
import { submitInquiry, type InquiryState } from '@/lib/inquiries/actions';
import { SelectField, TextArea, TextField } from '@/components/forms/fields';
import { categories } from '@/data/categories';
import { cities } from '@/data/listings';
import { site } from '@/data/site';

/**
 * Owners putting a property on the market. Five fields and nothing about valuation purpose — an
 * owner is answering a different question from a bank, and one shared form with a subject
 * dropdown made both of them wade through the other's.
 */
export function ListPropertyForm({ defaultCategory }: { defaultCategory?: string }) {
  const pathname = usePathname();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});

  if (state.ok) {
    return (
      <div className="border border-green/25 bg-green/8 p-6">
        <h3 className="text-h4 text-green">Thank you, that has reached us</h3>
        <p className="mt-3 max-w-[54ch] text-body leading-relaxed text-muted">
          Someone from the agency desk will call to arrange the inspection that sets the asking price.
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
      <input type="hidden" name="type" value="list-a-property" />
      <input type="hidden" name="sourcePath" value={pathname} />
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

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="category"
          label="What kind of property"
          defaultValue={defaultCategory ?? categories[0].slug}
          options={categories.map((category) => ({
            value: category.slug,
            label: category.name,
          }))}
        />
        <SelectField
          id="city"
          label="Where it is"
          options={cities.map((city) => ({ value: city, label: city }))}
        />
      </div>

      <TextField
        id="expectation"
        label="What you hope it is worth"
        optional
        inputMode="numeric"
        placeholder="UGX. A rough figure is fine, and so is leaving it blank"
      />

      <TextArea
        id="message"
        label="Tell us about the property"
        optional
        rows={4}
        placeholder="Size, tenure, condition, and whether you are selling or letting."
      />

      <div className="flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        {state.error ? (
          <p role="alert" className="max-w-[38ch] text-micro leading-relaxed text-flag">
            {state.error}
          </p>
        ) : (
          <p className="max-w-[38ch] text-micro leading-relaxed text-muted">
          We reply the same working day.
        </p>
        )}
        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? 'Sending…' : 'Send the details'}
        </Button>
      </div>
    </form>
  );
}
