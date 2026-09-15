import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ContactForm } from '@/components/forms/ContactForm';
import { IntentTabs } from '@/components/forms/IntentTabs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Reach ${site.shortName} at ${site.address.building}, ${site.address.street}, ${site.address.city}. Call ${site.phone.display} or email ${site.email}.`,
};

/**
 * The general door — three fields, because someone asking a question should not have to pick a
 * department first.
 *
 * The old single-form page took a `?subject=` query and switched a dropdown. Those links are all
 * over the prototype and may be bookmarked, so they are honoured here and redirected to the route
 * that now serves them.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const subject = typeof params.subject === 'string' ? params.subject : undefined;

  if (subject === 'valuation') redirect('/contact/request-a-valuation');
  if (subject === 'listing') redirect('/contact/list-a-property');

  return (
    <>
      <IntentTabs active="general" />
      <div className="mt-8">
        <SectionHeading
          title="Ask us anything"
          lead="Panel enquiries, a question about a report, or something that does not fit the other two. Three fields, and it reaches a person."
        />
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
