import Image from 'next/image';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { FactStrip } from '@/components/FactStrip';
import { CategoryCard } from '@/components/CategoryCard';
import { HeroSearchTabs } from '@/components/HeroSearchTabs';
import { InBrief } from '@/components/InBrief';
import { PartnerConveyor } from '@/components/PartnerConveyor';
import { ProcessSteps } from '@/components/ProcessSteps';
import { HeroReport } from '@/components/home/HeroReport';
import { PurposeIcon } from '@/components/valuations/PurposeIcon';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Testimonials } from '@/components/TestimonialCard';
import { FeaturedCarousel } from '@/components/property/FeaturedCarousel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories } from '@/data/categories';
import { citiesOf } from '@/data/listings';
import { clientCount } from '@/data/clients';
import { advisoryServices } from '@/data/advisory';
import { featuredPurposes, purposeBySlug } from '@/data/valuations';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';
import { getListings, getPartners, getTestimonials } from '@/lib/content';
import { numberWord } from '@/lib/format';

/**
 * Homepage, in the client's hero design (Hero.html, October 2026).
 *
 * The hero and the four facts under it are that design, built to its measurements: an ink
 * headline with its last words underlined in gold, the lead, the dark pill with the gold arrow
 * disc and the outlined pill, a line in the display serif, and on the right a sample valuation
 * report on a sage plate with a gold disc behind its corner. No photograph and no background
 * drawing: the paper is the ground.
 *
 * Every section after it speaks the same language, so the page reads as one design rather than
 * a new hero on an old site. Four rules carry it:
 *
 *   ONE GROUND. The whole page sits on the design's paper (#F7F5EE). Sections are told apart by
 *   what sits on the paper (white cards, sage plates, one ink plate), not by alternating bands.
 *   ROUNDS. Cards take --radius-card (32px), plates --radius-plate (40px), every button and tab
 *   is a pill, and numbered markers are discs.
 *   THE GOLD RULE. Each section opens with the design's eyebrow: a 40px gold rule and a short
 *   uppercase line in moss, over a Fraunces heading.
 *   ONE DARK PLATE. Advisory is the single ink panel on the page, inset on the paper with rounded
 *   corners rather than a full-width slab, so the page stays light from top to footer.
 *
 * The order is the argument: the claim, the counter (what you came to do), who we are, what we
 * are asked to do, how a valuation runs, advice, then the agency work, then who instructs us.
 */

/* The four facts under the hero, exactly as Hero.html sets them: one number, then three words. */
const facts = [
  { title: '16+', body: 'Years of valuations' },
  { title: 'Market evidence', body: 'Not hunches. Every figure is built to hold up.' },
  { title: 'Regulated', body: site.regulator },
  { title: 'Trusted', body: 'By banks, public bodies and companies' },
];

const reasons = [
  {
    title: 'Registered, and answerable for the figure',
    body: `Our valuers are registered with the ${site.regulator}. Every report carries a name, and a person who answers for it.`,
  },
  {
    title: 'Already on the panel',
    body: `${clientCount} banks, public bodies and companies have put us on their valuation panels, and our reports have passed their checks for sixteen years.`,
  },
  {
    title: 'Evidence before opinion',
    body: 'Every figure starts from what similar property has actually sold or let for, and the report shows you that evidence.',
  },
];

