import type { Metadata } from 'next';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { agents, directors, practitioners } from '@/data/agents';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Our people',
  description: `The valuers and agents at ${site.name}, and the professional standing behind the reports they sign.`,
};

/**
 * Directors first and larger, then everyone else. The prototype previously listed only the two
 * property agents, which put the least load-bearing people on the page and left the signatories
 * off it entirely.
 */
export default function PeoplePage() {
  const fromDirectory = agents.filter((agent) => agent.sourcedFrom === 'directory');

  return (
    <>
      <PageHeader
        title="The people who sign the reports"
        lead="A valuation is a judgement made under professional liability. It is worth knowing whose judgement it is."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Our people' },
        ]}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Directors"
              lead="Between them, more than forty years of valuation practice across Kenya and Uganda."
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-[820px]">
            {directors.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 80} className="flex">
                <AgentCard agent={agent} variant="feature" className="w-full" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Valuers and agents"
              lead="Who you will deal with day to day: on an inspection, a viewing or a title check."
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practitioners.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 70} className="flex">
                <AgentCard agent={agent} className="w-full" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* What is missing, said plainly rather than papered over. */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="max-w-[68ch] border border-dashed border-green/30 bg-paper p-6 sm:p-8">
            <h2 className="font-display text-h3 text-green">
              What is still missing from this page
            </h2>
            <p className="mt-3 text-body leading-relaxed text-muted">
              Headshots. We show initials on brand green rather than standing a stock photograph of
              an unrelated person in for a named colleague, which is what most firms do and what we
              would rather not.
            </p>
            <p className="mt-3 text-body leading-relaxed text-muted">
              Qualifications and registration numbers. They are held, and several of the people above
              are chartered or fellows of their institution. But a professional credential belongs
              to the person who earned it, and we publish none of them until CMT confirms the exact
              wording and the numbers.
            </p>
            {fromDirectory.length > 0 && (
              <p className="mt-3 text-body leading-relaxed text-muted">
                {fromDirectory.length === 1 ? 'One entry' : `${fromDirectory.length} entries`} above
                (
                {fromDirectory.map((agent) => agent.name).join(', ')}) came from a business
                directory rather than from CMT&rsquo;s own pages, and the role shown needs
                confirming.
              </p>
            )}
          </div>
        </Container>
      </section>

      <CTABanner
        title="Talk to a valuer"
        lead="Your instruction goes to the person who will inspect the property, not to a queue."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Our credentials', href: '/about/credentials' }}
      />
    </>
  );
}
