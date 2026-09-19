import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { AgentCard } from '@/components/AgentCard';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { ValuationMatrix } from '@/components/valuations/ValuationMatrix';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { agents } from '@/data/agents';
import { allPartners } from '@/data/partners';
import { assetBySlug, purposeBySlug, LEAD, valuationPurposes } from '@/data/valuations';
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
 * LAYOUT-SPECS.md A-03.
 */
const steps = [
  {
    title: 'Instruction and scope',
    body: 'We agree what is being valued, why, and for whom. A bank, a court and a seller each need a different basis of value, and that is settled before anyone travels.',
  },
  {
    title: 'Title and inspection',
    body: 'We verify the title and tenure, then inspect and measure, photographing what the report will rely on.',
  },
  {
    title: 'Evidence and analysis',
    body: 'Comparable transactions in the same market are gathered and adjusted. Where income drives value, we work from the rent roll.',
  },
  {
    title: 'Signed report',
    body: 'A written report under a named valuer, with the assumptions, the evidence and the limitations stated plainly.',
  },
];

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
          <p className="mt-4 max-w-[68ch] text-body leading-relaxed text-muted">
            <span className="font-medium text-ink">
              {lead.name} on {leadAsset.short.toLowerCase()}
            </span>{' '}
            is the majority of what we are instructed to do, and the reason most people are on this
            page. Every combination above leads to what the report contains, what it is based on and
            how long it takes. A dash means we do not offer it. We would rather say so than take the
            instruction.
          </p>
        </Container>
      </section>

      {/* How it runs */}
      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="How a valuation actually runs"
              lead="Four steps, and you are told at the start which of them affect the timeline."
            />
          </Reveal>
          <ol className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 70} className="flex">
                <div className="flex w-full flex-col bg-paper p-5 lg:p-6">
                  <span className="tnum font-display text-figure leading-none text-gold-deep">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-h4 text-green">{step.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* The deliverable — OPEN ITEM #9: a redacted sample report would replace this panel. */}
      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <SectionHeading
              title="What you actually receive"
              lead="Every report carries the same structure, whoever instructed it and whatever it is for."
            />
            <dl className="mt-7">
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
          <Reveal delay={80}>
            <div className="border border-rule bg-paper p-6 lg:p-8">
              <p className="font-display text-h4 leading-snug text-green">
                A sample report, redacted, will sit here.
              </p>
              <p className="mt-3 text-body leading-relaxed text-muted">
                No firm in this market shows one, and a single redacted contents page answers
                &ldquo;what do I actually get&rdquo; better than any paragraph could. We have asked CMT
                for one rather than mocking up a document that does not exist.
              </p>
              <p className="mt-4 text-micro text-muted">See OPEN-ITEMS.md, item 9.</p>
            </div>
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
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-[760px]">
            {agents.map((agent, index) => (
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
