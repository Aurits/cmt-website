import Image from 'next/image';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { CategoryCard } from '@/components/CategoryCard';
import { HeroSearchTabs } from '@/components/HeroSearchTabs';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { StatsStrip } from '@/components/StatsStrip';
import { TestimonialCard, TestimonialsPending } from '@/components/TestimonialCard';
import { FeaturedCarousel } from '@/components/property/FeaturedCarousel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories } from '@/data/categories';
import { featuredListings, listings, listingsByCategory } from '@/data/listings';
import { allPartners, partnerCount } from '@/data/partners';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { testimonials } from '@/data/testimonials';

/**
 * Homepage.
 *
 * Section order follows the brief. Each section is kept to the shortest form that still
 * does its job, because the whole page has to be scrollable on a phone on mobile data:
 * the featured stock is a single full-bleed carousel rather than a grid, the client list
 * is one belt (the categorised belts live on /clients), and the identity section carries
 * three claims rather than four.
 */
const reasons = [
  {
    title: 'Regulated, and answerable for the figure',
    body: `Our valuers work under the ${site.regulator}, so a CMT report carries a name and a professional standard behind it.`,
  },
  {
    title: 'Already on the panel',
    body: `${partnerCount} institutions instruct us, most of them repeatedly — the work has stood up to their own review for over fifteen years.`,
  },
  {
    title: 'Evidence before opinion',
    body: 'Every figure starts from comparable transactions in the same market, and the report shows you the evidence it rests on.',
  },
];

