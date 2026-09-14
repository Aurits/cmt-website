'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField, TextArea, TextField } from '@/components/forms/fields';
import { site } from '@/data/site';

const subjects = [
  { value: 'general', label: 'General enquiry' },
  { value: 'valuation', label: 'Request a valuation' },
  { value: 'listing', label: 'List a property with CMT' },
];

/**
 * UI only this phase — there is no endpoint yet, and we say so rather than showing a
 * "message sent" toast that would be a lie. When the backend lands, replace the
 * submit handler with the real action and swap the notice for a true confirmation.
 */
export function ContactForm({ defaultSubject = 'general' }: { defaultSubject?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const subject = subjects.some((item) => item.value === defaultSubject)
    ? defaultSubject
    : 'general';

  if (submitted) {
    return (
      <div className="rounded-brand border border-green/25 bg-green/8 p-6">
        <h3 className="text-[1.375rem] text-green">Your details are not sent yet</h3>
        <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
          This form is part of a site still in build, so nothing has been delivered to CMT.
          Until it goes live, reach the office directly and a valuer will pick it up the
          same working day.
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
        placeholder="you@example.com"
      />

      <SelectField id="subject" label="What is this about" options={subjects} defaultValue={subject} />

      <TextArea
        id="message"
        label="Your message"
        placeholder="Tell us about the property, or what you need valued."
      />

      <div className="flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-muted">
          Form not connected yet — this page is a prototype.
        </p>
        <Button type="submit" variant="primary" size="lg">
          Send enquiry
        </Button>
      </div>
    </form>
  );
}
