import type { Metadata } from 'next';
import { cx } from '@/lib/cx';
import { CTABanner } from '@/components/CTABanner';
import { PartnerConveyorGroups } from '@/components/PartnerConveyor';
import { Testimonials } from '@/components/TestimonialCard';
import { Plate, Section, cardClass } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { clientCount, clientGroups } from '@/data/clients';
import { site } from '@/data/site';
import { getPartnerGroups, getPartners, getTestimonials } from '@/lib/content';
import { listJoin } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Our Clients',
  description:
    'The banks, public bodies and companies that have CMT Realtors on their valuation panels in Uganda.',
};

export default async function ClientsPage() {
  const [partnerGroups, partners, testimonials] = await Promise.all([
    getPartnerGroups(),
    getPartners(),
    getTestimonials(),
  ]);

  return (
    <>
      <PageHeader
        title="The institutions that instruct us"
        lead={`${clientCount} banks, public bodies and companies have put ${site.shortName} on their valuation panels. Most of our work arrives as repeat instruction, which is the only recommendation that really counts in this trade.`}
        leadShort={`${clientCount} institutions, most of them repeat clients.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Our Clients' },
        ]}
      />

      <Section>
        <Reveal>
          <PartnerConveyorGroups groups={partnerGroups} headingLevel="h2" />
        </Reveal>
      </Section>

      {/*
        The full register. The belts above show the institutions whose logos we may use; this is
        everyone, as names, from CMT's own client list (src/data/clients.ts). Set like the index
        of a report: each sector a ruled heading with its count, the names in columns beneath.
        Two columns of smaller type on a phone, so 51 names cost about one screen, not three.
      */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="The full register"
            title="Everyone on our client list"
            lead={`The logos above are a selection. Here are all ${clientCount} institutions that have put us on their panels or instructed us, by sector.`}
            leadShort={`All ${clientCount}, by sector.`}
          />
        </Reveal>
        <div className="mt-10 grid gap-4">
          {clientGroups.map((group, index) => (
            <Reveal key={group.name} delay={index * 50}>
              <div className={cx(cardClass, 'p-6 sm:p-7')}>
                <h3 className="flex items-center justify-between gap-4 font-display text-h4 font-semibold text-green">
                  {group.name}
                  <span className="tnum rounded-full bg-tag px-2.5 py-1 font-sans text-[12px] font-semibold text-tag-ink">
                    {group.clients.length}
                  </span>
                </h3>
                <ul className="mt-4 columns-1 gap-x-6 min-[400px]:columns-2 text-[13px] text-green sm:gap-x-8 sm:text-small md:columns-3 lg:columns-4">
                  {group.clients.map((client) => (
                    <li key={client} className="break-inside-avoid border-t border-hair py-2">
                      {client}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* docs/layout-specs.md A-07: the references sit with the logos they come from. Renders nothing
          until a real, named one exists (docs/open-items.md #6). */}
      {testimonials.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeading
              eyebrow="References"
              title="What our clients say"
              lead="In their own words, published with their permission."
            />
          </Reveal>
          <Reveal className="mt-8">
            <Testimonials testimonials={testimonials} partners={partners} />
          </Reveal>
        </Section>
      )}

      <Section>
        <Plate>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Panel work"
                title="What institutional work demands"
                lead="A bank does not want an opinion, it wants a report its credit committee can act on without re-doing the work."
              />
            </div>
            <dl className="grid gap-3">
              {[
                {
                  title: 'Consistency across instructions',
                  body: 'The same basis of value, the same report structure and the same evidence standard every time, so reviewers know where to look.',
                },
                {
                  title: 'Turnaround that fits a credit cycle',
                  body: 'Inspection dates agreed at instruction, and delivery on the date promised rather than the date convenient to us.',
                },
                {
                  title: 'A named, regulated valuer',
                  body: `Every report is signed by a valuer registered with the ${site.regulator}, and we stand behind the figures when they are questioned.`,
                },
                {
                  title: 'Coverage where the security is',
                  body: `Property held as security is rarely all in one city. We inspect in ${listJoin(site.cities)}.`,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[20px] bg-white p-5">
                  <dt className="font-display text-lead font-semibold text-green">{item.title}</dt>
                  <dd className="mt-1 max-w-[58ch] text-small leading-relaxed text-muted">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Plate>
      </Section>

      <CTABanner
        title="Talk to us"
        lead="Panel enquiries, framework instructions and one-off institutional work all start the same way: a conversation about scope and turnaround."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'See our valuation work', href: '/valuations' }}
      />
    </>
  );
}
