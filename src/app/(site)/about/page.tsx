import type { Metadata } from 'next';
import { listJoin } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { FactStrip } from '@/components/FactStrip';
import { StandingSchedule } from '@/components/about/StandingSchedule';
import { SurveyBaseline } from '@/components/about/SurveyBaseline';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ShieldIcon } from '@/components/ui/icons';
import { Plate, Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { clientCount } from '@/data/clients';
import { offices, site } from '@/data/site';
import { getStats, getTeam } from '@/lib/content';
import { cx } from '@/lib/cx';

export const metadata: Metadata = {
  title: 'About',
  description: `${site.name} is a valuation and property consultancy practice in Uganda and Kenya. Banks, auditors, courts and government bodies rely on our reports, and on the valuers who sign them.`,
};

/**
 * About: the firm, in the hero design's language (see the homepage and Section.tsx).
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
    body: `Work for national institutions took the practice upcountry, and inspections in ${listJoin(site.cities.slice(1))} became routine rather than exceptional.`,
  },
  {
    stage: 'Across the border',
    title: 'A second practice in Kenya',
    body: 'CMT Realtors was incorporated in Kenya in 2010 and now works from Nairobi with branches in Mombasa, Kisumu, Kisii and Bungoma. The same standard of report, either side of the border.',
  },
];

export default async function AboutPage() {
  const [team, stats] = await Promise.all([getTeam(), getStats()]);
  const { directors, signatoryCount } = team;
  // The ledger, as the hero design's fact strip: the count is the fact, the unit and the line of
  // evidence its caption.
  const facts = stats.map((stat) => ({ title: `${stat.value} ${stat.unit}`, body: stat.label }));

  return (
    <>
      {/* Standing first: the claim on the left, the registrations as a report card on the right,
          the same two-column composition as the homepage hero. */}
      <section className="overflow-x-clip">
        <Container className="pt-8 min-[961px]:pt-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              <li>
                <Link href="/" className="hover:text-green">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-chip">
                /
              </li>
              <li aria-current="page" className="text-green">
                About
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-14 pb-14 min-[961px]:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] min-[961px]:gap-[72px] min-[961px]:pb-[72px]">
            <div>
              <p className="mb-[22px] flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
                <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
                About CMT Realtors
              </p>
              <h1 className="max-w-[20ch] text-h1 tracking-[-0.02em] text-balance text-green">
                A figure is only worth the name on it
              </h1>
              <p className="mt-6 max-w-[560px] text-hero-lead leading-[1.6] text-prose">
                {/* Short on a phone, where the full list pushed the registrations off the first
                    screen. See "THE MOBILE SYSTEM" in globals.css. */}
                <span className="sm:hidden">
                  Banks lend against our figures. Auditors and public bodies rely on them.
                </span>
                <span className="max-sm:hidden">
                  {site.name} is a valuation and property consultancy practice working in Uganda
                  and Kenya. Banks lend against our figures, auditors rely on them, public bodies
                  use them to assess compensation, and owners use them to price property honestly.
                </span>
              </p>
            </div>

            <div className="relative mr-[26px] min-[961px]:mr-0">
              <div aria-hidden="true" className="absolute inset-[26px_-26px_-26px_26px] rounded-(--radius-plate) bg-sage" />
              <div className="relative rounded-(--radius-card) border border-green/8 bg-white p-6 shadow-[0_28px_56px_rgba(15,42,26,0.12)] min-[601px]:p-7">
                <p className="flex items-center gap-2.5 pb-4 text-[12px] font-semibold tracking-[0.14em] text-green uppercase">
                  <ShieldIcon width={20} height={20} />
                  Our registrations
                </p>
                <StandingSchedule registrations={team.firmRegistrations} />
                <p className="mt-3 border-t border-hair pt-4 text-[12.5px] leading-relaxed text-muted">
                  Registration numbers are published here once each holder has confirmed them in
                  writing.
                </p>
              </div>
            </div>
          </div>

          <FactStrip facts={facts} />
        </Container>
      </section>

      <div className="pt-6 lg:pt-10">
        <SurveyBaseline />
      </div>

      <Section clip>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Our record"
                title="What the years actually buy you"
                lead="Sixteen years of figures that have held up when a lender, a court or a tax authority tested them. Valuation is a judgement made under professional liability, and that record is what the years are worth."
                leadShort="Firms last when their judgement holds up to a lender, a court or a tax authority."
              />
            </Reveal>
            <Reveal delay={70}>
              {/* Desktop only: the named valuer is the page title's claim, and the offices and
                  client count sit in the fact strip above. */}
              <div className="mt-8 space-y-5 text-lead leading-relaxed text-prose max-sm:hidden">
                <p>
                  Every report goes out under one of our registered valuers, named on the report
                  and registered with the {site.regulator}. That matters most when a figure is
                  contested: there is a professional standard behind it and a person answerable
                  for it.
                </p>
                <p>
                  Our work spans {offices.length} offices in two countries, across residential,
                  commercial, industrial, land and agricultural property, and beyond property into
                  plant, machinery and business assets. {clientCount} institutions are on our
                  client list, and most of them keep coming back.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button href="/about/credentials" size="lg" arrow>
                  Our credentials in full
                </Button>
                <Button href="/about/people" variant="outline" size="lg">
                  The people who sign
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative mr-[22px] mb-[22px]">
            <div aria-hidden="true" className="absolute inset-[22px_-22px_-22px_22px] rounded-(--radius-plate) bg-sage" />
            <div aria-hidden="true" className="absolute -top-5 -right-5 h-16 w-16 rounded-full bg-gold" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius-card) lg:aspect-[4/5]">
              {/* A surveyor at work in the field, no building in frame (PLAN.md rules out
                  identifiable Kampala towers without confirmed rights). Licensed stock, so the alt
                  describes the scene and does not claim the person is a CMT valuer. */}
              <Image
                src="/images/survey-field.jpg"
                alt="A surveyor taking readings from a total station in open grassland"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* The story, on a sage plate: four stages as white rows, each numbered in a disc. */}
      <Section>
        <Plate>
          <Reveal>
            <SectionHeading
              eyebrow="Our story"
              title="How the practice grew"
              lead="Four stages, from a single valuation desk in Kampala to two practices working either side of the border."
              leadShort="From one valuation desk in Kampala to two practices."
            />
          </Reveal>
          <ol className="mt-10 grid gap-3">
            {chapters.map((chapter, index) => (
              <Reveal as="li" key={chapter.stage} delay={index * 70}>
                <div className="grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-2 rounded-[24px] bg-white p-5 sm:p-6 md:grid-cols-[2.5rem_15rem_1fr] md:gap-x-8">
                  <span
                    aria-hidden="true"
                    className={cx(
                      'tnum flex h-10 w-10 items-center justify-center rounded-full font-display text-[15px] font-semibold',
                      index === chapters.length - 1 ? 'bg-gold text-green' : 'bg-green text-white',
                    )}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[12.5px] text-muted">{chapter.stage}</p>
                    <h3 className="mt-1 font-display text-h4 leading-snug font-semibold text-green">
                      {chapter.title}
                    </h3>
                  </div>
                  {/* Desktop only: on a phone the four titles read as the story in one breath. */}
                  <p className="text-small leading-relaxed text-muted max-sm:hidden sm:col-start-2 md:col-start-auto">
                    {chapter.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Plate>
      </Section>

      {/* Signatories. Directors lead. */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our people"
            title="The people who sign the reports"
            lead={`Valuation is personal work: someone inspects the property, signs the report and answers the questions that follow. At ${site.shortName}, that is one of ${signatoryCount.toLowerCase()} registered valuers, led by our two Technical Directors.`}
            leadShort={`${signatoryCount} registered valuers, led by two Technical Directors.`}
            action={
              <Button href="/about/people" variant="outline">
                Meet all {signatoryCount.toLowerCase()}
              </Button>
            }
          />
        </Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {directors.map((agent, index) => (
            <Reveal as="li" key={agent.id} delay={index * 80} className="flex">
              <AgentCard agent={agent} variant="feature" className="w-full" />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CTABanner
        title="Talk to our team"
        lead="Tell us what you need valued or listed. You will speak to the valuer who would handle it, not a switchboard."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Who instructs us', href: '/about/clients' }}
      />
    </>
  );
}
