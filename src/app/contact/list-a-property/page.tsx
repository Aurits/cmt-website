import type { Metadata } from 'next';
import { IntentTabs } from '@/components/forms/IntentTabs';
import { ListPropertyForm } from '@/components/forms/ListPropertyForm';
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

  return (
    <>
      <IntentTabs active="listing" />
      <div className="mt-8">
        <SectionHeading
          title="List a property with us"
          lead="Owners go through a shorter route: we value the property, agree an asking price from the evidence, and list it once you are happy with the figure."
        />
        <div className="mt-8">
          <ListPropertyForm defaultCategory={category} />
        </div>
        <div className="mt-8 border-t border-rule pt-6">
          <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted">
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
