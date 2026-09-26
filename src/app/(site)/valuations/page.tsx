import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { AgentCard } from '@/components/AgentCard';
import { ProcessDatum } from '@/components/home/ProcessDatum';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { ValuationMatrix } from '@/components/valuations/ValuationMatrix';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { directors } from '@/data/agents';
import { allPartners } from '@/data/partners';
import { LEAD, assetBySlug, purposeBySlug, valuationPurposes } from '@/data/valuations';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Valuations',
  description:
    'Property, plant and machinery, and business valuations for lending, financial reporting, insurance, tax and litigation, and compensation. Across Uganda and Kenya.',
};

/**
 * The valuation hub.
 *
 * The matrix is the lead, so there is no lead paragraph above it — a page that explains its own
 * table before showing it has already lost the reader who arrived with a specific question. See
 * docs/LAYOUT-SPECS.md A-03.
 */
export default function ValuationsPage() {
  const lead = purposeBySlug[LEAD.purpose];
  const leadAsset = assetBySlug[LEAD.asset];

  return (
    <>
      <PageHeader
        title="What do you need valued, and what for?"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Valuations' }]}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <ValuationMatrix />
          {/* Desktop only: on a phone the matrix collapses to one line per purpose (see
              ValuationMatrix), which already says what this paragraph explains. */}
          <p className="mt-4 max-w-[68ch] text-body leading-relaxed text-muted max-sm:hidden">
            <span className="font-medium text-ink">
              {lead.name} on {leadAsset.short.toLowerCase()}
            </span>{' '}
            is the majority of what we are instructed to do, and the reason most people are on this
            page. Every combination above leads to what the report contains, what it is based on and
            how long it takes. Where a cell says &ldquo;Not offered&rdquo;, we would rather say so
            than take the instruction.
          </p>
        </Container>
      </section>

      {/* How it runs */}
      <section className="bg-mist py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="How a valuation actually runs"
              lead="Four steps. We tell you at the start which of them could affect your deadline."
            />
          </Reveal>
          {/* The same timeline as the homepage, from the same data, so the two pages cannot
              describe the method differently or draw it two ways. */}
          <Reveal className="mt-2">
            <ProcessDatum />
          </Reveal>
        </Container>
      </section>

      {/* The deliverable. A redacted sample report belongs beside this schedule once CMT supplies
          one (docs/CONTENT-NEEDED.md, "Proof from clients"); until then the schedule stands alone
          rather than beside a panel describing its absence, which is what used to sit here. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="What you actually receive"
              lead="Every report carries the same structure, whoever instructed it and whatever it is for."
            />
            {/* The measure is on the schedule, not the Container: the Container's own
                max-w-[1200px] wins over a second max-width on the same element, and a label and
                its detail 900px apart stop reading as a pair. */}
            <dl className="mt-7 max-w-[760px]">
              {[
                ['Basis of value', 'Stated on the first page, with the definition, not assumed'],
                ['The figure', 'And the forced-sale position where a lender requires it'],
                ['Evidence', 'The comparable transactions the figure rests on, listed'],
                ['Title and tenure', 'Verified, with the unexpired term where leasehold'],
                ['Assumptions and limits', 'What we did not inspect, and what we took on trust'],
                ['A name', 'The registered valuer who signs it and answers for it'],
              ].map(([label, detail]) => (
                <div key={label} className="schedule-row">
                  <dt className="text-body text-ink">{label}</dt>
                  <dd className="max-w-[34ch] text-right text-micro text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

        </Container>
      </section>

      {/* Who signs it */}
      <section className="bg-green py-12 text-cream lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              onDark
              title="Who signs it"
              lead={`Every report goes out under a named valuer practising under the ${site.regulator}. If the figure is challenged, that person answers for it.`}
            />
          </Reveal>
          {/* Directors only: they are the ones who sign. The property agents were listed here too,
              under a heading that says who signs, and they do not. */}
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-[760px]">
            {directors.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 80} className="flex">
                <AgentCard agent={agent} className="w-full" />
              </Reveal>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/about/people" variant="onDark" size="md">
              The people who sign our reports
            </Button>
          </div>
        </Container>
      </section>

      {/* Proof, at the point the doubt forms */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Who instructs us"
              lead="Institutions send repeat work to valuers whose reports survive their own review."
              action={
                <Button href="/about/clients" variant="outline" size="md">
                  Our clients in full
                </Button>
              }
            />
          </Reveal>
        </Container>
        <Reveal className="mt-9">
          <PartnerConveyor partners={allPartners} label="CMT Realtors clients" />
        </Reveal>
      </section>

      <CTABanner
        title="Request a valuation"
        lead={`Tell us what needs valuing and what the figure is for. There are ${valuationPurposes.length} routes through the practice and a valuer will tell you which one you are on.`}
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'See our advisory work', href: '/advisory' }}
        image="/images/cta-skyline.jpg"
      />
    </>
  );
}
