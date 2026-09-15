import type { Metadata } from 'next';
import { IntentTabs } from '@/components/forms/IntentTabs';
import { ValuationRequestForm } from '@/components/forms/ValuationRequestForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { assetBySlug, purposeBySlug } from '@/data/valuations';
import type { ValuationAssetSlug, ValuationPurposeSlug } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Request a valuation',
  description:
    'Tell us what needs valuing and what the figure is for. Property, plant and machinery, or a shareholding. For lending, financial reporting, insurance, tax, litigation or compensation.',
};

/**
 * The page the whole site funnels into.
 *
 * `asset` and `purpose` arrive from the matrix on /valuations, from a purpose page, or from the
 * hero counter, and are validated against the data before they are trusted — a query string is
 * visitor input, and an unrecognised one falls back to the default rather than rendering an empty
 * select.
 */
export default async function RequestValuationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const read = (key: string) =>
    typeof params[key] === 'string' ? (params[key] as string) : undefined;

  const asset = (read('asset') ?? '') as ValuationAssetSlug;
  const purpose = (read('purpose') ?? '') as ValuationPurposeSlug;
  const validAsset = assetBySlug[asset] ? asset : undefined;
  const validPurpose = purposeBySlug[purpose] ? purpose : undefined;

  const lead = validPurpose
    ? `You are asking about ${purposeBySlug[validPurpose].name.toLowerCase()}. We have filled that in. Change it if we have guessed wrong.`
    : 'Two questions decide the whole instruction: what is being valued, and what the figure is for. Everything else we can settle on the phone.';

  return (
    <>
      <IntentTabs active="valuation" />
      <div className="mt-8">
        <SectionHeading title="Request a valuation" lead={lead} />
        <div className="mt-8">
          <ValuationRequestForm defaultAsset={validAsset} defaultPurpose={validPurpose} />
        </div>
      </div>
    </>
  );
}
