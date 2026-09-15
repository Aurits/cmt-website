import Image from 'next/image';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { CategoryCard } from '@/components/CategoryCard';
import { HeroSearchTabs } from '@/components/HeroSearchTabs';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { StatsStrip } from '@/components/StatsStrip';
import { FeaturedCarousel } from '@/components/property/FeaturedCarousel';
import { HeroVideo } from '@/components/HeroVideo';
import { CredentialLine } from '@/components/about/StandingSchedule';
import { AnimatedHeadline } from '@/components/ui/AnimatedHeadline';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories } from '@/data/categories';
import { featuredListings, listings, listingsByCategory } from '@/data/listings';
import { allPartners, partnerCount } from '@/data/partners';
import { advisoryServices } from '@/data/advisory';
import { featuredPurposes, purposeBySlug } from '@/data/valuations';
import { site } from '@/data/site';

/**
 * Homepage.
 *
 * Section order follows the brief. Each section is kept to the shortest form that still
 * does its job, because the whole page has to be scrollable on a phone on mobile data:
 * the featured stock is a single full-bleed carousel rather than a grid, the client list
 * is one belt (the categorised belts live on /about/clients), and the identity section carries
 * three claims rather than four.
 */
const reasons = [
  {
    title: 'Regulated, and answerable for the figure',
    body: `Our valuers work under the ${site.regulator}, so a CMT report carries a name and a professional standard behind it.`,
  },
  {
    title: 'Already on the panel',
    body: `${partnerCount} institutions instruct us, most of them repeatedly — the work has stood up to their own review for over sixteen years.`,
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
      {/* Hero: identity first, product second — the nav order makes the same argument,
          and the text stays first in document order so that holds on mobile too. The
          photograph (now a looping video of the same building — see HeroVideo, which
          falls back to the still photograph for anyone who shouldn't get the video) is
          full-bleed at every width, edge to edge with no card, no rounding and no side
          margin — the one deliberate break from the page's 1200px measure — and the whole
          band is sized to `--header-h` (globals.css) so it fills exactly what's left of
          the first screen below the sticky masthead: no cream gap before the fold, on a
          phone or a desktop monitor. flex-col stacks text over a bottom-anchored
          photograph on a phone; flex-row at lg runs the photograph floor-to-ceiling on
          the right, both simply children stretched or grown to fill a height that is
          never guessed at, only ever computed. */}
      <section className="relative overflow-hidden bg-cream">
        <div className="flex min-h-[calc(100dvh_-_var(--header-h)_-_var(--mobile-cta-h))] flex-col lg:min-h-[calc(100dvh_-_var(--header-h))] lg:flex-row lg:items-stretch">
          <Container className="relative z-10 shrink-0 py-8 lg:w-[46%] lg:shrink-0 lg:self-center lg:py-16">
            <div className="hero-rise">
              <h1 className="text-display text-green">
                <AnimatedHeadline text="16+ years of valuations Uganda’s banks lend against" />
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
                <Button href="/contact/request-a-valuation" variant="outline" size="lg">
                  Request a valuation
                </Button>
              </div>
              {/* Renders nothing until a registration is confirmed — see OPEN-ITEMS.md #1. */}
              <CredentialLine />
            </div>
          </Container>

          {/* flex-1 with no basis of its own: on a phone it claims whatever height the
              text block above didn't, right down to the last pixel; at lg, stretched by
              the row's align-items, it claims that same exactness vertically and 54% of
              the width. The 240px floor is the one exception, for a short phone with the
              longer end of the text: without it flex-1 would rather shrink the photograph
              to nothing than let the (shrink-0) text clip, and the hero band simply grows
              past its target height on those screens instead — a small extra scroll, not
              a missing photograph. A mild hue-rotate carries its own warm tones toward
              the brand's gold rather than replacing them, so it stays a real photograph;
              the green wash along the foot and the fade to cream on the edge each
              breakpoint cuts (top on a phone, left at lg — so the cut always reads as
              intentional, never clipped) do the rest of the work of tying it to the page
              around it. */}
          <div className="relative min-h-[240px] flex-1 overflow-hidden lg:min-h-0 lg:w-[54%] lg:flex-none">
            <HeroVideo
              posterSrc="/images/hero-home.jpg"
              posterAlt="Wavy, ribbon-like balconies rippling down an apartment facade"
              desktopSrc="/videos/hero-loop.mp4"
              mobileSrc="/videos/hero-loop-mobile.mp4"
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
              gradeClassName="hue-rotate-[20deg] saturate-[1.25] contrast-[1.05]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-green/35 via-transparent to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 hidden bg-gradient-to-r from-cream via-transparent to-transparent lg:block"
            />
          </div>
        </div>

        {/* The counter: the three jobs a visitor came to do, closing the hero. */}
        <Container className="relative z-10 mt-8 pb-8 lg:mt-10 lg:pb-12">
          <div className="rounded-brand border border-rule border-t-2 border-t-gold">
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
          <Reveal className="relative order-2 aspect-[4/3] overflow-hidden rounded-brand border border-rule lg:order-1 lg:aspect-auto lg:min-h-[380px]">
            <Image
              src="/images/identity-office.jpg"
              alt="Kampala's business district under a clear sky"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <SectionHeading
                title="A valuation firm first, an agency second"
                lead="Most people meet us through a bank. An offer depends on a figure, the figure depends on a valuer, and the valuer has to be one the lender recognises. That is the work we have built for sixteen years."
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
              <div className="flex min-h-[190px] w-full flex-col justify-between rounded-brand border border-green/25 bg-paper p-5">
                <div>
                  <h3 className="text-[1.375rem] text-green">Not sure which it is?</h3>
                  <p className="mt-2.5 max-w-[32ch] text-[0.9375rem] leading-relaxed text-muted">
                    Mixed-use buildings, farmland with a house on it, a plot with an
                    unfinished structure: the class affects the figure. Describe it and a
                    valuer will tell you.
                  </p>
                </div>
                <div className="mt-5">
                  <Button href="/contact/request-a-valuation" variant="outline" size="sm">
                    Ask a valuer
                  </Button>
                </div>
              </div>
            </Reveal>
          </ul>
        </Container>
      </section>

      {/* The three reasons people instruct us most, routing into the /valuations matrix. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="What we are usually asked to do"
              lead="Most instructions start with one of these. Each one needs a different basis of value, and that changes the figure — so we settle it before anyone travels."
              action={
                <Button href="/valuations" variant="outline" size="md">
                  All valuation services
                </Button>
              }
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {featuredPurposes.map((slug, index) => {
              const purpose = purposeBySlug[slug];
              return (
                <Reveal as="li" key={slug} delay={index * 80} className="flex">
                  <Link
                    href={`/valuations/${purpose.slug}`}
                    className="group flex w-full flex-col border border-rule bg-paper p-5 transition-colors duration-300 hover:border-green/40"
                  >
                    <span aria-hidden="true" className="mb-4 block h-[3px] w-8 bg-gold" />
                    <h3 className="font-display text-[1.125rem] text-green group-hover:text-gold-deep">
                      {purpose.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-muted">
                      {purpose.situation}
                    </p>
                    <span className="tnum mt-4 border-t border-rule pt-3 text-[0.8125rem] text-muted">
                      {purpose.turnaround}
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-green py-14 text-cream lg:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              onDark
              title="Advice before you commit"
              lead="Beyond the report: what a site can carry, what to pay for it, and how to run it once it is yours. Every engagement is scoped in writing before it starts."
              action={
                <Button href="/advisory" variant="onDark" size="md">
                  All advisory work
                </Button>
              }
            />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {advisoryServices.slice(0, 4).map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 80} className="flex">
                <div className="flex w-full flex-col border border-cream/20 p-5 transition-colors duration-300 hover:border-gold/60">
                  <h3 className="text-[1.125rem] text-cream">{service.name}</h3>
                  <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-cream/80">
                    {service.summary}
                  </p>
                  <Link
                    href={`/advisory#${service.slug}`}
                    className="mt-4 self-start text-[0.875rem] text-gold underline decoration-gold/50 decoration-2 underline-offset-4 hover:decoration-gold"
                  >
                    What this involves
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Clients: one belt here, the categorised belts live on /about/clients. */}
      <section className="py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Who instructs us"
              lead="Institutions send repeat work to valuers whose reports survive their own review. These are ours."
              action={
                <Button href="/about/clients" variant="outline" size="md">
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

      <CTABanner
        title="Start with the figure, not the guess"
        lead="Book an inspection, or send us the property you want listed. Either way you speak to a valuer, not a call centre."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'List your property', href: '/contact/list-a-property' }}
        image="/images/cta-skyline.jpg"
        imageAlt=""
      />
    </>
  );
}
