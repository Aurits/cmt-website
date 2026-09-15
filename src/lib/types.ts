export type CategorySlug =
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'land'
  | 'agricultural';

export type ListingType = 'sale' | 'rent';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One line for cards and nav. */
  label: string;
  /** Two or three sentences for the category landing page. */
  description: string;
  image: string;
  imageAlt: string;
  /** Category-specific CTA, per the brief's requirement. */
  cta: { label: string; href: string };
}

export interface Listing {
  slug: string;
  /** Internal file reference, the way a valuation firm actually indexes stock. */
  reference: string;
  title: string;
  category: CategorySlug;
  listingType: ListingType;
  /** Uganda shillings. Rentals are per month (see rentPeriod). */
  price: number;
  rentPeriod?: 'month';
  city: string;
  area: string;
  coords: [number, number];
  beds?: number;
  baths?: number;
  /** Built area or plot size, already formatted with its unit. */
  size: string;
  sizeLabel: 'Built area' | 'Plot size' | 'Land area' | 'Floor area';
  tenure: 'Freehold' | 'Leasehold' | 'Mailo' | 'Customary';
  images: { src: string; alt: string }[];
  summary: string;
  description: string[];
  features: string[];
  agentId: string;
  featured?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  /**
   * Headshots are a client deliverable. Until they arrive we render initials —
   * never a stock photograph of an unrelated person in place of a named colleague.
   */
  photo?: string;
  phone?: string;
  email?: string;
  bio?: string;
}

export interface Partner {
  name: string;
  /** Short form used on the logo plate when the full name is long. */
  shortName?: string;
  /** Real logo file, once the client supplies it. Falls back to a typographic plate. */
  logo?: string;
}

export interface PartnerGroup {
  id: string;
  title: string;
  description: string;
  partners: Partner[];
}

export interface Testimonial {
  quote: string;
  name: string;
  organisation: string;
  role?: string;
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  image: string;
  imageAlt: string;
  deliverables: string[];
  cta: { label: string; href: string };
  /** True until CMT confirms the full service list (open item in the brief). */
  provisional: boolean;
}

/* ---------------------------------------------------------------------------
   Valuations
   Two axes, exactly as CMT's own services page organises the work: what is
   being valued, and what the figure is for. The matrix on /valuations is the
   cross-product, and a purpose lists the assets it actually applies to — an
   absent combination is rendered as inert rather than hidden, so the page
   states the scope honestly. See SITE-STRATEGY.md and LAYOUT-SPECS.md A-03.
   --------------------------------------------------------------------------- */

export type ValuationAssetSlug = 'property' | 'plant-and-machinery' | 'business-and-shares';

export type ValuationPurposeSlug =
  | 'for-lending'
  | 'financial-reporting'
  | 'insurance'
  | 'tax-and-litigation'
  | 'compensation';

export interface ValuationAsset {
  slug: ValuationAssetSlug;
  name: string;
  /** Column header in the matrix, where space is tight. */
  short: string;
  description: string;
}

export interface ValuationPurpose {
  slug: ValuationPurposeSlug;
  name: string;
  /** Second person, naming the reader's actual situation. Carries the page. */
  situation: string;
  /** Terms of art, each with a plain definition — defining them is a service. */
  basis: { term: string; meaning: string }[];
  /** Which asset classes this purpose applies to. Drives the matrix. */
  assets: ValuationAssetSlug[];
  /** Working days, from the date of inspection. Stated with its caveat. */
  turnaround: string;
  deliverables: string[];
}

export interface AdvisoryService {
  slug: string;
  name: string;
  /** Who this is for — the 'for:' line in the index. */
  audience: string;
  summary: string;
  deliverables: string[];
}
