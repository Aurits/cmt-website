import type { AdvisoryService } from '@/lib/types';

/**
 * Everything that is not a valuation report.
 *
 * Taken from the five consultancy lines CMT publishes, ordered highest-value first rather than
 * alphabetically. Advisory work is scoped, priced and negotiated — it is not bought off a card —
 * so /advisory renders these as a ruled index rather than a product grid, and each entry names
 * who it is for before it says what it is. See docs/LAYOUT-SPECS.md A-05.
 */
export const advisoryServices: AdvisoryService[] = [
  {
    slug: 'development',
    name: 'Development consultancy',
    audience: 'Landowners, developers and lenders funding a scheme',
    summary:
      'What a site can carry, what it would cost to build, and whether the numbers work before anyone commits. We appraise the scheme against real demand in that submarket, not against a spreadsheet assumption.',
    deliverables: [
      'Development appraisal with NPV and IRR stated',
      'Highest-and-best-use study',
      'Demand analysis for the specific submarket',
      'Support through regulatory approvals',
    ],
  },
  {
    slug: 'acquisition-and-disposal',
    name: 'Acquisition and disposal',
    audience: 'Buyers, sellers and corporate occupiers',
    summary:
      'End to end on a transaction: what it is worth, whether the title is clean, what to offer and what to accept. Because we value for a living, the price advice starts from evidence rather than from ambition.',
    deliverables: [
      'Title verification and due diligence',
      'Zoning and environmental checks',
      'Price advice backed by comparable evidence',
      'Negotiation through to transfer',
    ],
  },
  {
    slug: 'asset-and-facilities-management',
    name: 'Asset and facilities management',
    audience: 'Institutional landlords and multi-site occupiers',
    summary:
      'Running a building or a portfolio so it holds its value: tenant selection and vetting, service charge administration, planned maintenance, and the benchmarking that shows whether the return is where it should be.',
    deliverables: [
      'Tenant sourcing, vetting and lease administration',
      'Service charge administration and reconciliation',
      'Planned preventative maintenance programmes',
      'Return benchmarking and floor optimisation',
    ],
  },
  {
    slug: 'project-management',
    name: 'Project management',
    audience: 'Owners building, fitting out or refurbishing',
    summary:
      'Coordinating the built-environment professionals on a development or refurbishment, from site acquisition through to handover, with one party answerable for the programme and the cost.',
    deliverables: [
      'Programme and cost management',
      'Coordination of consultants and contractors',
      'Site acquisition support',
      'Handover and defects management',
    ],
  },
  {
    slug: 'market-research',
    name: 'Market research',
    audience: 'Investors, developers and institutions entering a market',
    summary:
      'What is actually happening in a submarket: rents achieved, absorption, and supply coming through, gathered from instructions rather than from press releases.',
    deliverables: [
      'Submarket supply and demand studies',
      'Rent and yield evidence',
      'Portfolio reviews',
    ],
  },
];

export const advisoryBySlug = Object.fromEntries(
  advisoryServices.map((service) => [service.slug, service]),
) as Record<string, AdvisoryService>;
