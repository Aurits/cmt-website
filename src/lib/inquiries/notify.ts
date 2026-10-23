import 'server-only';
import nodemailer from 'nodemailer';
import { hasMail, mail, siteUrl } from '@/lib/env';
import type { Inquiry } from '@/lib/admin/types';

const typeLabels: Record<Inquiry['type'], string> = {
  valuation: 'Valuation request',
  'agent-contact': 'Property enquiry',
  'list-a-property': 'Property to list',
  general: 'General enquiry',
};

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Tell the office a new enquiry has arrived.
 *
 * The enquiry is already saved before this runs, so it is a courtesy, not the record: if mail is
 * not configured (SMTP_HOST and MAIL_TO unset) it does nothing, and if sending fails the visitor
 * still sees their enquiry as received and the row is in the admin. Reply-To is the visitor, so
 * the office can answer straight from the email.
 */
export async function notifyOffice(
  inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>,
): Promise<void> {
  if (!hasMail()) return;
  const config = mail();

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: config.user ? { user: config.user, pass: config.password } : undefined,
  });

  const rows: [string, string | undefined][] = [
    ['Name', inquiry.name],
    ['Phone', inquiry.phone],
    ['Email', inquiry.email],
    ['What needs valuing', inquiry.valuationAsset],
    ['What the figure is for', inquiry.valuationPurpose],
    ['Property', inquiry.listingSlug ? `${siteUrl()}/properties/${inquiry.listingSlug}` : undefined],
    ['Sent from', inquiry.sourcePath ? `${siteUrl()}${inquiry.sourcePath}` : undefined],
  ];
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));
  const subject = `${typeLabels[inquiry.type]} from ${inquiry.name}`;

  await transport.sendMail({
    from: config.from,
    to: config.to,
    replyTo: inquiry.email || undefined,
    subject,
    text: [
      subject,
      '',
      ...present.map(([label, value]) => `${label}: ${value}`),
      '',
      inquiry.message,
      '',
      `Open the CMS: ${siteUrl()}/admin/inquiries`,
    ].join('\n'),
    html: `<div style="font-family:Arial,sans-serif;color:#0f2a1a;line-height:1.5">
<h2 style="font-size:18px;margin:0 0 12px">${escape(subject)}</h2>
<table style="border-collapse:collapse;font-size:14px">${present
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#4b5d51">${escape(label)}</td><td style="padding:4px 0">${escape(value)}</td></tr>`,
      )
      .join('')}</table>
<p style="white-space:pre-wrap;margin:16px 0;padding:12px;background:#f7f5ee;font-size:14px">${escape(inquiry.message)}</p>
<p style="font-size:14px"><a href="${siteUrl()}/admin/inquiries" style="color:#0f2a1a">Open the enquiries in the CMS</a></p>
</div>`,
  });
}