export default async function HomePage() {
  const [listings, partners, testimonials] = await Promise.all([
    getListings(),
    getPartners(),
    getTestimonials(),
  ]);
  const featured = listings.filter((listing) => listing.featured).slice(0, 5);
  const cityCount = citiesOf(listings).length;

  return (
    <>
      {/* HERO, as Hero.html. Grid 1.12fr / 0.88fr with a 72px gutter; one column below 960px.
          overflow-x-clip: on a phone the card's sage plate and gold disc reach past the 20px
          gutter to the screen edge, as in the design, and must not make the page scroll sideways. */}
      <section className="relative overflow-x-clip">
        <Container>
          <div className="grid items-center gap-14 pt-8 pb-14 min-[961px]:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] min-[961px]:gap-[72px] min-[961px]:pt-14 min-[961px]:pb-[72px]">
            <div className="hero-rise">
              <p className="mb-[22px] flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
                <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
                Property valuation &amp; advisory · Uganda
              </p>
              {/* Plain wrapping, not the site-wide balance: the design breaks after "lend". */}
              <h1 className="text-display text-green [text-wrap:wrap]">
                16+ years of valuations that Uganda&rsquo;s banks{' '}
                <span className="bg-[linear-gradient(transparent_64%,var(--color-gold)_64%_90%,transparent_90%)] box-decoration-clone">
                  lend against
                </span>
              </h1>
              <p className="mt-[26px] max-w-[520px] text-hero-lead leading-[1.6] text-prose">
                When a bank, a public body or a company needs a figure that holds up, they come to
                us. We work from market evidence, not hunches.
              </p>
              <div className="mt-[38px] flex flex-wrap gap-3.5">
                <Button href="/contact/request-a-valuation" size="lg" arrow>
                  Request a valuation
                </Button>
                <Button href="/listings" variant="outline" size="lg">
                  Browse properties
                </Button>
              </div>
              <p className="mt-10 flex max-w-[520px] items-center gap-3.5 font-display text-[21px] leading-[1.35] text-moss [text-wrap:wrap]">
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
                Every great build starts with a number you can stand on.
              </p>
            </div>

            <HeroReport className="hero-fade-in max-w-none justify-self-stretch min-[961px]:max-w-[460px] min-[961px]:justify-self-end" />
          </div>

          {/* The four facts. Four across, two across below 960px. */}
          <FactStrip facts={facts} />
        </Container>
      </section>

      {/* THE COUNTER: the three jobs a visitor came to do, on a white card. */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="rounded-(--radius-card) border border-green/8 bg-white shadow-[0_28px_56px_-28px_rgba(15,42,26,0.18)]">
            <HeroSearchTabs cities={citiesOf(listings)} />
          </div>
        </Container>
      </section>

      {/* WHO WE ARE. The photograph on a sage plate with the gold disc: the hero card's setting. */}
      <section className="overflow-x-clip pb-16 lg:pb-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div
              aria-hidden="true"
              className="absolute inset-[22px_-22px_-22px_22px] rounded-(--radius-plate) bg-sage"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 h-16 w-16 rounded-full bg-gold"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius-card)">
              {/* Licensed stock (public/images/CREDITS.md); the alt does not claim the person is
                  a CMT valuer. Cropped high so the face and the pen stay in frame. */}
              <Image
                src="/images/services/lending.jpg"
                alt="A professional reading and signing a report at a meeting"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <SectionHeading
                eyebrow="Who we are"
                title="A valuation firm first, an agency second"
                lead="Most people meet us through their bank. A loan depends on a figure, the figure depends on a valuer, and the valuer has to be one the lender trusts. That is the work we have spent sixteen years building."
                leadShort="A loan depends on a figure, and the figure on a valuer the lender trusts."
              />
            </Reveal>
            <dl className="mt-8 grid gap-3">
              {reasons.map((reason, index) => (
                <Reveal as="div" key={reason.title} delay={index * 90}>
                  <div className="flex gap-4 rounded-[20px] border border-green/8 bg-white p-5">
                    <span
                      aria-hidden="true"
                      className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft font-display text-[15px] font-semibold text-green"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <dt className="font-display text-lead font-semibold text-green">
                        {reason.title}
                      </dt>
                      <dd className="mt-1 text-small leading-relaxed text-muted max-sm:hidden">
                        {reason.body}
                      </dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
            <div className="mt-8">
              <Button href="/about" variant="outline">
                More about CMT Realtors
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* WHAT WE ARE ASKED TO DO. Three white cards, each with its mark in a sage disc. */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Valuations"
              title="What we are usually asked to do"
              lead="Most of our work starts with one of these three. Each calls for a different basis of value, which changes the figure, so we agree it with you before anyone visits the property."
              leadShort="Most of our work starts with one of these three."
              action={
                <Button href="/valuations" variant="outline">
                  All valuation services
                </Button>
              }
            />
          </Reveal>
          {/* A rail below sm (see "THE MOBILE SYSTEM" in globals.css). */}
          <ul className="rail mt-10 sm:grid sm:grid-cols-3 sm:gap-5">
            {featuredPurposes.map((slug, index) => {
              const purpose = purposeBySlug[slug];
              // "5–8 working days" splits into a figure and its unit; a phrase stays a phrase.
              const timing = purpose.turnaround.match(/^([\d–-]+)\s+(.+)$/);
              return (
                <Reveal as="li" key={slug} delay={index * 80} className="flex">
                  <Link
                    href={`/valuations/${purpose.slug}`}
                    className="group flex w-full flex-col rounded-(--radius-card) border border-green/8 bg-white p-7 transition-shadow duration-300 hover:shadow-[0_28px_56px_-24px_rgba(15,42,26,0.25)]"
                  >
                    <span className="flex min-h-[3.25rem] items-start justify-between gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-green transition-colors group-hover:bg-green group-hover:text-gold">
                        <PurposeIcon slug={slug} width={22} height={22} />
                      </span>
                      <span className="text-right">
                        {timing ? (
                          <>
                            <span className="tnum block font-display text-figure leading-none font-semibold text-green">
                              {timing[1]}
                            </span>
                            <span className="mt-1 block text-[12.5px] text-muted">{timing[2]}</span>
                          </>
                        ) : (
                          <span className="block max-w-[14ch] text-[12.5px] text-muted">
                            {purpose.turnaround}
                          </span>
                        )}
                      </span>
                    </span>
                    <h3 className="mt-7 font-display text-h4 font-semibold text-green">
                      {purpose.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-small leading-relaxed text-muted">
                      {purpose.situation}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-green">
                      What this involves
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold transition-transform group-hover:translate-x-0.5">
                        <ArrowRightIcon width={14} height={14} />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* HOW IT RUNS. Four steps on one sage plate (ProcessSteps, shared with /valuations). */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <ProcessSteps />
        </Container>
      </section>

      {/* ADVICE. The page's one ink plate, inset and rounded rather than a full-width slab. */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-(--radius-plate) bg-green px-6 py-12 text-white min-[601px]:px-12 lg:py-16">
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/90"
            />
            <div className="relative">
              <Reveal>
                <SectionHeading
                  onDark
                  eyebrow="Advisory"
                  title="Advice before you commit"
                  lead="Beyond the valuation: what a site can hold, what to pay for it, and how to run it once it is yours. Every job is scoped and priced in writing before it starts."
                  leadShort="What a site can hold, what to pay for it, and how to run it."
                  action={
                    <Button href="/advisory" variant="onDark">
                      All advisory work
                    </Button>
                  }
                />
              </Reveal>
              <ol className="mt-10 grid gap-3 lg:grid-cols-2">
                {advisoryServices.slice(0, 4).map((service, index) => (
                  <Reveal as="li" key={service.slug} delay={index * 80}>
                    <Link
                      href={`/advisory#${service.slug}`}
                      className="group flex items-center gap-4 rounded-[20px] border border-white/12 bg-white/[0.04] p-5 transition-colors hover:border-gold/60 hover:bg-white/[0.07]"
                    >
                      <span className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 font-display text-[15px] font-semibold text-gold max-sm:hidden">
                        {index + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-h4 font-semibold text-white">
                          {service.name}
                        </span>
                        <span className="mt-1 block text-[13px] text-white/70">
                          {service.audience}
                        </span>
                      </span>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-green transition-transform group-hover:translate-x-0.5">
                        <ArrowRightIcon width={16} height={16} />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* THE AGENCY BLOCK: property types, then the featured stock that illustrates them. */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Properties"
              title="Five kinds of property, five kinds of question"
              lead="Valuing a warehouse and valuing a coffee farm are different jobs. Start with the kind of property you have."
              leadShort="Start with the kind of property you have."
            />
          </Reveal>
          <ul className="rail mt-10 sm:grid sm:auto-rows-fr sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={index * 70} className="flex">
                <CategoryCard
                  category={category}
                  count={listings.filter((listing) => listing.category === category.slug).length}
                  className="w-full"
                />
              </Reveal>
            ))}
            {/* Sixth cell: the visitors who do not know which class their property is. */}
            <Reveal as="li" delay={350} className="flex">
              <div className="flex min-h-[190px] w-full flex-col justify-between rounded-brand border border-green/8 bg-white p-6">
                <div>
                  <h3 className="font-display text-h3 font-semibold text-green">
                    Not sure which it is?
                  </h3>
                  <p className="mt-2.5 max-w-[32ch] text-small leading-relaxed text-muted">
                    Shops with flats above, a farm with a house on it, a half-built plot. The type
                    changes the figure, so describe yours and a valuer will tell you.
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

      {/* Featured stock, inset in a rounded plate rather than run edge to edge. */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="overflow-hidden rounded-(--radius-plate)">
            <FeaturedCarousel listings={featured} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 px-1">
            <p className="text-small text-muted">
              Showing {featured.length} of the{' '}
              <span className="tnum font-semibold text-green">{listings.length}</span> properties we
              are handling right now, across {numberWord(categories.length)} property types and{' '}
              {numberWord(cityCount)} cities.
            </p>
            <Button href="/listings" variant="outline" size="sm">
              Browse every property
            </Button>
          </div>
        </Container>
      </section>

      {/* Who instructs us: the logo belt, then CMT in brief (or real references, once given). */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Clients"
              title="Who instructs us"
              lead="Banks and institutions keep coming back to valuers whose reports hold up to their own checks. These are some of ours."
              leadShort="The banks and institutions that keep coming back."
              action={
                <Button href="/about/clients" variant="outline">
                  Our clients in full
                </Button>
              }
            />
          </Reveal>
        </Container>
        <Reveal className="mt-10">
          <PartnerConveyor partners={partners} label="CMT Realtors clients" />
        </Reveal>
        {/* Desktop only while it holds the four "in brief" statements, which repeat the hero on a
            phone. Real testimonials, once they exist, show everywhere. */}
        <Container className={cx('mt-14', testimonials.length === 0 && 'max-sm:hidden')}>
          <Reveal>
            <h3 className="font-display text-h3 font-semibold text-green">
              {testimonials.length > 0 ? 'In their words' : `${site.shortName} in brief`}
            </h3>
          </Reveal>
          <Reveal className="mt-6">
            {testimonials.length > 0 ? (
              <Testimonials testimonials={testimonials.slice(0, 3)} partners={partners} />
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
      />
    </>
  );
}
