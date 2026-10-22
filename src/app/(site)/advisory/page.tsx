import type { Metadata } from 'next';
import { listJoin } from '@/lib/format';
import { cx } from '@/lib/cx';
import Link from 'next/link';
import Image from 'next/image';
import { CTABanner } from '@/components/CTABanner';
import { Plate, Section, cardClass } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { CheckCircleIcon, ChevronDownIcon } from '@/components/ui/icons';
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
 * tripled the page height. See docs/layout-specs.md A-05.
 */
export default function AdvisoryPage() {
  return (
    <>
      <PageHeader
        title="Advice before you commit"
        lead="Everything that is not a valuation report. Each engagement is scoped in writing before it starts, so the fee and the deliverable are agreed up front rather than discovered later."
        leadShort="Everything that is not a valuation report, priced in writing before it starts."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Advisory' }]}
      />

      <Section>
        <ul className="grid gap-4">
          {advisoryServices.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 60}>
              <div
                id={service.slug}
                className={cx(
                  cardClass,
                  'scroll-mt-32 p-6 sm:p-8 md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12',
                )}
              >
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="tnum flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green font-display text-[15px] font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="font-display text-h3 leading-snug font-semibold text-green">
                      {service.name}
                    </h2>
                    <p className="mt-2 inline-block rounded-full bg-sage-soft px-3 py-1 text-[12.5px] text-moss">
                      For {service.audience.charAt(0).toLowerCase()}
                      {service.audience.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0">
                  <p className="max-w-[62ch] text-body leading-relaxed text-prose">
                    {service.summary}
                  </p>
                  {/* Desktop: the deliverables in the open. */}
                  <ul className="mt-4 max-sm:hidden">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 border-t border-hair py-2.5 text-small text-green"
                      >
                        <CheckCircleIcon
                          width={18}
                          height={18}
                          className="mt-px shrink-0 text-moss"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/*
                    Phone: folded into a native disclosure, closed by default. Open, five services'
                    deliverables were 1,000px of list. <details> needs no JavaScript and is
                    keyboard and screen reader accessible; the summary says how many are inside.
                  */}
                  <details className="group/d mt-3 border-t border-hair sm:hidden">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 text-body font-semibold text-green [&::-webkit-details-marker]:hidden">
                      What you receive ({service.deliverables.length})
                      <ChevronDownIcon
                        width={16}
                        height={16}
                        aria-hidden="true"
                        className="transition-transform group-open/d:rotate-180"
                      />
                    </summary>
                    <ul className="pb-2">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 border-t border-hair py-2.5 text-small text-green"
                        >
                          <CheckCircleIcon
                            width={18}
                            height={18}
                            className="mt-px shrink-0 text-moss"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* The one photograph on the page, beside how an engagement runs. */}
      <Section>
        <Plate>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <Reveal className="relative aspect-[3/2] overflow-hidden rounded-(--radius-card)">
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
                  eyebrow="Engagements"
                  title="How an engagement runs"
                  lead="Consultancy is not a product, so it is not priced like one."
                />
              </Reveal>
              <Reveal delay={70}>
                <dl className="mt-8 grid gap-3">
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
                    <div key={title} className="rounded-[20px] bg-white p-5">
                      <dt className="font-display text-lead font-semibold text-green">{title}</dt>
                      <dd className="mt-1 max-w-[58ch] text-small leading-relaxed text-muted">
                        {body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Plate>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Where"
            title="Where we have done this work"
            lead={`Across all five property types, in ${listJoin(site.cities)} and beyond.`}
          />
        </Reveal>
        <ul className="mt-8 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Reveal as="li" key={category.slug} delay={index * 50}>
              <Link
                href={`/listings/${category.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-green/12 bg-white/70 px-5 text-small font-medium text-green transition-colors hover:bg-white"
              >
                {category.name}
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CTABanner
        title="Request a consultation"
        lead="Bring us the property and the decision you are trying to make. We will tell you what the work involves and what it costs before it starts."
        primary={{ label: 'Request a consultation', href: '/contact' }}
        secondary={{ label: 'See our valuation work', href: '/valuations' }}
      />
    </>
  );
}
