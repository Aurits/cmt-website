import Image from 'next/image';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { AnimatedStatValue } from '@/components/AnimatedStatValue';
import { CategoryCard } from '@/components/CategoryCard';
import { HeroSearchTabs } from '@/components/HeroSearchTabs';
import { InBrief } from '@/components/InBrief';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { HeroDatum, HeroSheet, HeroSkyline } from '@/components/home/HeroElevation';
import { ProcessDatum } from '@/components/home/ProcessDatum';
import { PurposeIcon } from '@/components/valuations/PurposeIcon';
import { ChevronIcon } from '@/components/ui/icons';
import { Testimonials } from '@/components/TestimonialCard';
import { FeaturedCarousel } from '@/components/property/FeaturedCarousel';
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
import { site, stats } from '@/data/site';
import { testimonials } from '@/data/testimonials';

/**
 * Homepage.
 *
 * Section order follows the brief. Each section is kept to the shortest form that still
 * does its job, because the whole page has to be scrollable on a phone on mobile data:
 * the featured stock is a single full-bleed carousel rather than a grid, the client list
 * is one belt (the categorised belts live on /about/clients), and the identity section carries
 * three claims rather than four.
 *
 * THE GROUND UNDER EACH SECTION IS CHOSEN, NOT INHERITED. See the ground ladder in
 * globals.css. Every section below states its own background even where that background is
 * the body default, because a section that sets none is not making a decision, it is
 * accepting cream — and that is how eight of these ended up on the same tan field with three
 * green slabs dropped in. Reading down the page, the grounds run:
 *
 *   paper · cream · mist · paper · green · cream · green · mist · cream · green
 *
 * No two neighbours share one, green appears three times and never consecutively, and paper
 * carries the hero and the two sections that are mostly reading. Three constraints shape the
 * order and each is easy to break by accident: a section whose cards are bg-paper cannot itself
 * be paper or the cards vanish (which rules paper out for the categories and the valuation
 * purposes), the carousel is immovably green so whatever sits either side of it cannot be, and
 * the hero is paper because the green oval in it needs the brightest ground on the site to read
 * as a shape rather than as a smudge.
 */
const reasons = [
  {
    title: 'Regulated, and answerable for the figure',
    body: `Our valuers are regulated by the ${site.regulator}. Every report carries a name, and a person who answers for it.`,
  },
  {
    title: 'Already on the panel',
    body: `${partnerCount} institutions already instruct us, most of them again and again, and our reports have passed their own checks for sixteen years.`,
  },
  {
    title: 'Evidence before opinion',
    body: 'Every figure starts from what similar property has actually sold or let for, and the report shows you that evidence.',
  },
];

