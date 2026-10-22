import type { Metadata } from 'next';
import { IntentTabs } from '@/components/forms/IntentTabs';
import { ListPropertyForm } from '@/components/forms/ListPropertyForm';
import { citiesOf } from '@/data/listings';
import { getListings } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categoryBySlug } from '@/data/categories';
import type { CategorySlug } from '@/lib/types';

export const metadata: Metadata = {
  title: 'List a property',
  description:
    'Put a property on the market with CMT Realtors. We value it first, then price it from evidence rather than from ambition.',
};

export default async function ListPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = typeof params.category === 'string' ? (params.category as CategorySlug) : undefined;
  const category = raw && categoryBySlug[raw] ? raw : undefined;
  const cities = citiesOf(await getListings());

  return (
    <>
      <IntentTabs active="listing" />
      <div className="mt-8">
        <SectionHeading
          title="List a property with us"
          lead="Here is how it works: we value the property, agree an asking price with you from the evidence, and list it once you are happy with the figure."
        />
        <div className="mt-8">
          <ListPropertyForm cities={cities} defaultCategory={category} />
        </div>
        <div className="mt-8 border-t border-hair pt-6">
          <p className="max-w-[56ch] text-body leading-relaxed text-muted">
            Selling is only half of what we do with an owner&rsquo;s property. If you want the figure
            before you decide whether to sell at all, that is a valuation rather than a listing.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/contact/request-a-valuation" variant="outline" size="sm">
              Request a valuation instead
            </Button>
            <Button href="/advisory#acquisition-and-disposal" variant="quiet" size="sm">
              How listing works
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
