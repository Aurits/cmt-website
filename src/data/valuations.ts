import type {
  ValuationAsset,
  ValuationAssetSlug,
  ValuationPurpose,
  ValuationPurposeSlug,
} from '@/lib/types';

/**
 * The valuation offer, on two axes.
 *
 * Drawn from what CMT already publishes on their own services page — seven asset classes and six
 * purposes — consolidated into three asset groups and five purposes so the matrix stays legible.
 * Shares, stocks and going-concern work group as 'business-and-shares'; plant, machinery and
 * integral assets group as 'plant-and-machinery'; land, buildings and development sites as
 * 'property'.
 *
 * OPEN ITEM (docs/OPEN-ITEMS.md #4): CMT needs to tell us which of these lines they actually want work
 * in. `LEAD` below is our assumption, stated here so it can be corrected in one edit rather than
 * hunted through the pages.
 */

export const valuationAssets: ValuationAsset[] = [
  {
    slug: 'property',
    name: 'Land, buildings and development sites',
    short: 'Property',
    description:
      'Residential, commercial, industrial and agricultural property, titled plots and sites held for development.',
  },
  {
    slug: 'plant-and-machinery',
    name: 'Plant, machinery and integral assets',
    short: 'Plant & machinery',
    description:
      'Production lines, generators, processing equipment and the fixed plant that a building cannot be separated from.',
  },
  {
    slug: 'business-and-shares',
    name: 'Shareholdings and business assets',
    short: 'Business & shares',
    description:
      'Shares, stocks and going-concern value, where the asset being transferred is a company rather than a title.',
  },
];

export const valuationPurposes: ValuationPurpose[] = [
  {
    slug: 'for-lending',
    name: 'For lending',
    situation:
      'Your bank has asked for a valuation before it will release the facility, and the credit committee meets on a date you do not control.',
    basis: [
      {
        term: 'Market value',
        meaning:
          'What the property would fetch between a willing buyer and a willing seller, neither under pressure, at the date of inspection.',
      },
      {
        term: 'Forced-sale value',
        meaning:
          'What it would fetch if the lender had to sell within a constrained period. Stated explicitly rather than buried, because it is the figure the credit committee actually lends against.',
      },
    ],
    assets: ['property', 'plant-and-machinery'],
    turnaround: '5–8 working days',
    deliverables: [
      'Security report in the bank template where one exists',
      'Market value and forced-sale value, both stated',
      'Title and tenure verification',
      'Re-inspection and revaluation on review cycles',
    ],
  },
  {
    slug: 'financial-reporting',
    name: 'Financial reporting',
    situation:
      'Your auditor needs the assets on your balance sheet valued at the year end, on a basis they will not question.',
    basis: [
      {
        term: 'Fair value',
        meaning:
          'The IFRS 13 basis: an exit price in an orderly transaction between market participants, with the inputs and the valuation hierarchy level disclosed.',
      },
      {
        term: 'Depreciated replacement cost',
        meaning:
          'Used where an asset is specialised and rarely traded, so there is no comparable evidence to work from.',
      },
    ],
    assets: ['property', 'plant-and-machinery', 'business-and-shares'],
    turnaround: '10–15 working days',
    deliverables: [
      'Valuation report in a form your auditor can rely on',
      'Fair value hierarchy level and inputs disclosed',
      'Asset register reconciliation',
      'Year-on-year movement schedule where we valued previously',
    ],
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    situation:
      'You need a sum insured that would actually rebuild the property, not the price you paid for it, and not a figure carried forward from an old policy.',
    basis: [
      {
        term: 'Reinstatement cost',
        meaning:
          'What it would cost to rebuild today, including professional fees, demolition and the effect of inflation over the rebuild period. This is not market value and is often higher.',
      },
    ],
    assets: ['property', 'plant-and-machinery'],
    turnaround: '5–10 working days',
    deliverables: [
      'Reinstatement cost assessment',
      'Schedule of insurable items, separated from land',
      'A stated basis your insurer will accept at claim',
    ],
  },
  {
    slug: 'tax-and-litigation',
    name: 'Tax and litigation',
    situation:
      'A figure is being contested: in an estate, a shareholder dispute, a matrimonial matter, or with a tax authority, and it has to withstand someone whose job is to disagree with it.',
    basis: [
      {
        term: 'Market value at a stated date',
        meaning:
          'Often a date in the past: the date of death, of separation, or of a transaction under review. The evidence has to be contemporaneous with that date, not with today.',
      },
    ],
    assets: ['property', 'plant-and-machinery', 'business-and-shares'],
    turnaround: '7–14 working days',
    deliverables: [
      'Report prepared to withstand challenge, assumptions stated',
      'Comparable evidence contemporaneous with the valuation date',
      'Expert opinion and attendance where a matter proceeds',
    ],
  },
  {
    slug: 'compensation',
    name: 'Compensation',
    situation:
      'A road, a pipeline or a public project is taking land, and the assessment you have been offered needs checking before you sign it.',
    basis: [
      {
        term: 'Compensation assessment',
        meaning:
          'An inventory of land, structures, crops and trees, valued at the approved district rates, with the statutory disturbance allowance applied on top.',
      },
    ],
    assets: ['property'],
    turnaround: 'Scoped per instruction',
    deliverables: [
      'Independent assessment against the approved district rates',
      'Inventory of affected land, structures, crops and trees',
      'Review of an assessment already served on you',
    ],
  },
];

/**
 * The lead line: the cell the matrix opens on, and the one the homepage pushes.
 * Secured lending is the majority of instructions and the most common reason someone is on the
 * page at all. ASSUMPTION — see docs/OPEN-ITEMS.md #4.
 */
export const LEAD: { purpose: ValuationPurposeSlug; asset: ValuationAssetSlug } = {
  purpose: 'for-lending',
  asset: 'property',
};

export const purposeBySlug = Object.fromEntries(
  valuationPurposes.map((purpose) => [purpose.slug, purpose]),
) as Record<ValuationPurposeSlug, ValuationPurpose>;

export const assetBySlug = Object.fromEntries(
  valuationAssets.map((asset) => [asset.slug, asset]),
) as Record<ValuationAssetSlug, ValuationAsset>;

export function purposeCovers(purpose: ValuationPurpose, asset: ValuationAssetSlug): boolean {
  return purpose.assets.includes(asset);
}

/** The three the homepage surfaces, in order. */
export const featuredPurposes: ValuationPurposeSlug[] = [
  'for-lending',
  'financial-reporting',
  'compensation',
];

/**
 * How an instruction runs, start to signed report.
 *
 * Shared by /valuations, which sets it as a four-cell grid, and the homepage, which draws it on a
 * datum. One list, so the two can never describe the process differently: a firm that says one
 * thing about its method on its homepage and another on its services page has told a lender
 * something about its reports too.
 */
export const valuationSteps: { title: string; body: string }[] = [
  {
    title: 'Instruction and scope',
    body: 'We agree what is being valued, why, and for whom. A bank, a court and a seller each need a different basis of value, so we settle it before anyone visits.',
  },
  {
    title: 'Title and inspection',
    body: 'We check the title and tenure, then inspect and measure the property and photograph everything the report will rely on.',
  },
  {
    title: 'Evidence and analysis',
    body: 'We gather recent sales and lettings of similar property nearby and adjust them to fit. Where rent drives the value, we work from the rent roll.',
  },
  {
    title: 'Signed report',
    body: 'You receive a written report signed by a named valuer, with the assumptions, the evidence and the limits set out plainly.',
  },
];
