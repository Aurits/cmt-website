'use client';

import { useActionState } from 'react';
import { useSite } from '@/components/SiteProvider';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Honeypot } from '@/components/forms/Honeypot';
import { submitInquiry, type InquiryState } from '@/lib/inquiries/actions';
import { TextArea, TextField } from '@/components/forms/fields';

/**
 * The general door. Three fields.
 *
 * This used to be the site's only form, with a subject dropdown that asked the visitor to file
 * themselves before the page had helped them, and then asked everyone the union of every
 * intent's questions. Valuation requests and listing enquiries now have their own routes and
 * their own fields, which leaves this one free to be as short as a question deserves.
 *
 * UI only this phase, the submitted state says so rather than showing a confirmation that would
 * be a lie.
 */
export function ContactForm() {
  const info = useSite();
  const pathname = usePathname();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});

  if (state.ok) {
    return (
      <div className="rounded-[24px] bg-sage-soft p-6 sm:p-7">
        <h3 className="text-h4 text-green">Thank you, that has reached us</h3>
        <p className="mt-3 max-w-[54ch] text-body leading-relaxed text-muted">
          We reply the same working day. If it is urgent, the office number is beside this form.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={info.phone.href} variant="primary" size="md">
            Call {info.phone.display}
          </Button>
          <Button href={`mailto:${info.email}`} variant="outline" size="md">
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
      <input type="hidden" name="type" value="general" />
      <input type="hidden" name="sourcePath" value={pathname} />
      <TextField id="name" label="Your name" autoComplete="name" placeholder="Full name" />
      <TextField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <TextArea id="message" label="Your message" placeholder="How can we help?" />

      <div className="flex flex-col gap-4 border-t border-hair pt-5 sm:flex-row sm:items-center sm:justify-between">
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
          {pending ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  );
}
