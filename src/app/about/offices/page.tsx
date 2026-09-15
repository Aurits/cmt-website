import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { SurveyBaseline } from '@/components/about/SurveyBaseline';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
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
 * CMT confirms how the Uganda and Kenya entities relate (OPEN-ITEMS.md #2) we describe what we can
 * see — two practices, a shared director, the same standard of report — rather than claiming a
 * single regional entity we have not verified. `site.regionConfirmed` flips the wording.
 */
export default function OfficesPage() {
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

      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Uganda, expanded. */}
          <Reveal>
            <SectionHeading title="Uganda" lead="The practice you are contacting from this site." />
            <div className="mt-7 border border-rule bg-paper p-6">
              <p className="text-label uppercase tracking-[0.1em] text-muted">Head office</p>
              <h3 className="mt-2 font-display text-h4 text-green">Kampala</h3>
              <address className="mt-4 space-y-4 text-body not-italic">
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

              <div className="mt-6 border-t border-rule pt-5">
                <p className="text-label uppercase tracking-[0.1em] text-muted">Branches</p>
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
                  Branch addresses and direct lines are not published. All instructions come through
                  the Kampala office and are allocated to the nearest valuer.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Kenya, as a linked practice. */}
          <Reveal delay={80}>
            <SectionHeading
              title="Kenya"
              lead="A second practice, incorporated in Nairobi in 2010, working to the same reporting standard."
            />
            <div className="mt-7 border border-rule bg-paper p-6">
              <p className="text-label uppercase tracking-[0.1em] text-muted">Head office</p>
              <h3 className="mt-2 font-display text-h4 text-green">Nairobi</h3>
              <p className="mt-3 max-w-[48ch] text-body leading-relaxed text-muted">
                Kenyan instructions are handled by the Nairobi practice. A director works across
                both, which is what lets a client with assets either side of the border receive one
                consistent basis of value rather than two.
              </p>

              <div className="mt-6 border-t border-rule pt-5">
                <p className="text-label uppercase tracking-[0.1em] text-muted">Branches</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {kenyaOffices
                    .filter((office) => office.role === 'Branch')
                    .map((office) => (
                      <li
                        key={office.city}
                        className="border border-rule bg-cream px-3 py-1.5 text-body text-ink"
                      >
                        {office.city}
                      </li>
                    ))}
                </ul>
              </div>

              {!site.regionConfirmed && (
                <p className="mt-6 border-t border-rule pt-5 text-micro leading-relaxed text-muted">
                  How the two practices relate as legal entities is being confirmed with CMT before
                  we describe them as one firm. Until then this page says what can be seen: two
                  practices, a shared director, one standard of report.
                </p>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="pb-12 lg:pb-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Finding the Kampala office"
              lead={`${site.address.building} sits on ${site.address.street} in the city centre, a short walk from the main taxi park.`}
              action={
                <Button href="/contact" variant="outline" size="md">
                  Contact the office
                </Button>
              }
            />
          </Reveal>
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

      <CTABanner
        title="Wherever the asset is"
        lead="Tell us where the property sits and we will tell you which office takes it and how soon someone can inspect."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Our credentials', href: '/about/credentials' }}
      />
    </>
  );
}
