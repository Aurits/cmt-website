import type { Metadata } from 'next';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { ListingsExplorer } from '@/components/property/ListingsExplorer';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { categories } from '@/data/categories';
import { cities, listings, listingsByCategory } from '@/data/listings';
import type { CategorySlug, ListingType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Property Listings',
  description:
    'Residential, commercial, industrial, land and agricultural property for sale and to let in Kampala, Gulu, Mbale and Mbarara.',
};

/** The hero tabs and category cards arrive here with their selection in the URL. */
export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const read = (key: string) => (typeof params[key] === 'string' ? (params[key] as string) : undefined);

  const type = (['sale', 'rent'] as const).find((value) => value === read('type')) as
    | ListingType
    | undefined;
  const category = categories.find((item) => item.slug === read('category'))?.slug as
    | CategorySlug
    | undefined;
  const city = cities.find((name) => name === read('city'));

  return (
    <>
      <PageHeader
        title="Property on our books"
        lead={`${listings.length} properties across five property types and four cities. Filter to what you are after, or start from a property type.`}
        leadShort={`${listings.length} properties across five types and four cities.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Property Listings' }]}
      >
        <ul className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/listings/${item.slug}`}
                className="inline-flex items-baseline gap-2 rounded-control border border-cream/30 px-3.5 py-2 text-body text-cream transition-colors hover:border-gold hover:text-gold"
              >
                {item.name}
                <span className="tnum text-label text-cream/60">
                  {listingsByCategory(item.slug).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>

      <section className="py-12 lg:py-16">
        <Container>
          <ListingsExplorer
            listings={listings}
            defaults={{ type: type ?? 'any', category: category ?? 'any', city: city ?? 'any' }}
          />
        </Container>
      </section>

      <CTABanner
        title="Have a property to sell or let?"
        lead="We value it first, then price it from evidence. That is usually the difference between a property that moves and one that sits."
        primary={{ label: 'List your property', href: '/contact/list-a-property' }}
        secondary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
      />
    </>
  );
}
