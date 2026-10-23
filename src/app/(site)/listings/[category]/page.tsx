import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CTABanner } from '@/components/CTABanner';
import { ListingsExplorer } from '@/components/property/ListingsExplorer';
import { FactStrip } from '@/components/FactStrip';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { categories, categoryBySlug } from '@/data/categories';
import { citiesOf } from '@/data/listings';
import { getListings } from '@/lib/content';
import type { CategorySlug } from '@/lib/types';

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryBySlug[slug as CategorySlug];
  if (!category) return {};
  return {
    title: `${category.name} Property`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categoryBySlug[slug as CategorySlug];
  if (!category) notFound();

  const listings = await getListings();
  const categoryListings = listings.filter((listing) => listing.category === category.slug);

  return (
    <>
      <PageHeader
        title={`${category.name} property in Uganda`}
        eyebrow="Properties"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/listings' },
          { label: category.name },
        ]}
      />

      <Section
        clip
        containerClassName="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20"
      >
        <div className="relative mr-[22px] mb-[22px]">
          <div
            aria-hidden="true"
            className="absolute inset-[22px_-22px_-22px_22px] rounded-(--radius-plate) bg-sage"
          />
          <div
            aria-hidden="true"
            className="absolute -top-5 -left-5 h-16 w-16 rounded-full bg-gold"
          />
          <div className="relative aspect-[3/2] overflow-hidden rounded-(--radius-card)">
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <p className="max-w-[60ch] text-hero-lead leading-[1.6] text-prose">
            {category.description}
          </p>
          <FactStrip
            className="mt-8 grid-cols-3 min-[961px]:grid-cols-3"
            facts={[
              { title: String(categoryListings.length), body: 'On our books' },
              {
                title: String(
                  categoryListings.filter((listing) => listing.listingType === 'sale').length,
                ),
                body: 'For sale',
              },
              {
                title: String(
                  categoryListings.filter((listing) => listing.listingType === 'rent').length,
                ),
                body: 'To let',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <ListingsExplorer
          listings={categoryListings}
          cities={citiesOf(listings)}
          lockedCategory={category.slug}
          perPage={6}
        />
      </Section>

      <CTABanner
        title={category.cta.label}
        lead={`Tell us about your ${category.name.toLowerCase()} property and we will put a valuer on it. Inspection first, figure second, advice after that.`}
        primary={{ label: category.cta.label, href: category.cta.href }}
        secondary={{ label: 'Browse all property', href: '/listings' }}
      />
    </>
  );
}