export default function HomePage() {
  const featured = featuredListings.slice(0, 5);

  return (
    <>
      {/*
        HERO.

        The fifth version of this slot, and the first that is not a split hero. The earlier four
        all put words on the left and a picture on the right, which is how every property site
        in this market opens, and four of them used photographs of buildings CMT has never
        valued.

        IT IS ORGANISED BY A DATUM, the way a survey drawing is. One gold ground line runs the
        full width of the viewport, edge to edge, and everything in the hero is placed relative
        to it. Above the line: the claim, set directly over the building it is about, which
        rises behind the words from the ground line up. Below the line: the evidence, meaning the
        ledger and the counter. The reader moves
        down through it in the order someone decides in (what is claimed, what it is about, what
        it rests on, what to do next) and the ground line is the hinge between the claim and
        the proof.

        ON WHITE, as a drawing sheet: everything above the ground line sits on a faint drafting
        grid (HeroSheet) that is strongest around the building and dissolves toward the edges.
        An oval sat there for one iteration and was removed; it gave the upper half presence but
        had no reason to exist, where the grid is what a survey is actually drawn on.

        THE DRAWING IS THE BACKGROUND OF THE WORDS, not a row beneath them. The first screen is
        one layered composition, back to front: the drafting grid, the blurred city and the
        building rising from the bottom edge, a soft white halo, then the claim. The halo is what
        makes that legible rather than decorative: the tower is dark glass, green type over dark
        glass is unreadable, and a paper-coloured radial wash behind the words lets the top of
        the building dissolve into them, the way a building fades into haze. The ground line sits
        exactly at the foot of the first screen, and the evidence starts just below it.

        On a phone the same order holds, with the skyline cropping its neighbours rather than
        shrinking its subject.
      */}
      <section className="relative isolate overflow-hidden bg-paper">
        <div className="flex flex-col">
          {/* The first screen: everything above the ground line, sized so the line lands on the
              fold (less the 15px the datum itself takes). The grid, the street and the halo are
              layered behind the claim in that order; the -z-10 layers stack in DOM order inside
              this isolated block, so the halo always sits over the building and under the words. */}
          <div className="relative isolate flex min-h-[calc(100dvh_-_var(--header-h)_-_var(--mobile-cta-h)_-_15px)] flex-col lg:min-h-[calc(100dvh_-_var(--header-h)_-_15px)]">
            <HeroSheet />
            {/* 260px on a phone, where it stands under the words rather than behind them (see the
                bottom padding on the claim below); from sm up it grows to rise behind them. The
                height is the smaller of 58vh and 44vw: on screen height alone, a tall portrait
                tablet drew the tower 330px wide and cropped the ±0.00 mark off the left edge. */}
            <HeroSkyline className="absolute inset-x-0 bottom-0 -z-10 h-[260px] sm:h-[clamp(300px,min(58vh,44vw),640px)]" />
            {/* Solid paper at its core, so nothing in the drawing (the height line included) runs
                through a line of text; the building emerges from it just below the buttons. */}
            <span aria-hidden="true" className="hero-halo pointer-events-none absolute inset-0 -z-10" />
          {/* Above the line: the claim, over the building. */}
          {/* pb-[250px] on a phone: a tall, narrow column cannot carry green type over dark glass
              and stay legible, so there the building stands just below the buttons instead of
              behind them. From sm up the column is wide enough for the halo to clear the words. */}
          <Container className="flex flex-1 flex-col items-center pt-14 pb-[250px] text-center sm:pb-10 lg:pt-20">
            <div className="hero-rise flex flex-col items-center">
              <span aria-hidden="true" className="block h-[3px] w-12 bg-gold" />
              <h1 className="mt-6 max-w-[24ch] text-balance text-display text-green">
                <AnimatedHeadline text="16+ years of valuations that Uganda’s banks lend against" />
              </h1>
              <p className="mt-6 max-w-[56ch] text-lead leading-relaxed text-muted sm:text-h4">
                When a bank, a public body or a company needs a figure that holds up, they come
                to us. We work from market evidence, not hunches.
              </p>
              {/* Valuation leads. The masthead CTA, the nav order and the page title all say
                  valuation first and agency second, and the hero is the surface that sets
                  that expectation for every one of them. */}
              {/* On a phone the pair stacks at one shared width, rather than each shrinking to
                  its own label and leaving two ragged buttons centred on top of each other. */}
              <div className="mt-8 grid w-full max-w-[22rem] gap-3 sm:flex sm:w-auto sm:max-w-none sm:justify-center">
                <Button href="/contact/request-a-valuation" variant="primary" size="lg" className="w-full sm:w-auto">
                  Request a valuation
                </Button>
                {/* Filled with paper, so it stays legible wherever the drawing sits behind it. */}
                <Button href="/listings" variant="outline" size="lg" className="w-full bg-paper sm:w-auto">
                  Browse properties
                </Button>
              </div>
              {/* Renders nothing until a registration is confirmed, see docs/OPEN-ITEMS.md #1. */}
              <CredentialLine className="justify-center" />
            </div>
          </Container>

          </div>
          {/* On the line: the ground the building stands on. Full bleed. */}
          <HeroDatum />

          {/* Below the line: the evidence. */}
          <Container className="pt-8 pb-8 lg:pt-10 lg:pb-12">
            {/*
              Four facts, each checkable, set as a ledger with the figure over its own caption:
              the row the reference sites use for "3200+ properties sold", except these count
              years, offices, institutions and the regulator, because those are the four things
              someone deciding whether to trust a valuation actually weighs.
            */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={index > 0 ? 'sm:border-l sm:border-rule sm:pl-6' : undefined}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="flex items-baseline gap-1.5">
                      <span className="tnum font-display text-figure leading-none text-gold-deep">
                        <AnimatedStatValue value={stat.value} />
                      </span>
                      <span className="text-micro text-muted">{stat.unit}</span>
                    </span>
                    <span className="mt-2 block max-w-[26ch] text-micro leading-snug text-pretty text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* The counter: the three jobs a visitor came to do, closing the hero. */}
            <div className="mt-8 rounded-brand border border-rule border-t-2 border-t-gold bg-paper lg:mt-10">
              <HeroSearchTabs />
            </div>
          </Container>
        </div>
      </section>

      {/*
        THE ORDER BELOW IS THE ARGUMENT. The hero says valuation first and agency second, and the
        page used to contradict it within one scroll: straight from the hero into a carousel of
        property for sale, then back to valuation, then property types, then valuation again. It
        now argues one way. First the firm (identity), then what it is asked to do (purposes),
        then how it does it (process), then the advice around it (advisory). Only then the
        agency work, as one block (property types, then the featured stock that illustrates
        them), and finally who instructs us.
      */}

      {/* Identity. The thesis, directly under the claim it explains. */}
      <section className="bg-cream py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 aspect-[4/3] overflow-hidden rounded-brand border border-rule lg:order-1 lg:aspect-auto lg:min-h-[380px]">
            {/* Abstract architectural texture beside a block of text, which is what this
                photograph honestly is. See public/images/CREDITS.md. */}
            <Image
              src="/images/hero-home.jpg"
              alt="Ribbon-like apartment balconies curving across a facade"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <SectionHeading
                title="A valuation firm first, an agency second"
                lead="Most people meet us through their bank. A loan depends on a figure, the figure depends on a valuer, and the valuer has to be one the lender trusts. That is the work we have spent sixteen years building."
              />
            </Reveal>
            {/* Numbered as a ledger: three claims, each one checkable, in the order a lender
                weighs them. */}
            <dl className="mt-7">
              {reasons.map((reason, index) => (
                <Reveal as="div" key={reason.title} delay={index * 90}>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-rule py-4">
                    <span
                      aria-hidden="true"
                      className="tnum pt-0.5 font-display text-lead leading-none text-gold-deep"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <dt className="font-display text-lead text-green">{reason.title}</dt>
                      <dd className="mt-1.5 max-w-[60ch] text-body leading-relaxed text-muted">
                        {reason.body}
                      </dd>
                    </div>
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

      {/* The three reasons people instruct us most, routing into the /valuations matrix. */}
      <section className="bg-mist py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="What we are usually asked to do"
              lead="Most of our work starts with one of these three. Each calls for a different basis of value, which changes the figure, so we agree it with you before anyone visits the property."
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
              /* The turnaround is the fact people decide on, so it leads each card as a
                 figure. "5–8 working days" splits into the numerals and their unit; "Scoped
                 per instruction" has no numerals and is set as a phrase, which is the honest
                 answer for compensation work rather than an invented range. */
              const timing = purpose.turnaround.match(/^([\d\u2013-]+)\s+(.+)$/);
              return (
                <Reveal as="li" key={slug} delay={index * 80} className="flex">
                  <Link
                    href={`/valuations/${purpose.slug}`}
                    className="group flex w-full flex-col border border-rule border-t-2 border-t-gold bg-paper p-6 transition-colors duration-300 hover:border-green/40 hover:border-t-gold"
                  >
                    {/* Fixed height, so the title below starts on the same line in every card
                        whether the corner holds a figure and its unit or a one-line phrase. */}
                    <span className="flex min-h-[3.25rem] items-start justify-between gap-4">
                      <PurposeIcon
                        slug={slug}
                        width={30}
                        height={30}
                        className="text-green transition-colors group-hover:text-gold-deep"
                      />
                      <span className="text-right">
                        {timing ? (
                          <>
                            <span className="tnum block font-display text-figure leading-none text-gold-deep">
                              {timing[1]}
                            </span>
                            <span className="mt-1 block text-micro text-muted">{timing[2]}</span>
                          </>
                        ) : (
                          <span className="block max-w-[14ch] text-micro text-muted">
                            {purpose.turnaround}
                          </span>
                        )}
                      </span>
                    </span>
                    <h3 className="mt-6 font-display text-h4 text-green group-hover:text-gold-deep">
                      {purpose.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-body leading-relaxed text-muted">
                      {purpose.situation}
                    </p>
                    <span className="mt-5 flex items-center gap-1 text-body font-medium text-green">
                      <span className="underline decoration-gold decoration-2 underline-offset-4">
                        What this involves
                      </span>
                      <ChevronIcon
                        width={14}
                        height={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* How it runs. The one question the page never answered. */}
      <section className="bg-paper py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="From instruction to signed report"
              lead="Four steps. We tell you at the start which of them could affect your deadline."
            />
          </Reveal>
          <Reveal className="mt-2">
            <ProcessDatum />
          </Reveal>
        </Container>
      </section>

      {/* Advisory. A ruled index rather than four boxes: src/data/advisory.ts says these are
          "scoped, priced and negotiated, not bought off a card", and the homepage was setting
          them as cards. Each row names who it is for before what it is, as /advisory does. */}
      <section className="bg-green py-14 text-cream lg:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              onDark
              title="Advice before you commit"
              lead="Beyond the valuation: what a site can hold, what to pay for it, and how to run it once it is yours. Every job is scoped and priced in writing before it starts."
              action={
                <Button href="/advisory" variant="onDark" size="md">
                  All advisory work
                </Button>
              }
            />
          </Reveal>
          <ol className="mt-9 grid gap-x-12 lg:grid-cols-2">
            {advisoryServices.slice(0, 4).map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 80}>
                <Link
                  href={`/advisory#${service.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 border-t border-cream/20 py-5 transition-colors hover:border-gold/60"
                >
                  <span className="tnum font-display text-lead text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-h4 text-cream transition-colors group-hover:text-gold">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-micro text-cream/70">{service.audience}</span>
                  </span>
                  <ChevronIcon
                    width={18}
                    height={18}
                    className="self-center text-gold transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* THE AGENCY BLOCK: property types, then the featured stock that illustrates them. */}

      {/* Categories. Cream, because every card in the grid is paper and needs a ground to
          sit forward of. */}
      <section className="bg-cream py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Five kinds of property, five kinds of question"
              lead="Valuing a warehouse and valuing a coffee farm are different jobs. Start with the kind of property you have."
            />
          </Reveal>
          {/* auto-rows-fr: every row takes the height of the tallest card, so the two rows
              match instead of the "not sure" card stretching only its own. */}
          <ul className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="text-h3 text-green">Not sure which it is?</h3>
                  <p className="mt-2.5 max-w-[32ch] text-body leading-relaxed text-muted">
                    Shops with flats above, a farm with a house on it, a half-built plot. The
                    type changes the figure, so describe yours and a valuer will tell you.
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

      {/* Featured stock, full width. The immersive moment of the page. */}
      <FeaturedCarousel listings={featured} />

      {/* The carousel's caption, and recessed so it reads as attached to the band above it
          rather than as the start of the next section. */}
      <section className="border-b border-rule bg-mist py-4">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-body text-muted">
            Showing {featured.length} of the{' '}
            <span className="tnum font-medium text-ink">{listings.length}</span> properties we
            are handling right now, across five property types and four cities.
          </p>
          <Button href="/listings" variant="quiet" size="sm">
            Browse every property
          </Button>
        </Container>
      </section>

      {/* Clients: one belt here, the categorised belts live on /about/clients. Cream, and it
          has to be: the conveyor's greyscale veils are tinted to a cream ground. */}
      <section className="bg-cream py-12 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              title="Who instructs us"
              lead="Banks and institutions keep coming back to valuers whose reports hold up to their own checks. These are some of ours."
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
        {/*
          What the belt's clients say, once they have said it on the record. Until then the
          slot carries four plain statements about the firm instead: CMT speaking for itself,
          under its own heading, never set as a quote.
        */}
        <Container className="mt-12">
          <Reveal>
            <h3 className="font-display text-h3 text-green">
              {testimonials.length > 0 ? 'In their words' : `${site.shortName} in brief`}
            </h3>
          </Reveal>
          <Reveal className="mt-6">
            {testimonials.length > 0 ? (
              <Testimonials testimonials={testimonials.slice(0, 3)} />
            ) : (
              <InBrief />
            )}
          </Reveal>
        </Container>
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
