import type { Metadata } from 'next';
import Image from 'next/image';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { StatsStrip } from '@/components/StatsStrip';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldIcon } from '@/components/ui/icons';
import { agents } from '@/data/agents';
import { partnerCount } from '@/data/partners';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About Us',
  description: `${site.name} is a Kampala valuation and property consultancy firm regulated by the ${site.regulator}, with more than sixteen years of instructions from banks, government bodies and corporate clients.`,
};

/**
 * PLACEHOLDER STORY. The real company history is an open item with the client, so the
 * timeline is written as stages rather than dated milestones — we would rather show the
 * shape of the section than invent years CMT never gave us.
 */
const chapters = [
  {
    stage: 'The start',
    title: 'A valuation practice on Kampala Road',
    body: 'CMT Realtors was founded as a professional valuation practice serving lenders and private owners in Kampala, working from the firm’s present offices on Kampala Road.',
  },
  {
    stage: 'Panel appointments',
    title: 'Onto the bank panels',
    body: 'Repeat instructions from commercial banks followed, and with them the reporting discipline that secured lending demands: verified titles, comparable evidence, and a stated forced-sale position.',
  },
  {
    stage: 'Beyond the capital',
    title: 'Instructions outside Kampala',
    body: `Work for national institutions took the practice upcountry, and inspections in ${site.cities.slice(1).join(', ')} became routine rather than exceptional.`,
  },
  {
    stage: 'Now',
    title: 'Valuation, consultancy and agency',
    body: 'Today the firm combines valuation and consultancy with a property agency arm, so an owner can get both a defensible figure and a route to market from the same practice.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={site.tagline}
        lead={`${site.name} is a Ugandan valuation and property consultancy practice. Banks lend against our figures, public bodies rely on them for compensation, and owners use them to price property honestly.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      <StatsStrip />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              title="What 16+ years of instructions buys you"
              lead="Not a longer brochure — a body of evidence. Valuation is a judgement call made under professional liability, and the firms that last are the ones whose judgement holds up when a lender, a court or a tax authority tests it."
            />
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
              <p>
                We are regulated by the {site.regulator}, and every report goes out under a
                named valuer. That matters most when a figure is contested: there is a
                professional standard behind it and a person answerable for it.
              </p>
              <p>
                Our work spans {site.cities.join(', ')}, across residential, commercial,
                industrial, land and agricultural property. {partnerCount} institutions
                appear in our client list, and most of them come back.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-brand border border-rule lg:aspect-auto lg:min-h-[420px]">
            <Image
              src="/images/identity-office.jpg"
              alt="Kampala's business district under a clear sky"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Numbered because this genuinely is a sequence. */}
      <section className="bg-cream-deep/45 py-16 lg:py-24">
        <Container>
          <SectionHeading
            title="How the practice grew"
            lead="Four stages, from a single valuation desk to a practice instructed nationwide."
          />
          <ol className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {chapters.map((chapter, index) => (
              <li key={chapter.stage} className="bg-paper p-6 lg:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="tnum font-display text-[1.75rem] leading-none text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[0.8125rem] text-muted">{chapter.stage}</span>
                </div>
                <h3 className="mt-4 text-[1.1875rem] text-green">{chapter.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{chapter.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            title="The people you will deal with"
            lead="Valuation is personal work: someone inspects the property, signs the report and answers the questions that follow."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-[760px]">
            {agents.map((agent) => (
              <li key={agent.id} className="flex">
                <AgentCard agent={agent} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-green py-16 text-cream lg:py-24">
        <Container>
          <SectionHeading
            onDark
            title="Accreditation and membership"
            lead="The credentials that let a CMT report be relied on."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex gap-4 rounded-brand border border-cream/20 p-6">
              <ShieldIcon width={26} height={26} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <h3 className="text-[1.0625rem] text-cream">{site.regulator}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/80">
                  The professional body for surveyors and valuers in Uganda. Our valuers
                  practise under its regulation.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-brand border border-dashed border-cream/30 p-6">
              <div>
                <h3 className="text-[1.0625rem] text-cream/90">Further memberships</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/70">
                  Registration numbers and any additional professional memberships to be
                  confirmed by CMT, then shown here as badges.
                </p>
              </div>
            </li>
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Talk to our team"
        lead="Tell us what you need valued or listed. You will speak to the valuer who would handle it, not a switchboard."
        primary={{ label: 'Talk to our team', href: '/contact?subject=general' }}
        secondary={{ label: 'Request a valuation', href: '/contact?subject=valuation' }}
      />
    </>
  );
}
