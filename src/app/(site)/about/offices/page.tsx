import type { Metadata } from 'next';
import { getSite } from '@/lib/content';
import { cx } from '@/lib/cx';
import { numberWord } from '@/lib/format';

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
import { CTABanner } from '@/components/CTABanner';
import { SurveyBaseline } from '@/components/about/SurveyBaseline';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Button } from '@/components/ui/Button';
import { Section, cardClass } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons';
import { kenyaOffices, offices, site, ugandaOffices } from '@/data/site';

export const metadata: Metadata = {
  title: 'Offices',
  description: `${site.shortName} works from ${offices.length} offices across Uganda and Kenya, with head offices in Kampala and Nairobi.`,
};

/**
 * Offices.
 *
 * Uganda expanded, Kenya as a linked practice. Deliberately not "nine offices, one firm": until
 * CMT confirms how the Uganda and Kenya entities relate (docs/open-items.md #2) we describe what we can
 * see — two practices, a shared director, the same standard of report — rather than claiming a
 * single regional entity we have not verified. `site.regionConfirmed` flips the wording.
 */
export default async function OfficesPage() {
  const info = await getSite();
  return (
    <>
      <PageHeader
        title={`${offices.length} offices, two countries`}
        lead="Property held as security is rarely all in one city, and rarely all in one country. We inspect where the asset is."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Offices' },
        ]}
      />

      <SurveyBaseline />

      <Section containerClassName="grid gap-12 lg:grid-cols-2 lg:gap-10">
        {/* Uganda, expanded. */}
        <Reveal>
          <SectionHeading
            eyebrow="Uganda"
            title={`${capitalise(numberWord(ugandaOffices.length))} offices, one head office`}
            lead="The practice behind this website, with its head office in Kampala."
          />
          <div className={cx(cardClass, 'mt-8 p-6 sm:p-7')}>
            <p className="text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">
              Head office
            </p>
            <h3 className="mt-2 font-display text-h3 font-semibold text-green">Kampala</h3>
            <address className="mt-4 space-y-4 text-body not-italic">
              <p className="flex gap-3.5">
                <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
                <span className="text-ink">
                  {info.address.building}
                  <br />
                  {info.address.line1}
                  <br />
                  {info.address.street}, {info.address.city}, {info.address.country}
                </span>
              </p>
              <p className="flex gap-3.5">
                <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
                <a href={info.phone.href} className="tnum text-ink hover:text-green">
                  {info.phone.display}
                </a>
              </p>
              <p className="flex gap-3.5">
                <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
                <a href={`mailto:${info.email}`} className="break-all text-ink hover:text-green">
                  {info.email}
                </a>
              </p>
            </address>

            <div className="mt-6 border-t border-hair pt-5">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">
                Branches
              </p>
              <dl className="mt-3">
                {ugandaOffices
                  .filter((office) => office.role === 'Branch')
                  .map((office) => (
                    <div key={office.city} className="schedule-row text-body">
                      <dt className="text-ink">{office.city}</dt>
                      <dd className="text-micro text-muted">Inspections and instructions</dd>
                    </div>
                  ))}
              </dl>
              <p className="mt-4 text-micro leading-relaxed text-muted">
                All instructions come through the Kampala office, which passes each one to the
                valuer nearest the property.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Kenya, as a linked practice. */}
        <Reveal delay={80}>
          <SectionHeading
            eyebrow="Kenya"
            title="A linked practice in Nairobi"
            lead="A second practice, incorporated in Nairobi in 2010, working to the same reporting standard."
          />
          <div className={cx(cardClass, 'mt-8 p-6 sm:p-7')}>
            <p className="text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">
              Head office
            </p>
            <h3 className="mt-2 font-display text-h3 font-semibold text-green">Nairobi</h3>
            <p className="mt-3 max-w-[48ch] text-body leading-relaxed text-muted">
              Kenyan instructions are handled by the Nairobi practice. A director works across both,
              which is what lets a client with assets either side of the border receive one
              consistent basis of value rather than two.
            </p>

            <div className="mt-6 border-t border-hair pt-5">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">
                Branches
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {kenyaOffices
                  .filter((office) => office.role === 'Branch')
                  .map((office) => (
                    <li
                      key={office.city}
                      className="rounded-full border border-chip px-3.5 py-1.5 text-small text-green"
                    >
                      {office.city}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Visit us"
            title="Finding the Kampala office"
            lead={`${info.address.building} sits on ${info.address.street} in the city centre, a short walk from the main taxi park.`}
            action={
              <Button href="/contact" variant="outline">
                Contact the office
              </Button>
            }
          />
        </Reveal>
        <PropertyMap
          className="mt-8"
          center={info.address.coords}
          label={`${site.name}, ${info.address.building}, ${info.address.street}`}
          zoom={16}
          height="h-[380px]"
          caption={`${info.address.building}, ${info.address.line1}. Pin is placed at street level from the published address and is not a surveyed position.`}
        />
      </Section>

      <CTABanner
        title="Wherever the asset is"
        lead="Tell us where the property sits and we will tell you which office takes it and how soon someone can inspect."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Our credentials', href: '/about/credentials' }}
      />
    </>
  );
}
