import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CTABanner } from '@/components/CTABanner';
import { ListingsExplorer } from '@/components/property/ListingsExplorer';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { categories, categoryBySlug } from '@/data/categories';
import { listingsByCategory } from '@/data/listings';
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categoryBySlug[slug as CategorySlug];
  if (!category) notFound();

  const categoryListings = listingsByCategory(category.slug);

  return (
    <>
      <PageHeader
        title={`${category.name} property in Uganda`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Property Listings', href: '/listings' },
          { label: category.name },
        ]}
      />

      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div className="relative aspect-[3/2] overflow-hidden rounded-brand border border-rule">
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="max-w-[60ch] text-lead leading-relaxed text-ink/85">
              {category.description}
            </p>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-micro text-muted">On our books</dt>
                <dd className="tnum font-display text-figure leading-none text-green">
                  {categoryListings.length}
                </dd>
              </div>
              <div>
                <dt className="text-micro text-muted">For sale</dt>
                <dd className="tnum font-display text-figure leading-none text-green">
                  {categoryListings.filter((listing) => listing.listingType === 'sale').length}
                </dd>
              </div>
              <div>
                <dt className="text-micro text-muted">To let</dt>
                <dd className="tnum font-display text-figure leading-none text-green">
                  {categoryListings.filter((listing) => listing.listingType === 'rent').length}
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="pb-12 lg:pb-16">
        <Container>
          <ListingsExplorer
            listings={categoryListings}
            lockedCategory={category.slug}
            perPage={6}
          />
        </Container>
      </section>

      <CTABanner
        title={category.cta.label}
        lead={`Tell us about your ${category.name.toLowerCase()} property and we will put a valuer on it. Inspection first, figure second, advice after that.`}
        primary={{ label: category.cta.label, href: category.cta.href }}
        secondary={{ label: 'Browse all property', href: '/listings' }}
        image={category.image}
      />
    </>
  );
}