export default function HomePage() {
  const featured = featuredListings.slice(0, 5);

  return (
    <>
      {/* Hero: identity first, product second — the nav order makes the same argument. */}
      <section className="relative overflow-hidden bg-cream pt-10 lg:pt-14">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="hero-rise">
            <h1 className="text-display text-green">
              Fifteen years of valuations Uganda&rsquo;s banks lend against
            </h1>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted sm:text-[1.125rem]">
              CMT Realtors is a Kampala valuation and property consultancy firm, regulated by
              the {site.regulator}. Banks, government bodies and corporate clients instruct us
              when a figure has to hold up to scrutiny. We sell and let property too, priced
              from the same evidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/listings" variant="primary" size="lg">
                Browse properties
              </Button>
              <Button href="/contact?subject=valuation" variant="outline" size="lg">
                Request a valuation
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-green/10 lg:aspect-[5/4]">
            <Image
              src="/images/hero-home.jpg"
              alt="Contemporary house at dusk with lit interiors and a lawn"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        {/* The counter: the three jobs a visitor came to do, closing the hero. */}
        <Container className="relative z-10 mt-8 pb-8 lg:mt-10 lg:pb-12">
          <div className="rounded-[2px] border border-rule border-t-2 border-t-gold">
            <HeroSearchTabs />
          </div>
        </Container>
      </section>

      <StatsStrip />

      {/* Featured stock, full width. The immersive moment of the page. */}
      <FeaturedCarousel listings={featured} />

      <section className="border-b border-rule bg-paper py-4">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.9375rem] text-muted">
            {featured.length} of{' '}
            <span className="tnum font-medium text-ink">{listings.length}</span> current
            instructions, across five property classes and four cities.
          </p>
          <Button href="/listings" variant="quiet" size="sm">
            Browse every property
          </Button>
        </Container>
      </section>

      {/* Identity */}
      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 aspect-[4/3] overflow-hidden rounded-[2px] border border-rule lg:order-1 lg:aspect-auto lg:min-h-[380px]">
            <Image
              src="/images/identity-office.jpg"
              alt="Light, modern office interior with meeting space"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <SectionHeading
                title="A valuation firm first, an agency second"
                lead="Most people meet us through a bank. An offer depends on a figure, the figure depends on a valuer, and the valuer has to be one the lender recognises. That is the work we have built for fifteen years."
              />
            </Reveal>
            <dl className="mt-7">
              {reasons.map((reason, index) => (
                <Reveal as="div" key={reason.title} delay={index * 90}>
                  <div className="border-t border-rule py-4">
                    <dt className="font-display text-[1.0625rem] text-green">{reason.title}</dt>
                    <dd className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
                      {reason.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
            <div className="mt-7">
              <Button href="/about" variant="quiet">
                More about CMT Realtors
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Five kinds of property, five kinds of question"
              lead="What a warehouse is worth and what a coffee farm is worth are not the same enquiry. Pick the one you are dealing with."
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={index * 70} className="flex">
                <CategoryCard
                  category={category}
                  count={listingsByCategory(category.slug).length}
                  className="w-full"
                />
              </Reveal>
            ))}
            {/* Sixth cell: the visitors who do not know which class their property is. */}
            <Reveal as="li" delay={350} className="flex">
              <div className="flex min-h-[190px] w-full flex-col justify-between rounded-[2px] border border-green/25 bg-paper p-5">
                <div>
                  <h3 className="text-[1.375rem] text-green">Not sure which it is?</h3>
                  <p className="mt-2.5 max-w-[32ch] text-[0.9375rem] leading-relaxed text-muted">
                    Mixed-use buildings, farmland with a house on it, a plot with an
                    unfinished structure: the class affects the figure. Describe it and a
                    valuer will tell you.
                  </p>
                </div>
                <div className="mt-5">
                  <Button href="/contact?subject=valuation" variant="outline" size="sm">
                    Ask a valuer
                  </Button>
                </div>
              </div>
            </Reveal>
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-green py-14 text-cream lg:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              onDark
              title="What we are usually asked to do"
              lead="Four kinds of instruction cover most of our work. Each starts with an inspection and ends with something in writing."
              action={
                <Button href="/services" variant="onDark" size="md">
                  All services
                </Button>
              }
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 80} className="flex">
                <div className="flex w-full flex-col border border-cream/20 p-5 transition-colors duration-300 hover:border-gold/60">
                  <h3 className="text-[1.125rem] text-cream">{service.name}</h3>
                  <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-cream/80">
                    {service.summary}
                  </p>
                  <Link
                    href={service.cta.href}
                    className="mt-4 self-start text-[0.875rem] text-gold underline decoration-gold/50 decoration-2 underline-offset-4 hover:decoration-gold"
                  >
                    {service.cta.label}
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Clients: one belt here, the categorised belts live on /clients. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Who instructs us"
              lead="Institutions send repeat work to valuers whose reports survive their own review. These are ours."
              action={
                <Button href="/clients" variant="outline" size="md">
                  Our clients in full
                </Button>
              }
            />
          </Reveal>
        </Container>
        <Reveal className="mt-9">
          <PartnerConveyor partners={allPartners} label="CMT Realtors clients" />
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title={'In our clients’ words'}
              lead="References from the institutions we work for, named and with their permission."
            />
          </Reveal>
          <Reveal className="mt-8" delay={80}>
            {testimonials.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <li key={testimonial.name} className="flex">
                    <TestimonialCard testimonial={testimonial} />
                  </li>
                ))}
              </ul>
            ) : (
              <TestimonialsPending />
            )}
          </Reveal>
        </Container>
      </section>

      {/* Market insights: a slim band, not a section. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 rounded-[2px] border border-rule bg-paper p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div>
                <span aria-hidden="true" className="mb-4 block h-[3px] w-10 bg-gold" />
                <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] text-green">
                  Market notes, starting soon
                </h2>
                <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
                  Short quarterly notes on what we are actually seeing: where prices moved,
                  what banks are lending against, and which corridors are absorbing new
                  stock. The first issue is being written now.
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/contact?subject=general" variant="primary" size="md">
                  Ask for the first issue
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTABanner
        title="Start with the figure, not the guess"
        lead="Book an inspection, or send us the property you want listed. Either way you speak to a valuer, not a call centre."
        primary={{ label: 'Request a valuation', href: '/contact?subject=valuation' }}
        secondary={{ label: 'List your property', href: '/contact?subject=listing' }}
        image="/images/cta-skyline.jpg"
        imageAlt=""
      />
    </>
  );
}
