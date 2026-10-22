import type { Metadata } from 'next';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { Plate, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getTeam } from '@/lib/content';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Our people',
  description: `The registered valuers who sign every ${site.name} report, led by its two Technical Directors.`,
};

/**
 * Directors first and larger, then everyone else. The prototype previously listed only the two
 * property agents, which put the least load-bearing people on the page and left the signatories
 * off it entirely.
 */
export default async function PeoplePage() {
  const { directors, practitioners, signatoryCount } = await getTeam();

  return (
    <>
      <PageHeader
        title="The people who sign the reports"
        lead={`${signatoryCount} registered valuers sign every ${site.shortName} report. A valuation is a professional judgement, and you should know whose it is.`}
        leadShort={`${signatoryCount} registered valuers sign every report.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Our people' },
        ]}
      />

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Technical Directors"
            title="The two who lead the technical team"
            lead="Between them, more than forty years of valuation practice across Uganda and Kenya. They lead the technical team and answer for its work."
            leadShort="More than forty years of practice between them."
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

      <Section>
        <Plate>
          <Reveal>
            <SectionHeading
              eyebrow="Registered valuers"
              title="Who you will meet on an inspection"
              lead={`Each is registered with the ${site.regulator}, and each signs the reports they prepare.`}
              leadShort={`Each registered with the ${site.regulator}.`}
            />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {practitioners.map((agent, index) => (
              <Reveal as="li" key={agent.id} delay={index * 70} className="flex">
                <AgentCard agent={agent} className="w-full" />
              </Reveal>
            ))}
          </ul>
        </Plate>
      </Section>

      <CTABanner
        title="Talk to a valuer"
        lead="Your instruction goes to the person who will inspect the property, not to a queue."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'Our credentials', href: '/about/credentials' }}
      />
    </>
  );
}
