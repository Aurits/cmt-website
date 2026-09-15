/**
 * Single source of truth for identity, contact routes and navigation.
 *
 * Contact details are the firm's own published details (cmtrealtors.com). Nothing here
 * is invented: where CMT has not published something it is left null or flagged, and the
 * UI degrades honestly rather than showing a made-up number. See OPEN-ITEMS.md.
 */
export const site = {
  name: 'CMT Realtors Limited',
  shortName: 'CMT Realtors',
  tagline: 'Your Trusted Partner in Real Estate Valuation & Consultancy',
  description:
    'Kampala valuation and property consultancy firm, regulated by the Uganda Institution of Surveyors, instructed by banks, government bodies and corporate clients for more than 16 years.',
  url: 'https://cmtrealtors.com',

  phone: { display: '+256 414 346 344', href: 'tel:+256414346344' },
  email: 'info@cmtrealtorsug.com',

  /**
   * OPEN ITEM: CMT publishes a landline only, and a landline cannot receive WhatsApp.
   * Set this to the office mobile in international digits (e.g. '256700123456') and
   * every WhatsApp CTA on the site starts working. Until then those CTAs route to the
   * contact page instead of a dead wa.me link.
   */
  whatsapp: null as string | null,

  address: {
    building: 'Ambassador House',
    line1: 'Plot 56/60, Suite B, 1st Floor',
    street: 'Kampala Road',
    city: 'Kampala',
    country: 'Uganda',
    /** Street-level, not surveyed. The map caption says as much. */
    coords: [0.3146, 32.5806] as [number, number],
  },

  /** PLACEHOLDER: not published anywhere. Confirm with CMT before launch. */
  hours: [
    { days: 'Monday to Friday', time: '8:30 am – 5:30 pm' },
    { days: 'Saturday', time: '9:00 am – 1:00 pm' },
    { days: 'Sunday and public holidays', time: 'Closed' },
  ],
  hoursConfirmed: false,

  cities: ['Kampala', 'Gulu', 'Mbale', 'Mbarara'],
  regulator: 'Uganda Institution of Surveyors',
  yearsInBusiness: '16+',
} as const;

/**
 * Five items, identity first.
 *
 * Identity leads because the brief requires it and because this firm sells standing — see
 * SITE-STRATEGY.md §4. Valuations is promoted out of the old "Services" bucket, which used to
 * carry both the valuation work and the consultancy work on one page; Advisory now takes the
 * rest. "Property Listings" becomes "Properties": the label changes, the routes do not, because
 * /properties/[slug] already serves property detail and a second dynamic segment at that level
 * would collide.
 *
 * Insights is deliberately absent until the first market note exists. An empty Insights section
 * advertises that the firm started something and stopped.
 *
 * `match` lists any additional path prefixes that should light this item up — property detail
 * lives under /properties while the nav points at /listings, and both are the same destination
 * as far as a visitor is concerned.
 */
export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Valuations', href: '/valuations' },
  { label: 'Advisory', href: '/advisory' },
  { label: 'Properties', href: '/listings', match: ['/properties'] },
  { label: 'Contact', href: '/contact' },
] as const;

/** Where the WhatsApp CTA should point given what we actually know. */
export function whatsappHref(message?: string): string {
  if (!site.whatsapp) return '/contact#whatsapp';
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${site.whatsapp}${text}`;
}

export const stats = [
  { value: site.yearsInBusiness, unit: 'years', label: 'Valuing property in Uganda' },
  { value: '12', unit: 'institutions', label: 'Banks, agencies and corporates instructed us' },
  { value: '4', unit: 'cities', label: 'Kampala, Gulu, Mbale and Mbarara' },
  { value: 'UIS', unit: 'regulated', label: 'Uganda Institution of Surveyors' },
] as const;
