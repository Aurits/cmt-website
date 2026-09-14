import type { Metadata } from 'next';
import Image from 'next/image';
import { CTABanner } from '@/components/CTABanner';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories } from '@/data/categories';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Property valuation, valuation for lending, real estate consultancy, and listing and sales management across Uganda.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="What do you need to know about a property?"
        lead="Most instructions start with one of four questions: what is it worth, will a bank lend against it, what should we do with it, or who will buy it. Each one has a route through the practice."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      {/*
        One service per row, the photograph alternating sides. A four-card grid would
        shrink each service to a caption; a row gives the summary, the detail and the
        deliverables schedule room to be read, and the alternation keeps a long page moving.

        The photographs are close-ups of the work itself — a tape, a signature, a
        blueprint, a set of keys — not a place, so there's no location for them to get
        right or wrong.
      */}
      <section className="py-14 lg:py-20">
        <Container>
          <ul className="space-y-14 lg:space-y-20">
            {services.map((service, index) => {
              const imageFirst = index % 2 === 0;
              return (
                <li
                  key={service.slug}
                  id={service.slug}
                  className="grid scroll-mt-32 items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <Reveal
                    className={cx(
                      'relative aspect-[4/3] overflow-hidden rounded-brand border border-rule',
                      imageFirst ? 'lg:order-1' : 'lg:order-2',
                    )}
                  >
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </Reveal>

                  <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
                    <Reveal>
                      <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
                      <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] text-green">
                        {service.name}
                      </h2>
                      <p className="mt-4 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink/85">
                        {service.summary}
                      </p>
                      <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
                        {service.detail}
                      </p>
                    </Reveal>

                    <Reveal delay={80}>
                      <dl className="mt-7">
                        <dt className="text-[0.8125rem] text-muted">What you receive</dt>
                        {service.deliverables.map((item) => (
                          <dd key={item} className="schedule-row text-[0.9375rem] text-ink">
                            <span>{item}</span>
                          </dd>
                        ))}
                      </dl>

                      <div className="mt-7">
                        <Button href={service.cta.href} variant="primary" size="md">
                          {service.cta.label}
                        </Button>
                      </div>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="bg-cream-deep/45 py-14 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal className="relative aspect-[3/2] overflow-hidden rounded-brand border border-rule">
            <Image
              src="/images/valuation-keys.jpg"
              alt="A model house and a set of keys on a desk"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                title="How a valuation actually runs"
                lead="Four steps, and you are told at the start which of them affect the timeline."
              />
            </Reveal>
            <ol className="mt-8">
              {[
                {
                  title: 'Instruction and scope',
                  body: 'We agree what is being valued, why, and for whom — a bank, a court and a seller each need a different basis of value.',
                },
                {
                  title: 'Title and inspection',
                  body: 'We verify the title and tenure, then inspect and measure the property, photographing what the report will rely on.',
                },
                {
                  title: 'Evidence and analysis',
                  body: 'Comparable transactions in the same market are gathered and adjusted. Where income drives value, we work from the rent roll.',
                },
                {
                  title: 'Signed report',
                  body: 'You receive a written report under a named valuer, with the assumptions, the evidence and the limitations stated plainly.',
                },
              ].map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 70}>
                  <div className="flex gap-5 border-t border-rule py-4">
                    <span className="tnum font-display text-[1.375rem] leading-none text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.0625rem] text-green">{step.title}</h3>
                      <p className="mt-1.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              title="Every property type, across four cities"
              lead={`We inspect and report in ${site.cities.join(', ')}, on all five classes of property.`}
            />
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={index * 60}>
                <a
                  href={`/listings/${category.slug}`}
                  className="flex h-full flex-col rounded-brand border border-rule bg-paper p-5 transition-colors hover:border-green/40"
                >
                  <span className="font-display text-[1.0625rem] text-green">{category.name}</span>
                  <span className="mt-1.5 text-[0.875rem] leading-snug text-muted">
                    {category.label}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABanner
        title="Request a consultation"
        lead="Bring us the property and the decision you are trying to make. We will tell you what the work involves and what it costs before it starts."
        primary={{ label: 'Request a consultation', href: '/contact?subject=general' }}
        secondary={{ label: 'Request a valuation', href: '/contact?subject=valuation' }}
        image="/images/cta-skyline.jpg"
      />
    </>
  );
}
