import type { Metadata } from 'next';
import Image from 'next/image';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { advisoryServices } from '@/data/advisory';
import { categories } from '@/data/categories';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Advisory',
  description:
    'Development consultancy, acquisition and disposal, asset and facilities management, project management and market research across Uganda and Kenya.',
};

/**
 * Advisory.
 *
 * An index, not a product grid. Advisory work is scoped, priced and negotiated rather than bought
 * off a card, so the page is built as the contents page of a capability statement — and the
 * restraint is itself the positioning. One photograph on the whole page, deliberately: the old
 * Services page alternated four stock shots of hands and blueprints, which said nothing and
 * tripled the page height. See LAYOUT-SPECS.md A-05.
 */
export default function AdvisoryPage() {
  return (
    <>
      <PageHeader
        title="Advice before you commit"
        lead="Everything that is not a valuation report. Each engagement is scoped in writing before it starts, so the fee and the deliverable are agreed up front rather than discovered later."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Advisory' }]}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <ul className="border-t border-rule">
            {advisoryServices.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 60}>
                <div
                  id={service.slug}
                  className="group scroll-mt-32 border-b border-rule border-l-[3px] border-l-transparent py-7 pl-0 transition-[border-color,padding] duration-200 hover:border-l-gold hover:pl-4 md:grid md:grid-cols-[20ch_1fr] md:gap-10"
                >
                  <div>
                    <h2 className="font-display text-h4 leading-snug text-green transition-colors group-hover:text-gold-deep">
                      {service.name}
                    </h2>
                    <p className="mt-1.5 text-micro leading-snug text-muted">
                      For: {service.audience}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <p className="max-w-[62ch] text-body leading-relaxed text-ink/85">
                      {service.summary}
                    </p>
                    <dl className="mt-4">
                      {service.deliverables.map((item) => (
                        <dd key={item} className="schedule-row text-body text-muted">
                          <span>{item}</span>
                        </dd>
                      ))}
                    </dl>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* The one photograph on the page. */}
      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <Reveal className="relative aspect-[3/2] overflow-hidden border border-rule">
            <Image
              src="/images/services/consultancy.jpg"
              alt="Hands working over an architectural blueprint"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                title="How an engagement runs"
                lead="Consultancy is not a product, so it is not priced like one."
              />
            </Reveal>
            <Reveal delay={70}>
              <dl className="mt-7">
                {[
                  [
                    'Scoped in writing first',
                    'What we will do, what you receive and what it costs, agreed before any work starts.',
                  ],
                  [
                    'Fee basis stated',
                    'Fixed fee where the scope is fixed, time basis where it genuinely is not. Never a percentage of a number we are also producing.',
                  ],
                  [
                    'One person answerable',
                    'You deal with the consultant doing the work, not an account manager relaying it.',
                  ],
                  [
                    'Assumptions on the page',
                    'Advice is only as good as what it assumed. Ours is written down so you can test it.',
                  ],
                ].map(([title, body]) => (
                  <div key={title} className="border-t border-rule py-4">
                    <dt className="font-display text-lead text-green">{title}</dt>
                    <dd className="mt-1.5 max-w-[58ch] text-body leading-relaxed text-muted">
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Where we have done this work"
              lead={`Across all five property classes, in ${site.cities.join(', ')} and beyond.`}
            />
          </Reveal>
          <ul className="mt-8 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={index * 50}>
                <a
                  href={`/listings/${category.slug}`}
                  className="inline-block border border-rule bg-paper px-3.5 py-2 text-body text-green transition-colors hover:border-green/50"
                >
                  {category.name}
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Request a consultation"
        lead="Bring us the property and the decision you are trying to make. We will tell you what the work involves and what it costs before it starts."
        primary={{ label: 'Request a consultation', href: '/contact' }}
        secondary={{ label: 'See our valuation work', href: '/valuations' }}
        image="/images/cta-skyline.jpg"
      />
    </>
  );
}
