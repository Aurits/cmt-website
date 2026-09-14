import type { Metadata } from 'next';
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
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PinIcon } from '@/components/ui/icons';
import { agentById } from '@/data/agents';
import { categoryBySlug } from '@/data/categories';
import { listingBySlug, listings, relatedListings } from '@/data/listings';
import { listingTypeLabel, priceWithPeriod } from '@/lib/format';

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = listingBySlug[slug];
  if (!listing) return {};
  return {
    title: listing.title,
    description: listing.summary,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = listingBySlug[slug];
  if (!listing) notFound();

  const category = categoryBySlug[listing.category];
  const agent = agentById[listing.agentId];
  const related = relatedListings(listing);

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
      <div className="border-b border-rule bg-cream-deep/40">
        <Container className="py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
              <li>
                <Link href="/" className="hover:text-green">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/listings" className="hover:text-green">
                  Property Listings
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/listings/${category.slug}`} className="hover:text-green">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="tnum text-ink">
                {listing.reference}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <section className="pt-8 lg:pt-12">
        <Container>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="category">{category.name}</Badge>
                <Badge tone="type">{listingTypeLabel(listing)}</Badge>
              </div>
              <h1 className="mt-4 max-w-[26ch] text-[clamp(1.875rem,3.6vw,2.75rem)] text-green">
                {listing.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-muted">
                <PinIcon width={16} height={16} className="text-gold-deep" />
                {listing.area}, {listing.city}
              </p>
            </div>
            <p className="tnum font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-green">
              {priceWithPeriod(listing)}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-8 lg:py-12">
        <Container className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
          <div>
            <PropertyGallery
              images={listing.images}
              note="Representative photography while the site is in build. CMT's own photographs of this property replace these before launch."
            />

            <div className="mt-10">
              <h2 className="text-[1.5rem] text-green">Key facts</h2>
              <dl className="mt-4 sm:grid sm:grid-cols-2 sm:gap-x-10">
                {facts.map((fact) => (
                  <div key={fact.label} className="schedule-row">
                    <dt className="text-[0.875rem] text-muted">{fact.label}</dt>
                    <dd className="tnum text-right text-[0.9375rem] font-medium text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10">
              <h2 className="text-[1.5rem] text-green">About this property</h2>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-ink/85">
                {listing.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-[1.5rem] text-green">Included</h2>
              <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                {listing.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-baseline gap-3 border-t border-rule py-3 text-[0.9375rem] text-ink"
                  >
                    <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 bg-gold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h2 className="text-[1.5rem] text-green">Where it is</h2>
              <PropertyMap
                className="mt-4"
                center={listing.coords}
                label={`${listing.title} — ${listing.area}, ${listing.city}`}
                caption={`Pin shows ${listing.area} at neighbourhood level, not the exact plot. We give the precise location when a viewing is arranged.`}
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-[116px] lg:self-start">
            <AgentCard
              agent={agent}
              variant="contact"
              propertyReference={listing.reference}
            />

            <div
              id="enquire"
              className="mt-6 scroll-mt-32 rounded-brand border border-rule bg-paper p-5"
            >
              <h2 className="text-[1.25rem] text-green">Enquire about {listing.reference}</h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                Send your details and the agent handling this property will come back to you.
              </p>
              <div className="mt-5">
                <InquiryForm reference={listing.reference} title={listing.title} />
              </div>
            </div>

            <div className="mt-6 rounded-brand border border-green/25 bg-green/8 p-5">
              <h2 className="font-display text-[1.125rem] text-green">
                Want this valued instead?
              </h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                If you own something similar and need a figure for a bank, that is the other
                half of what we do.
              </p>
              <div className="mt-4">
                <Button href="/contact?subject=valuation" variant="outline" size="sm">
                  Request a valuation
                </Button>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-cream-deep/45 py-16 lg:py-20">
          <Container>
            <SectionHeading
              title="Similar property on our books"
              action={
                <Button href={`/listings/${category.slug}`} variant="outline" size="md">
                  All {category.name.toLowerCase()} property
                </Button>
              }
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="flex">
                  <PropertyCard listing={item} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CTABanner
        title="Schedule a viewing"
        lead={`Arrange to see ${listing.reference} with the agent handling it. Weekday and Saturday morning viewings both work.`}
        primary={{ label: 'Schedule a viewing', href: '#enquire' }}
        secondary={{ label: 'Talk to us first', href: '/contact?subject=general' }}
      />
    </>
  );
}
