import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { Plate, Section, cardClass } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldIcon } from '@/components/ui/icons';
import { getTeam } from '@/lib/content';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';
import { listJoin } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Credentials',
  description: `The registrations and standards behind a ${site.shortName} valuation: who regulates us, what basis of value we report on, and what a bank, auditor or court can rely on.`,
};

/**
 * Credentials.
 *
 * The page that answers "why should this figure be believed". Every registration renders whether
 * or not it is confirmed — an unconfirmed one shows its status instead of a number, so the reader
 * sees the shape of the claim without us making it. See docs/open-items.md #1.
 */
const standards = [
  {
    title: 'A named valuer on every report',
    body: `Reports are signed, not issued by a company. The valuer who inspected the property puts their name to the figure and answers for it if it is questioned.`,
  },
  {
    title: 'The basis of value, stated on page one',
    body: 'Market value, forced-sale value, fair value and reinstatement cost are different numbers for the same asset. Which one applies is agreed at instruction and printed at the front of the report, not left to be inferred.',
  },
  {
    title: 'Evidence you can check',
    body: 'Every figure rests on comparable transactions in the same market, and those comparables are listed. A reviewer who disagrees with the conclusion can see exactly which evidence to argue with.',
  },
  {
    title: 'Assumptions and limitations in writing',
    body: 'What we did not inspect, what we took on trust, and what would change the figure. A report that states its own limits is more useful than one that pretends it has none.',
  },
];

export default async function CredentialsPage() {
  // One row per registering body, naming everyone who holds it (see buildTeam).
  const registrations = (await getTeam()).registrationsByBody;

  return (
    <>
      <PageHeader
        title="Why the figure can be relied on"
        lead="A valuation is only as good as the standing of the person who signed it and the standard they worked to. Here are both."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Credentials' },
        ]}
      />

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Registrations"
            title="Who licenses this practice"
            lead="In which jurisdiction, and under whose name."
          />
        </Reveal>

        <ul className="mt-10 grid gap-4">
          {registrations.map(({ registration, holders }, index) => (
            <Reveal as="li" key={registration.authority} delay={index * 60}>
              <div
                className={cx(
                  cardClass,
                  'grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-7',
                )}
              >
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-green"
                  >
                    <ShieldIcon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-h4 leading-snug font-semibold text-green">
                      {registration.authorityFull}
                      {registration.postNominals && (
                        <span className="ml-2 font-sans text-small font-normal text-muted">
                          {registration.postNominals}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1.5 max-w-[56ch] text-small leading-relaxed text-prose">
                      {registration.jurisdiction}
                    </p>
                    <p className="mt-1.5 max-w-[60ch] text-[12.5px] leading-relaxed text-muted">
                      {holders.length > 2
                        ? `Held by all ${holders.length} of our registered valuers: ${listJoin(holders.map((h) => h.name))}`
                        : `Held by ${holders.map((h) => h.name).join(' and ')}`}
                    </p>
                  </div>
                </div>
                {/* The report card's tag: filled when confirmed, outlined while awaited. */}
                <p className="shrink-0 md:text-right">
                  {registration.confirmed ? (
                    <span className="tnum inline-block rounded-full bg-tag px-3 py-1.5 text-[12px] font-semibold text-tag-ink">
                      {registration.number ?? 'Registered'}
                    </span>
                  ) : (
                    <span className="inline-block rounded-full border border-chip px-3 py-1.5 text-[12px] font-semibold text-muted">
                      Awaiting confirmation
                    </span>
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 max-w-[62ch] text-[12.5px] leading-relaxed text-muted">
          Registration numbers are published here once each holder has confirmed them in writing.
        </p>
      </Section>

      <Section>
        <Plate>
          <Reveal>
            <SectionHeading
              eyebrow="Our standard"
              title="The standard every report is written to"
              lead="Regulation sets the floor. These four are what a bank, an auditor or a court actually needs from the document."
            />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {standards.map((standard, index) => (
              <Reveal as="li" key={standard.title} delay={index * 70} className="flex">
                <div className="flex w-full flex-col rounded-[24px] bg-white p-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="tnum flex h-10 w-10 items-center justify-center rounded-full bg-green font-display text-[15px] font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-h4 font-semibold text-green">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-small leading-relaxed text-muted">{standard.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Plate>
      </Section>

      <CTABanner
        title="Put it to the test"
        lead="Instruct us on something that matters and see whether the report holds up to your own review. That is how most of our clients started."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Who instructs us', href: '/about/clients' }}
      />
    </>
  );
}
