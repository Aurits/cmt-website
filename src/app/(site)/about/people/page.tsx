import type { Metadata } from 'next';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { directors, practitioners } from '@/data/agents';
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
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {directors.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 80} className="flex">
                <AgentCard agent={agent} variant="feature" className="w-full" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Valuers and agents"
              lead="Who you will deal with day to day: on an inspection, a viewing or a title check."
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {practitioners.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 70} className="flex">
                <AgentCard agent={agent} className="w-full" />
              </Reveal>
            ))}
          </ul>
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
