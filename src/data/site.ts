import type { Office } from '@/lib/types';

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

  /**
   * OPEN ITEM: cmtrealtors.com shows Facebook, X and LinkedIn icons but links each to '#',
   * so we have no profile URLs to publish. Paste the full URL of each profile here and its
   * footer icon becomes a live link. Until then the icon shows, dimmed, as not yet linked.
   */
  social: {
    facebook: null as string | null,
    x: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
  },

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
  /**
   * OPEN ITEM (OPEN-ITEMS.md #2): CMT Realtors is incorporated in Kenya (2010) as well as
   * practising in Uganda, and we do not yet know whether that is one firm with two arms or two
   * firms sharing a director. Until it is settled the site leads with Uganda and presents Kenya
   * as a linked practice rather than claiming a single regional entity. Flip `regionConfirmed`
   * when CMT tells us, and the wording on /about/offices follows.
   */
  regionConfirmed: false,
  regulator: 'Uganda Institution of Surveyors',
  yearsInBusiness: '16+',
} as const;

/**
 * Six items, identity first, which is the ceiling Plan.md sets.
 *
 * Home earns its slot on a site people arrive at sideways: most visitors land on a valuation
 * page from a search or a bank's referral rather than on the homepage, and the logo alone is a
 * convention they should not have to know. It also gives the mobile drawer a route home, which
 * it did not have.
 *
 * Identity leads because the brief requires it and because this firm sells standing — see
 * SITE-STRATEGY.md §4. Valuations is promoted out of the old "Services" bucket, which used to
 * carry both the valuation work and the consultancy work on one page; Advisory now takes the
 * rest. "Property Listings" becomes "Properties": the label changes, the routes do not, because
 * /properties/[slug] already serves property detail and a second dynamic segment at that level
 * would collide.
 *
 * About, Valuations, Advisory and Properties open a menu rather than going straight to their
 * page (see NavMenus): each previews its section and lets a visitor go straight to the part they
 * came for. Properties' menu is also where "List with us" lives without costing a seventh slot.
 * Home and Contact are single destinations and stay plain links.
 *
 * Insights is deliberately absent until the first market note exists. An empty Insights section
 * advertises that the firm started something and stopped.
 *
 * `match` lists any additional path prefixes that should light this item up — property detail
 * lives under /properties, and List with us under /contact. Where two items both match, the
 * header lights the more specific one, so the list-a-property page marks Properties, not Contact.
 */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about', menu: 'about' },
  { label: 'Valuations', href: '/valuations', menu: 'valuations' },
  { label: 'Advisory', href: '/advisory', menu: 'advisory' },
  {
    label: 'Properties',
    href: '/listings',
    match: ['/properties', '/contact/list-a-property'],
    menu: 'properties',
  },
  { label: 'Contact', href: '/contact' },
] as const;

/**
 * The About section. Not in the masthead — six nav items was the brief's ceiling and these are
 * destinations you arrive at from /about — but reachable from the footer on every page, because
 * they are where the firm's standing is actually argued.
 */
export const aboutPages = [
  { label: 'Our people', href: '/about/people' },
  { label: 'Credentials', href: '/about/credentials' },
  { label: 'Offices', href: '/about/offices' },
  { label: 'Our clients', href: '/about/clients' },
] as const;

/** Where the WhatsApp CTA should point given what we actually know. */
export function whatsappHref(message?: string): string {
  if (!site.whatsapp) return '/contact#whatsapp';
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${site.whatsapp}${text}`;
}

/**
 * Nine offices, two countries.
 *
 * The survey baseline on /about renders these in order, split at the border. Only the two head
 * offices publish a street address — the branches are listed because coverage is the point, and a
 * street address we have not confirmed is worse than none. Kenya's branches come from
 * cmtrealtors.co.ke; Uganda's from cmtrealtors.com.
 */
export const offices: Office[] = [
  {
    city: 'Kampala',
    country: 'Uganda',
    role: 'Head office',
    address: 'Ambassador House, Plot 56/60, Suite B, 1st Floor, Kampala Road',
    coords: [0.3146, 32.5806],
  },
  { city: 'Gulu', country: 'Uganda', role: 'Branch' },
  { city: 'Mbale', country: 'Uganda', role: 'Branch' },
  { city: 'Mbarara', country: 'Uganda', role: 'Branch' },
  { city: 'Nairobi', country: 'Kenya', role: 'Head office' },
  { city: 'Mombasa', country: 'Kenya', role: 'Branch' },
  { city: 'Kisumu', country: 'Kenya', role: 'Branch' },
  { city: 'Kisii', country: 'Kenya', role: 'Branch' },
  { city: 'Bungoma', country: 'Kenya', role: 'Branch' },
];

export const ugandaOffices = offices.filter((office) => office.country === 'Uganda');
export const kenyaOffices = offices.filter((office) => office.country === 'Kenya');

/**
 * The ledger. `institutions` counts the logos we actually hold rather than the "20+" CMT states,
 * because the conveyor below it shows them and the two numbers would otherwise contradict each
 * other on the same screen. OPEN-ITEMS.md #7 is the gap between them.
 */
export const stats = [
  { value: site.yearsInBusiness, unit: 'years', label: 'Valuing property in East Africa' },
  {
    value: String(offices.length),
    unit: 'offices',
    label: 'Across Uganda and Kenya, head offices in Kampala and Nairobi',
  },
  { value: '14', unit: 'institutions', label: 'Banks, agencies and corporates instructed us' },
  { value: 'UIS', unit: 'regulated', label: 'Uganda Institution of Surveyors' },
] as const;
