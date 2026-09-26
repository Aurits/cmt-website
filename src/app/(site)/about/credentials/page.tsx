import type { Metadata } from 'next';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShieldIcon } from '@/components/ui/icons';
import { agents } from '@/data/agents';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';

export const metadata: Metadata = {
  title: 'Credentials',
  description: `The registrations and standards behind a ${site.shortName} valuation: who regulates us, what basis of value we report on, and what a bank, auditor or court can rely on.`,
};

/**
 * Credentials.
 *
 * The page that answers "why should this figure be believed". Every registration renders whether
 * or not it is confirmed — an unconfirmed one shows its status instead of a number, so the reader
 * sees the shape of the claim without us making it. See docs/OPEN-ITEMS.md #1.
 */
const standards = [
  {
    title: 'A named valuer on every report',
    body: `Reports are signed, not issued by a company. The valuer who inspected the property puts their name to the figure and answers for it if it is questioned. That is what practising under the ${site.regulator} means in practice.`,
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

export default function CredentialsPage() {
  const registrations = agents.flatMap((agent) =>
    (agent.registrations ?? []).map((registration) => ({ registration, holder: agent })),
  );

  return (
    <>
      <PageHeader
        title="Why the figure can be relied on"
        lead="A valuation is only as good as the standing of the person who signed it and the standard they worked to. Here is both."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Credentials' },
        ]}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Registrations"
              lead="Who licenses this practice, in which jurisdiction, and under whose name."
            />
          </Reveal>

          <ul className="mt-8 border-t border-rule">
            {registrations.map(({ registration, holder }, index) => (
              <Reveal as="li" key={`${holder.id}-${registration.authority}`} delay={index * 60}>
                <div className="grid gap-3 border-b border-rule py-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10">
                  <div className="flex gap-4">
                    <ShieldIcon
                      width={22}
                      height={22}
                      className="mt-1 shrink-0 text-gold-deep"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-display text-h4 leading-snug text-green">
                        {registration.authorityFull}
                        {registration.postNominals && (
                          <span className="ml-2 text-body text-muted">
                            {registration.postNominals}
                          </span>
                        )}
                      </h3>
                      <p className="mt-1.5 max-w-[56ch] text-body leading-relaxed text-muted">
                        {registration.jurisdiction}
                      </p>
                      <p className="mt-1.5 text-micro text-muted">Held by {holder.name}</p>
                    </div>
                  </div>
                  <p
                    className={cx(
                      'tnum shrink-0 self-center text-body md:text-right',
                      registration.confirmed ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {registration.confirmed && registration.number ? (
                      registration.number
                    ) : (
                      <span className="inline-block border border-rule bg-mist/50 px-2.5 py-1 text-micro">
                        Awaiting confirmation
                      </span>
                    )}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>

          <p className="mt-6 max-w-[62ch] text-micro leading-relaxed text-muted">
            Registration numbers are published here once each holder has confirmed them in writing.
          </p>
        </Container>
      </section>

      {/* Mist, not green: with the to-do section that used to follow it removed, a green band
          here would sit directly against the green closing banner. */}
      <section className="bg-mist py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="The standard every report is written to"
              lead="Regulation sets the floor. These four are what a bank, an auditor or a court actually needs from the document."
            />
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {standards.map((standard, index) => (
              <Reveal as="li" key={standard.title} delay={index * 70} className="flex">
                <div className="flex w-full flex-col border border-rule bg-paper p-6">
                  <h3 className="text-h4 text-green">{standard.title}</h3>
                  <p className="mt-2.5 text-body leading-relaxed text-muted">
                    {standard.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Put it to the test"
        lead="Instruct us on something that matters and see whether the report holds up to your own review. That is how most of our clients started."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Who instructs us', href: '/about/clients' }}
        image="/images/cta-skyline.jpg"
      />
    </>
  );
}
