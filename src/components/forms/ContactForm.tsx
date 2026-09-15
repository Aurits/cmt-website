'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea, TextField } from '@/components/forms/fields';
import { site } from '@/data/site';

/**
 * The general door. Three fields.
 *
 * This used to be the site's only form, with a subject dropdown that asked the visitor to file
 * themselves before the page had helped them — and then asked everyone the union of every
 * intent's questions. Valuation requests and listing enquiries now have their own routes and
 * their own fields, which leaves this one free to be as short as a question deserves.
 *
 * UI only this phase — the submitted state says so rather than showing a confirmation that would
 * be a lie.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-green/25 bg-green/8 p-6">
        <h3 className="text-[1.375rem] text-green">Your details are not sent yet</h3>
        <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
          This form is part of a site still in build, so nothing has been delivered to CMT. Until it
          goes live, reach the office directly and a valuer will pick it up the same working day.
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
      <TextField id="name" label="Your name" autoComplete="name" placeholder="Full name" />
      <TextField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <TextArea id="message" label="Your message" placeholder="How can we help?" />

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
