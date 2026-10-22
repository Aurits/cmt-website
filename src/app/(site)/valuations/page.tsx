import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { ValuationMatrix } from '@/components/valuations/ValuationMatrix';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ShieldIcon } from '@/components/ui/icons';
import { Plate, Section } from '@/components/ui/Section';
import { ProcessSteps } from '@/components/ProcessSteps';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPartners, getTeam } from '@/lib/content';
import { LEAD, assetBySlug, purposeBySlug } from '@/data/valuations';
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
 * docs/layout-specs.md A-03.
 */
export default async function ValuationsPage() {
  const [{ signatories, signatoryCount }, partners] = await Promise.all([getTeam(), getPartners()]);

  const lead = purposeBySlug[LEAD.purpose];
  const leadAsset = assetBySlug[LEAD.asset];

  return (
    <>
      <PageHeader
        title="What do you need valued, and what for?"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Valuations' }]}
      />

      <Section>
        <ValuationMatrix />
        {/* Desktop only: on a phone the matrix collapses to one line per purpose (see
            ValuationMatrix), which already says what this paragraph explains. */}
        <p className="mt-5 max-w-[68ch] text-small leading-relaxed text-muted max-sm:hidden">
          Most of our work is{' '}
          <span className="font-semibold text-green">
            valuing {leadAsset.short.toLowerCase()} {lead.name.toLowerCase()}
          </span>
          . Choose any cell above to see what that report contains, what it is based on and how long
          it takes. Where a cell says &ldquo;Not offered&rdquo;, we would rather say so than take on
          work we do not do.
        </p>
      </Section>

      <Section>
        <ProcessSteps title="How a valuation actually runs" />
      </Section>

      {/* The deliverable, set as the hero's report card: the contents of every report as rows.
          A redacted sample report belongs beside it once CMT supplies one (content-needed.md). */}
      <Section clip>
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="The deliverable"
              title="What you actually receive"
              lead="Every report carries the same structure, whoever instructed it and whatever it is for."
            />
          </Reveal>
          <Reveal className="relative mr-[26px] mb-[26px]">
            <div
              aria-hidden="true"
              className="absolute inset-[26px_-26px_-26px_26px] rounded-(--radius-plate) bg-sage"
            />
            <div className="relative rounded-(--radius-card) border border-green/8 bg-white p-6 shadow-[0_28px_56px_rgba(15,42,26,0.12)] min-[601px]:p-7">
              <p className="flex items-center gap-2.5 pb-4 text-[12px] font-semibold tracking-[0.14em] text-green uppercase">
                <ShieldIcon width={20} height={20} />
                Every report contains
              </p>
              <dl>
                {[
                  ['Basis of value', 'Stated on the first page, with the definition, not assumed'],
                  ['The figure', 'And the forced-sale position where a lender requires it'],
                  ['Evidence', 'The comparable transactions the figure rests on, listed'],
                  ['Title and tenure', 'Verified, with the unexpired term where leasehold'],
                  ['Assumptions and limits', 'What we did not inspect, and what we took on trust'],
                  ['A name', 'The registered valuer who signs it and answers for it'],
                ].map(([label, detail]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 border-t border-hair py-[13px] text-small min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-6"
                  >
                    <dt className="shrink-0 font-semibold text-green">{label}</dt>
                    <dd className="max-w-[34ch] text-muted min-[480px]:text-right">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Who signs it: the page's one ink plate. */}
      <Section>
        <Plate tone="ink" disc>
          <Reveal>
            <SectionHeading
              onDark
              eyebrow="Signatories"
              title="Who signs it"
              lead={`Every report goes out under one of ${signatoryCount.toLowerCase()} named valuers, each registered with the ${site.regulator}. If the figure is ever challenged, that person answers for it.`}
              leadShort={`One of ${signatoryCount.toLowerCase()} registered valuers, named on every report.`}
            />
          </Reveal>
          {/* The signatory roll: who stands behind the figure, not how to reach them (that is
              /about/people and the contact page). */}
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {signatories.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 60}>
                <div className="flex items-center gap-4 rounded-[20px] border border-white/12 bg-white/[0.04] p-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[15px] font-semibold text-green"
                  >
                    {agent.name
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-h4 leading-tight font-semibold text-white">
                      {agent.name}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-white/70">{agent.role}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="/about/people" variant="onDark">
              The people who sign our reports
            </Button>
          </div>
        </Plate>
      </Section>

      {/* Proof, at the point the doubt forms */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Clients"
              title="Who instructs us"
              lead="Institutions send repeat work to valuers whose reports survive their own review."
              action={
                <Button href="/about/clients" variant="outline">
                  Our clients in full
                </Button>
              }
            />
          </Reveal>
        </Container>
        <Reveal className="mt-10">
          <PartnerConveyor partners={partners} label="CMT Realtors clients" />
        </Reveal>
      </section>

      <CTABanner
        title="Request a valuation"
        lead="Tell us what needs valuing and what the figure is for. Not sure which kind you need? A valuer will advise before anything is agreed."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'See our advisory work', href: '/advisory' }}
      />
    </>
  );
}
