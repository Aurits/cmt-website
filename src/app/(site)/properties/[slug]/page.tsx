import type { Metadata } from 'next';
import { cx } from '@/lib/cx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AgentCard } from '@/components/AgentCard';
import { CTABanner } from '@/components/CTABanner';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Plate, Section, cardClass } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CheckCircleIcon, PinIcon } from '@/components/ui/icons';
import { categoryBySlug } from '@/data/categories';
import { relatedListings } from '@/data/listings';
import { getListing, getListings, getTeam } from '@/lib/content';
import { listingTypeLabel, priceWithPeriod } from '@/lib/format';

export async function generateStaticParams() {
  return (await getListings()).map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return {};
  return {
    title: listing.title,
    description: listing.summary,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) notFound();

  const category = categoryBySlug[listing.category];
  // The listing's agent if they appear on the site, otherwise the office: a listing must never
  // put a name in front of a visitor that the rest of the site no longer shows.
  const [team, listings] = await Promise.all([getTeam(), getListings()]);
  const agent = team.contactFor(listing.agentId);
  const related = relatedListings(listing, listings);

  const facts = [
    { label: listing.listingType === 'rent' ? 'Rent' : 'Price', value: priceWithPeriod(listing) },
    { label: 'Property type', value: category.name },
    { label: listing.sizeLabel, value: listing.size },
    ...(listing.beds !== undefined ? [{ label: 'Bedrooms', value: String(listing.beds) }] : []),
    ...(listing.baths !== undefined ? [{ label: 'Bathrooms', value: String(listing.baths) }] : []),
    { label: 'Tenure', value: listing.tenure },
    { label: 'Location', value: `${listing.area}, ${listing.city}` },
    { label: 'Our reference', value: listing.reference },
  ];

  return (
    <>
      <section>
        <Container className="pt-8 min-[961px]:pt-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              <li>
                <Link href="/" className="hover:text-green">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-chip">
                /
              </li>
              <li>
                <Link href="/listings" className="hover:text-green">
                  Properties
                </Link>
              </li>
              <li aria-hidden="true" className="text-chip">
                /
              </li>
              <li>
                <Link href={`/listings/${category.slug}`} className="hover:text-green">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-chip">
                /
              </li>
              <li aria-current="page" className="tnum text-green">
                {listing.reference}
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="category">{category.name}</Badge>
                <Badge tone="type">{listingTypeLabel(listing)}</Badge>
              </div>
              <h1 className="mt-5 max-w-[26ch] text-h1 tracking-[-0.02em] text-balance text-green">
                {listing.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-body text-muted">
                <PinIcon width={16} height={16} className="text-moss" />
                {listing.area}, {listing.city}
              </p>
            </div>
            <p className="tnum rounded-full bg-white px-6 py-3 font-display text-h3 leading-none font-semibold text-green shadow-[0_18px_40px_-24px_rgba(15,42,26,0.4)]">
              {priceWithPeriod(listing)}
            </p>
          </div>
        </Container>
      </section>

      <Section containerClassName="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
        <div className="grid content-start gap-5">
          <PropertyGallery
            images={listing.images}
            note="Representative photography while the site is in build. CMT's own photographs of this property replace these before launch."
          />

          <div className={cx(cardClass, 'p-6 sm:p-8')}>
            <h2 className="font-display text-h3 font-semibold text-green">Key facts</h2>
            <dl className="mt-4 sm:grid sm:grid-cols-2 sm:gap-x-10">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-4 border-t border-hair py-[13px] text-small"
                >
                  <dt className="text-muted">{fact.label}</dt>
                  <dd className="tnum text-right font-semibold text-green">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={cx(cardClass, 'p-6 sm:p-8')}>
            <h2 className="font-display text-h3 font-semibold text-green">About this property</h2>
            <div className="mt-4 space-y-4 text-lead leading-relaxed text-prose">
              {listing.description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <h3 className="mt-8 font-display text-h4 font-semibold text-green">Included</h3>
            <ul className="mt-3 grid gap-x-10 sm:grid-cols-2">
              {listing.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 border-t border-hair py-3 text-small text-green"
                >
                  <CheckCircleIcon width={18} height={18} className="mt-px shrink-0 text-moss" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className={cx(cardClass, 'p-6 sm:p-8')}>
            <h2 className="font-display text-h3 font-semibold text-green">Where it is</h2>
            <PropertyMap
              className="mt-5"
              center={listing.coords}
              label={`${listing.title} (${listing.area}, ${listing.city})`}
              caption={`Pin shows ${listing.area} at neighbourhood level, not the exact plot. We give the precise location when a viewing is arranged.`}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
          <AgentCard agent={agent} variant="contact" propertyReference={listing.reference} />

          <div
            id="enquire"
            className={cx(
              cardClass,
              'mt-5 scroll-mt-32 p-6 shadow-[0_28px_56px_-28px_rgba(15,42,26,0.25)] sm:p-7',
            )}
          >
            <h2 className="font-display text-h4 font-semibold text-green">
              Enquire about {listing.reference}
            </h2>
            <p className="mt-2 text-small leading-relaxed text-muted">
              Send your details and we will come back to you the same working day.
            </p>
            <div className="mt-5">
              <InquiryForm reference={listing.reference} title={listing.title} />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-sage-soft p-6">
            <h2 className="font-display text-h4 font-semibold text-green">
              Want this valued instead?
            </h2>
            <p className="mt-2 text-small leading-relaxed text-prose">
              If you own something similar and need a figure for a bank, that is the other half of
              what we do.
            </p>
            <div className="mt-5">
              <Button href="/contact/request-a-valuation" variant="outline" size="sm">
                Request a valuation
              </Button>
            </div>
          </div>
        </aside>
      </Section>

      {related.length > 0 && (
        <Section>
          <Plate>
            <SectionHeading
              eyebrow="Similar property"
              title="More like this on our books"
              action={
                <Button href={`/listings/${category.slug}`} variant="outline">
                  All {category.name.toLowerCase()} property
                </Button>
              }
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="flex">
                  <PropertyCard listing={item} className="w-full" />
                </li>
              ))}
            </ul>
          </Plate>
        </Section>
      )}

      <CTABanner
        title="Schedule a viewing"
        lead={`Arrange to see ${listing.reference} with our team. Weekday and Saturday morning viewings both work.`}
        primary={{ label: 'Schedule a viewing', href: '#enquire' }}
        secondary={{ label: 'Talk to us first', href: '/contact' }}
      />
    </>
  );
}
