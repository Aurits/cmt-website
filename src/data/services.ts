import type { Service } from '@/lib/types';

/**
 * PROVISIONAL. The full service list is an open item in the brief. These four are drawn
 * from what CMT already publishes (valuation, consultancy, listing management) and are
 * framed around what the visitor needs rather than internal department names. The
 * Services page states plainly that the list is provisional.
 */
export const services: Service[] = [
  {
    slug: 'property-valuation',
    name: 'Property valuation',
    summary:
      'A defensible market value for a house, building, plot or estate, signed off by a surveyor your bank will recognise.',
    detail:
      'We inspect the property, verify the title and tenure, gather comparable evidence from the same market, and issue a written report you can put in front of a lender, a court, a tax authority or a co-owner.',
    image: '/images/services/valuation.jpg',
    imageAlt: 'A surveyor measuring a drawing at a desk',
    deliverables: [
      'Signed valuation report with photographs and comparable evidence',
      'Title and tenure verification',
      'Market value, and forced-sale value where a lender requires it',
    ],
    cta: { label: 'Request a valuation', href: '/contact?subject=valuation' },
    provisional: true,
  },
  {
    slug: 'mortgage-and-lending-valuation',
    name: 'Valuation for lending',
    summary:
      'Security valuations for banks and credit institutions, prepared in the format a credit committee already works with.',
    detail:
      'Instructions come in directly from the lender or through the borrower. Reports are delivered in the format the credit team expects, with the forced-sale position stated explicitly rather than buried.',
    image: '/images/services/lending.jpg',
    imageAlt: 'A report being signed',
    deliverables: [
      'Security report in the bank template where one exists',
      'Market value and forced-sale value',
      'Re-inspection and revaluation on review cycles',
    ],
    cta: { label: 'Talk to us about panel work', href: '/contact?subject=general' },
    provisional: true,
  },
  {
    slug: 'real-estate-consultancy',
    name: 'Real estate consultancy',
    summary:
      'Advice before you commit: what a site is worth, what it can carry, and what it will cost to hold.',
    detail:
      'Site acquisition advice, highest-and-best-use studies, portfolio reviews, compensation assessments and expert opinion where a valuation is contested. Consultancy work is scoped in writing before it starts, so the fee and the deliverable are agreed up front.',
    image: '/images/services/consultancy.jpg',
    imageAlt: 'Two people working over plans and figures',
    deliverables: [
      'Written advice with the assumptions stated',
      'Site and portfolio reviews',
      'Compensation and dispute support',
    ],
    cta: { label: 'Request a consultation', href: '/contact?subject=general' },
    provisional: true,
  },
  {
    slug: 'listing-and-sales-management',
    name: 'Listing and sales management',
    summary:
      'Sell or let a property at a price the market will actually pay, with the valuation done first.',
    detail:
      'We list residential, commercial, industrial, land and agricultural property. Because we value for a living, the asking price starts from evidence rather than ambition. We handle viewings, qualify buyers and tenants, and see the transaction through to transfer.',
    image: '/images/services/listing.jpg',
    imageAlt: 'A house at dusk with its windows lit',
    deliverables: [
      'Asking-price advice backed by comparable evidence',
      'Listing, viewings and buyer or tenant qualification',
      'Support through to transfer or tenancy',
    ],
    cta: { label: 'List your property', href: '/contact?subject=listing' },
    provisional: true,
  },
];
