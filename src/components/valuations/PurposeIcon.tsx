import {
  CompensationIcon,
  InsuranceIcon,
  LendingIcon,
  LitigationIcon,
  ReportingIcon,
} from '@/components/ui/icons';
import type { ValuationPurposeSlug } from '@/lib/types';

/**
 * The mark for each valuation purpose, keyed by slug so a new purpose in src/data/valuations.ts
 * fails the type check here until it is given one, rather than silently rendering blank.
 */
const ICONS: Record<ValuationPurposeSlug, typeof LendingIcon> = {
  'for-lending': LendingIcon,
  'financial-reporting': ReportingIcon,
  insurance: InsuranceIcon,
  'tax-and-litigation': LitigationIcon,
  compensation: CompensationIcon,
};

export function PurposeIcon({
  slug,
  ...props
}: { slug: ValuationPurposeSlug } & React.SVGProps<SVGSVGElement>) {
  const Icon = ICONS[slug];
  return <Icon {...props} />;
}
