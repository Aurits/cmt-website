import type { Metadata } from 'next';
import { ContactForm } from '@/components/forms/ContactForm';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/icons';
import { site, whatsappHref } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Reach CMT Realtors at ${site.address.building}, ${site.address.street}, ${site.address.city}. Call ${site.phone.display} or email ${site.email}.`,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const subject = typeof params.subject === 'string' ? params.subject : 'general';

  return (
    <>
      <PageHeader
        title="Talk to a valuer"
        lead="Tell us what you need valued, listed or advised on. Enquiries reach a valuer the same working day."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              title="Send us the details"
              lead="The more you can tell us about the property and what the figure is for, the faster we can scope the work."
            />
            <div className="mt-8">
              <ContactForm defaultSubject={subject} />
            </div>
          </div>

          <div>
            <div className="rounded-brand border border-rule bg-paper p-6">
              <h2 className="text-[1.375rem] text-green">Our office</h2>

              <address className="mt-5 space-y-4 text-[0.9375rem] not-italic">
                <p className="flex gap-3.5">
                  <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
                  <span className="text-ink">
                    {site.address.building}
                    <br />
                    {site.address.line1}
                    <br />
                    {site.address.street}, {site.address.city}, {site.address.country}
                  </span>
                </p>
                <p className="flex gap-3.5">
                  <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
                  <a href={site.phone.href} className="tnum text-ink hover:text-green">
                    {site.phone.display}
                  </a>
                </p>
                <p className="flex gap-3.5">
                  <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
                  <a href={`mailto:${site.email}`} className="break-all text-ink hover:text-green">
                    {site.email}
                  </a>
                </p>
              </address>

              <div id="whatsapp" className="mt-6 scroll-mt-32 border-t border-rule pt-5">
                <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] text-green">
                  <WhatsAppIcon width={18} height={18} className="text-gold-deep" />
                  WhatsApp
                </h3>
                {site.whatsapp ? (
                  <div className="mt-3">
                    <Button href={whatsappHref()} variant="primary" size="sm">
                      Open a WhatsApp chat
                    </Button>
                  </div>
                ) : (
                  <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-relaxed text-muted">
                    CMT publishes a landline, which cannot receive WhatsApp. Once the office
                    mobile is confirmed, every WhatsApp button on the site starts working from
                    one setting. Until then, please call or email.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-rule pt-5">
                <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] text-green">
                  <ClockIcon width={18} height={18} className="text-gold-deep" />
                  Office hours
                </h3>
                <dl className="mt-3">
                  {site.hours.map((entry) => (
                    <div key={entry.days} className="schedule-row text-[0.9375rem]">
                      <dt className="text-muted">{entry.days}</dt>
                      <dd className="tnum text-ink">{entry.time}</dd>
                    </div>
                  ))}
                </dl>
                {!site.hoursConfirmed && (
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                    Hours shown are a placeholder and need confirming by CMT.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-brand border border-green/25 bg-green/8 p-6">
              <h2 className="font-display text-[1.25rem] text-green">
                Own a property you want on the market?
              </h2>
              <p className="mt-2.5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted">
                Owners go through a shorter route: we value the property, agree an asking
                price from the evidence, and list it once you are happy with the figure.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/contact?subject=listing" variant="primary" size="sm">
                  List your property
                </Button>
                <Button href="/advisory#acquisition-and-disposal" variant="quiet" size="sm">
                  How listing works
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionHeading
            title="Finding us"
            lead={`${site.address.building} sits on ${site.address.street} in the city centre, a short walk from the main taxi park.`}
          />
          <PropertyMap
            className="mt-8"
            center={site.address.coords}
            label={`${site.name} — ${site.address.building}, ${site.address.street}`}
            zoom={16}
            height="h-[380px]"
            caption={`${site.address.building}, ${site.address.line1}. Pin is placed at street level from the published address and is not a surveyed position.`}
          />
        </Container>
      </section>
    </>
  );
}
