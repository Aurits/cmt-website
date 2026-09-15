import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { PartnerConveyorGroups } from '@/components/PartnerConveyor';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { partnerCount, partnerGroups } from '@/data/partners';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Our Clients',
  description:
    'Banks, government and regulatory bodies, and corporate partners who instruct CMT Realtors for valuation and consultancy work in Uganda.',
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="The institutions that instruct us"
        lead={`${partnerCount} organisations across banking, government and corporate sectors. Most valuation work arrives as repeat instruction, which is the only recommendation that really counts in this trade.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Our Clients' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <Container>
          <Reveal>
            <PartnerConveyorGroups groups={partnerGroups} headingLevel="h2" />
          </Reveal>
        </Container>
      </section>

      <section className="bg-cream-deep/45 py-14 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title="What institutional work demands"
              lead="A bank does not want an opinion, it wants a report its credit committee can act on without re-doing the work."
            />
          </div>
          <dl className="lg:pt-4">
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
                body: `Every report is signed. Our valuers practise under the ${site.regulator}, and we stand behind the figures when they are questioned.`,
              },
              {
                title: 'Coverage where the security is',
                body: `Property held as security is rarely all in one city. We inspect in ${site.cities.join(', ')}.`,
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-rule py-4">
                <dt className="font-display text-lead text-green">{item.title}</dt>
                <dd className="mt-1.5 max-w-[58ch] text-body leading-relaxed text-muted">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CTABanner
        title="Talk to us"
        lead="Panel enquiries, framework instructions and one-off institutional work all start the same way: a conversation about scope and turnaround."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'See our valuation work', href: '/valuations' }}
        image="/images/cta-skyline.jpg"
      />
    </>
  );
}
