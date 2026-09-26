import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { StatsStrip } from '@/components/StatsStrip';
import { StandingSchedule } from '@/components/about/StandingSchedule';
import { SurveyBaseline } from '@/components/about/SurveyBaseline';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { directors } from '@/data/agents';
import { partnerCount } from '@/data/partners';
import { offices, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description: `${site.name} is a valuation and property consultancy practice in Uganda and Kenya. Banks, auditors, courts and government bodies rely on our reports, and on the valuers who sign them.`,
};

/**
 * About — the firm.
 *
 * Built as the cover sheet of a valuation report: every report CMT issues opens by stating who
 * prepared it and under what authority, and this page is that page. It now sits first in the
 * navigation, so it opens on registrations rather than on a mission statement and has to establish
 * standing in one screen. See docs/LAYOUT-SPECS.md A-02.
 */
const chapters = [
  {
    stage: 'The start',
    title: 'A valuation practice on Kampala Road',
    body: 'CMT began as a professional valuation practice serving lenders and private owners in Kampala, working from the firm’s present offices on Kampala Road.',
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
    stage: 'Across the border',
    title: 'A second practice in Kenya',
    body: 'CMT Realtors was incorporated in Kenya in 2010 and now works from Nairobi with branches in Mombasa, Kisumu, Kisii and Bungoma. The same standard of report, either side of the border.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Standing first. The schedule is the lead, not a lead paragraph. */}
      <section className="bg-green text-cream">
        <Container className="py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro text-cream/70">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-cream/40">
                /
              </li>
              <li aria-current="page" className="text-cream">
                About
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_560px] lg:items-end lg:gap-16">
            <div>
              <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
              <h1 className="max-w-[20ch] text-h1 text-cream">
                A figure is only worth the name on it
              </h1>
              <p className="mt-5 max-w-[56ch] text-lead leading-relaxed text-cream/80">
                {site.name} is a valuation and property consultancy practice working in Uganda and
                Kenya. Banks lend against our figures, auditors rely on them, public bodies use them
                to assess compensation, and owners use them to price property honestly.
              </p>
            </div>

            <div>
              <p className="mb-1 text-label uppercase tracking-[0.12em] text-gold">
                Under what authority
              </p>
              <StandingSchedule />
              <p className="mt-3 max-w-[52ch] text-micro leading-relaxed text-cream/70">
                Registration numbers are published here once each holder has confirmed them in
                writing.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SurveyBaseline />

      <StatsStrip />

      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                title="What the years actually buy you"
                lead="Not a longer brochure, but a body of evidence. Valuation is a judgement made under professional liability, and the firms that last are the ones whose judgement holds up when a lender, a court or a tax authority tests it."
              />
            </Reveal>
            <Reveal delay={70}>
              <div className="mt-8 space-y-5 text-lead leading-relaxed text-muted">
                <p>
                  Every report goes out under a named valuer practising under the {site.regulator}.
                  That matters most when a figure is contested: there is a professional standard
                  behind it and a person answerable for it.
                </p>
                <p>
                  Our work spans {offices.length} offices in two countries, across residential,
                  commercial, industrial, land and agricultural property, and beyond property into
                  plant, machinery and business assets. {partnerCount} institutions appear in our
                  client list, and most of them come back.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/about/credentials" variant="primary" size="md">
                  Our credentials in full
                </Button>
                <Button href="/about/people" variant="outline" size="md">
                  The people who sign
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative aspect-[4/3] overflow-hidden border border-rule lg:aspect-auto lg:min-h-[420px]">
            <Image
              src="/images/identity-office.jpg"
              alt="Kampala's business district under a clear sky"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </Container>
      </section>

      {/* The story, as a vertical schedule rather than a 2x2 grid. */}
      <section className="bg-mist py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="How the practice grew"
              lead="Four stages, from a single valuation desk in Kampala to two practices working either side of the border."
            />
          </Reveal>
          <ol className="mt-8 border-t border-rule">
            {chapters.map((chapter, index) => (
              <Reveal as="li" key={chapter.stage} delay={index * 70}>
                <div className="grid gap-2 border-b border-rule py-6 md:grid-cols-[4rem_14rem_1fr] md:gap-8">
                  <span className="tnum font-display text-figure leading-none text-gold-deep">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-micro text-muted">{chapter.stage}</p>
                    <h3 className="mt-1 font-display text-h4 leading-snug text-green">
                      {chapter.title}
                    </h3>
                  </div>
                  <p className="max-w-[62ch] text-body leading-relaxed text-muted">
                    {chapter.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Signatories. Directors lead, and are rendered larger than the agents. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="The people who sign the reports"
              lead="Valuation is personal work: someone inspects the property, signs the report and answers the questions that follow."
              action={
                <Button href="/about/people" variant="outline" size="md">
                  The whole team
                </Button>
              }
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {directors.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 80} className="flex">
                <AgentCard agent={agent} variant="feature" className="w-full" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Talk to our team"
        lead="Tell us what you need valued or listed. You will speak to the valuer who would handle it, not a switchboard."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Who instructs us', href: '/about/clients' }}
      />
    </>
  );
}
