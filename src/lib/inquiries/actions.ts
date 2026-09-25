'use server';

import { headers } from 'next/headers';
import { getRepository } from '@/lib/data';
import type { InquiryType } from '@/lib/admin/types';

/**
 * The public end of the enquiry pipeline.
 *
 * Deliberately not in lib/admin/actions.ts, and deliberately without requireStaff: this is the one
 * write on the whole site that an anonymous visitor is allowed to make. Keeping it in its own file
 * means the rule over there, every function starts with requireStaff, stays absolute, with no
 * exception anyone has to remember.
 *
 * What it can do is exactly one thing: insert a row. It cannot read the table, update one, or
 * touch anything else, because the repository is the boundary and this only ever calls create().
 */

export interface InquiryState {
  ok?: boolean;
  error?: string;
}

const LIMIT = 5;
const WINDOW_MS = 10 * 60_000;
const recent = new Map<string, number[]>();

/**
 * Per-process, and honest about it. It stops someone holding the submit button down; it does not
 * stop a distributed flood, and it resets on redeploy. A real limiter belongs at the edge. What
 * makes this tolerable in the meantime is that the cost of a false negative here is a junk row in
 * a table a human reads, not a breach.
 */
function tooMany(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > LIMIT;
}

function clean(value: FormDataEntryValue | null, max = 2000): string {
  return String(value ?? '').trim().slice(0, max);
}

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  /*
   * The honeypot. A field positioned off-screen that a person never sees and never fills, and
   * that most bots fill because it is there. Chosen over a CAPTCHA on purpose: a CAPTCHA costs a
   * third-party script on every page of a site whose design brief names mobile data cost as a
   * constraint, and it punishes the visitor for the bot's behaviour.
   */
  // The field name is duplicated in components/forms/Honeypot.tsx rather than shared from here,
  // because a "use server" file may only export async functions: a shared const would be a build
  // error. Two words in two places, both commented, is the cheaper trade.
  if (clean(formData.get('company'))) return { ok: true }; // silently accepted, never stored

  const type = clean(formData.get('type')) as InquiryType;
  const name = clean(formData.get('name'), 200);
  const phone = clean(formData.get('phone'), 60);
  const email = clean(formData.get('email'), 200);
  const message = clean(formData.get('message'), 4000);

  if (!name) return { error: 'Please tell us your name.' };
  if (!phone && !email) {
    return { error: 'Please leave a phone number or an email address so we can reply.' };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'That email address does not look right.' };
  }

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (tooMany(ip)) {
    return { error: 'That is a lot of enquiries in a short time. Please try again shortly.' };
  }

  try {
    const data = await getRepository();
    await data.inquiries.create({
      type: (['valuation', 'agent-contact', 'list-a-property', 'general'] as const).includes(type)
        ? type
        : 'general',
      name,
      phone: phone || undefined,
      email: email || undefined,
      message: message || '(no message)',
      listingSlug: clean(formData.get('listingSlug'), 200) || undefined,
      valuationAsset: clean(formData.get('valuationAsset'), 100) || undefined,
      valuationPurpose: clean(formData.get('valuationPurpose'), 100) || undefined,
      sourcePath: clean(formData.get('sourcePath'), 300) || undefined,
    });
    return { ok: true };
  } catch {
    /*
     * The visitor is told to call instead, rather than being shown a database error. They cannot
     * act on the real reason and it would leak how the site is built; the office phone number is
     * on the page either way, and a lost enquiry is worse than an ugly one.
     */
    return {
      error:
        'We could not record that just now. Please call the office instead, and we will pick it up straight away.',
    };
  }
}
