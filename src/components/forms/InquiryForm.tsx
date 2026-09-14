'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField, TextArea, TextField } from '@/components/forms/fields';
import { site, whatsappHref } from '@/data/site';

/**
 * Property enquiry, UI only this phase. Pre-loads the reference so the person does not
 * have to describe which property they mean.
 */
export function InquiryForm({
  reference,
  title,
}: {
  reference: string;
  title: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-brand border border-green/25 bg-green/8 p-6">
        <h3 className="text-[1.25rem] text-green">Not sent — the site is still in build</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Nothing has reached CMT. Quote reference{' '}
          <span className="tnum font-medium text-ink">{reference}</span> when you call or
          message, and the agent will have the file open.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button href={site.phone.href} variant="primary" size="md">
            Call the office
          </Button>
          <Button
            href={whatsappHref(`Hello CMT Realtors, I am interested in ${reference} (${title}).`)}
            variant="outline"
            size="md"
          >
            WhatsApp the agent
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
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <TextField id="enquiry-name" label="Your name" autoComplete="name" placeholder="Full name" />
      <TextField
        id="enquiry-phone"
        label="Phone number"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="+256"
      />
      <TextField
        id="enquiry-email"
        label="Email address"
        type="email"
        autoComplete="email"
        optional
        placeholder="you@example.com"
      />
      <SelectField
        id="enquiry-preference"
        label="Best way to reach you"
        options={[
          { value: 'call', label: 'Phone call' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'email', label: 'Email' },
        ]}
      />
      <TextArea
        id="enquiry-message"
        label="Your message"
        rows={4}
        defaultValue={`I would like to arrange a viewing of ${reference} (${title}).`}
      />

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Send enquiry
      </Button>
      <p className="text-[0.8125rem] leading-relaxed text-muted">
        Form not connected yet — this page is a prototype.
      </p>
    </form>
  );
}
