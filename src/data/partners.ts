import type { PartnerGroup } from '@/lib/types';

/**
 * Clients and partners, with the real marks.
 *
 * Every logo file was pulled from CMT's own clients page by
 * scripts/prepare-partner-logos.mjs — the brief names that as the source to reuse. See
 * public/brand/partners/CREDITS.md for the provenance of each file.
 *
 * TWO ADDITIONS, NEEDING CONFIRMATION: CMT's live clients page also shows EXIM Bank and
 * Uganda Development Bank, which the brief's list omits. They are included here because
 * the client publishes them, but worth confirming they are current.
 *
 * The African Development Bank source file contained two seals side by side — the Bank and
 * the African Development Fund, which are different institutions. Only the Bank's seal is
 * used. Also worth confirming: the brief asks whether UNFCU should sit here under
 * corporate partners or with the banks, since it is a credit union.
 */
export const partnerGroups: PartnerGroup[] = [
  {
    id: 'banks',
    title: 'Banks and financial institutions',
    description:
      'Mortgage and secured-lending valuations, prepared to the standard a credit committee expects.',
    partners: [
      { name: 'Bank of Uganda', logo: '/brand/partners/bank-of-uganda.png' },
      { name: 'Standard Chartered Bank', logo: '/brand/partners/standard-chartered.png' },
      {
        name: 'United Bank for Africa',
        shortName: 'UBA',
        logo: '/brand/partners/uba.png',
      },
      { name: 'GTBank', logo: '/brand/partners/gtbank.png' },
      { name: 'Stanbic Bank', logo: '/brand/partners/stanbic-bank.png' },
      { name: 'KCB Bank', logo: '/brand/partners/kcb-bank.png' },
      {
        name: 'African Development Bank',
        logo: '/brand/partners/african-development-bank.png',
      },
      { name: 'EXIM Bank', logo: '/brand/partners/exim-bank.png' },
      {
        name: 'Uganda Development Bank',
        shortName: 'UDB',
        logo: '/brand/partners/uganda-development-bank.png',
      },
    ],
  },
  {
    id: 'government',
    title: 'Government and regulatory bodies',
    description:
      'Compensation assessments, asset registers and statutory valuation work for public bodies.',
    partners: [
      {
        name: 'Uganda Communications Commission',
        shortName: 'UCC',
        logo: '/brand/partners/ucc.png',
      },
      {
        name: 'National Water and Sewerage Corporation',
        shortName: 'NWSC',
        logo: '/brand/partners/nwsc.png',
      },
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate and development partners',
    description:
      'Portfolio reviews, site acquisition advice and asset valuations for corporate occupiers.',
    partners: [
      { name: 'Vivo Energy', logo: '/brand/partners/vivo-energy.png' },
      { name: 'Vision Fund Uganda', logo: '/brand/partners/vision-fund-uganda.png' },
      {
        name: 'UN Federal Credit Union',
        shortName: 'UNFCU',
        logo: '/brand/partners/unfcu.png',
      },
    ],
  },
];

export const partnerCount = partnerGroups.reduce(
  (total, group) => total + group.partners.length,
  0,
);

/** Every client in one list, for the homepage belt. */
export const allPartners = partnerGroups.flatMap((group) => group.partners);
