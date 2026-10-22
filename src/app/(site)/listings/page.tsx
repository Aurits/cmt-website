import type { Metadata } from 'next';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { ListingsExplorer } from '@/components/property/ListingsExplorer';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { categories } from '@/data/categories';
import { citiesOf } from '@/data/listings';
import { getListings } from '@/lib/content';
import { numberWord } from '@/lib/format';
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
  const listings = await getListings();
  const cities = citiesOf(listings);
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
        lead={`${listings.length} properties across ${numberWord(categories.length)} property types and ${numberWord(cities.length)} cities. Filter to what you are after, or start from a property type.`}
        leadShort={`${listings.length} properties across ${numberWord(categories.length)} types and ${numberWord(cities.length)} cities.`}
        eyebrow="Properties"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Properties' }]}
      >
        <ul className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/listings/${item.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-green/12 bg-white/70 py-2 pr-2 pl-4 text-small font-medium text-green transition-colors hover:bg-white"
              >
                {item.name}
                <span className="tnum flex h-6 min-w-6 items-center justify-center rounded-full bg-sage-soft px-1.5 text-[12px] font-semibold">
                  {listings.filter((listing) => listing.category === item.slug).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>

      <Section>
        <ListingsExplorer
          listings={listings}
          cities={cities}
          defaults={{ type: type ?? 'any', category: category ?? 'any', city: city ?? 'any' }}
        />
      </Section>

      <CTABanner
        title="Have a property to sell or let?"
        lead="We value it first, then price it from evidence. That is usually the difference between a property that moves and one that sits."
        primary={{ label: 'List your property', href: '/contact/list-a-property' }}
        secondary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
      />
    </>
  );
}
