'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-green/25 bg-green/8 p-6">
        <h3 className="text-[1.25rem] text-green">Not sent — the site is still in build</h3>
        <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
          Nothing has reached CMT. Call the office and ask for the agency desk — they will arrange
          the inspection that sets the asking price.
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
        <TextField id="l-name" label="Your name" autoComplete="name" placeholder="Full name" />
        <TextField
          id="l-phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+256"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="l-category"
          label="What kind of property"
          defaultValue={defaultCategory ?? categories[0].slug}
          options={categories.map((category) => ({
            value: category.slug,
            label: category.name,
          }))}
        />
        <SelectField
          id="l-city"
          label="Where it is"
          options={cities.map((city) => ({ value: city, label: city }))}
        />
      </div>

      <TextField
        id="l-expectation"
        label="What you hope it is worth"
        optional
        inputMode="numeric"
        placeholder="UGX — a rough figure is fine, and it is fine to leave blank"
      />

      <TextArea
        id="l-message"
        label="Tell us about the property"
        optional
        rows={4}
        placeholder="Size, tenure, condition, and whether you are selling or letting."
      />

      <div className="flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-muted">
          Form not connected yet — this page is a prototype.
        </p>
        <Button type="submit" variant="primary" size="lg">
          Send the details
        </Button>
      </div>
    </form>
  );
}
