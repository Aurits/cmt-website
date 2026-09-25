'use client';

import { useActionState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Honeypot } from '@/components/forms/Honeypot';
import { submitInquiry, type InquiryState } from '@/lib/inquiries/actions';
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
  const pathname = usePathname();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});

  if (state.ok) {
    return (
      <div className="rounded-brand border border-green/25 bg-green/8 p-6">
        <h3 className="text-h4 text-green">Thank you, that has reached us</h3>
        <p className="mt-3 text-body leading-relaxed text-muted">
          The agent handling this property will come back to you the same working day.
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
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      action={action}
    >
      <Honeypot />
      <input type="hidden" name="type" value="agent-contact" />
      <input type="hidden" name="sourcePath" value={pathname} />
      <TextField id="name" label="Your name" autoComplete="name" placeholder="Full name" />
      <TextField
        id="phone"
        label="Phone number"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="+256"
      />
      <TextField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        optional
        placeholder="you@example.com"
      />
      <SelectField
        id="preference"
        label="Best way to reach you"
        options={[
          { value: 'call', label: 'Phone call' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'email', label: 'Email' },
        ]}
      />
      <TextArea
        id="message"
        label="Your message"
        rows={4}
        defaultValue={`I would like to arrange a viewing of ${reference} (${title}).`}
      />

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
          {pending ? 'Sending…' : 'Send enquiry'}
        </Button>
      {state.error ? (
          <p role="alert" className="max-w-[38ch] text-micro leading-relaxed text-flag">
            {state.error}
          </p>
        ) : (
          <p className="text-micro leading-relaxed text-muted">
        We reply the same working day.
      </p>
        )}
    </form>
  );
}
