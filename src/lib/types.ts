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
  /**
   * Month and year CMT valued this property, where they did.
   *
   * The one claim on a property portal in this market that a pure estate agent structurally
   * cannot make, and the thing that makes the agency arm an argument for the valuation arm
   * rather than a distraction from it. Omitted where we did not value it — an unqualified
   * badge on every card would be worth nothing.
   */
  valuedOn?: string;
}

/**
 * Where a fact about a person came from.
 *
 * 'cmt' means CMT publishes it themselves, on cmtrealtors.com or cmtrealtors.co.ke. 'directory'
 * means we found it in a third-party business directory and it has not been confirmed by CMT.
 * The distinction is load-bearing: a directory is good enough to know who to ask about, and not
 * good enough to publish on the firm's own site as fact.
 */
export type SourcedFrom = 'cmt' | 'directory';

/** A professional registration. The number is withheld until CMT confirms it. */
export interface Registration {
  /** Short form, for the schedule: 'RICS', 'SRB', 'ISK'. */
  authority: string;
  authorityFull: string;
  /** What this registration licenses, in plain words. */
  jurisdiction: string;
  /** Post-nominals this registration confers, where it does. */
  postNominals?: string;
  /** Undefined until confirmed — the row renders as pending rather than disappearing. */
  number?: string;
  confirmed: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  /**
   * Directors lead the team page and are rendered larger: the credibility of a valuation
   * practice sits with the people who sign the reports, not with the agents who show the
   * properties. The prototype previously had this exactly inverted.
   */
  rank: 'director' | 'valuer' | 'agent';
  /**
   * Headshots are a client deliverable. Until they arrive we render initials —
   * never a stock photograph of an unrelated person in place of a named colleague.
   */
  photo?: string;
  phone?: string;
  email?: string;
  bio?: string;
  /** Degrees and memberships, as they should be written. */
  qualifications?: string[];
  registrations?: Registration[];
  /**
   * False until CMT confirms the credentials in writing. Name and role still render — those are
   * matters of public record — but no professional credential is published unverified.
   */
  credentialsConfirmed: boolean;
  sourcedFrom: SourcedFrom;
  /** Which practice they sit in. */
  based?: string;
}

export interface Office {
  city: string;
  country: 'Uganda' | 'Kenya';
  role: 'Head office' | 'Branch';
  /** Only the head offices publish a street address. */
  address?: string;
  coords?: [number, number];
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
  /** What CMT did for them, e.g. "Mortgage valuation". Names the job the quote vouches for. */
  instruction?: string;
  /** Year of the instruction, shown beside it. */
  year?: string;
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
   states the scope honestly. See docs/SITE-STRATEGY.md and docs/LAYOUT-SPECS.md A-03.
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

/**
 * A blog post.
 *
 * Shaped by what the Blog pages actually render (docs/LAYOUT-SPECS.md A-07) rather than by
 * what a generic blog post looks like. The index is a ruled list of date, title and a one-line
 * finding; each note carries a single pull figure, which is the number that gets quoted and is
 * most of the reason to publish at all; the note page runs a schedule of key figures down a
 * sticky rail beside the body.
 */
export interface BlogPost {
  slug: string;
  title: string;
  /** The single line shown against the title in the index. Says what was found. */
  finding: string;
  /** Roughly forty words, for the full-width latest-note block. */
  excerpt: string;
  /** Markdown. Paragraphs split on a blank line. */
  body: string;
  /** The number that gets quoted and screenshotted. */
  pullFigure?: string;
  pullCaption?: string;
  /** The sticky rail, set as a schedule. */
  keyFigures: { label: string; value: string }[];
  /** Agent id of whoever wrote it. */
  authorId?: string;
  coverImage?: string;
  coverAlt?: string;
  tags: string[];
  /** ISO date. */
  publishedAt: string;
}

export interface AdvisoryService {
  slug: string;
  name: string;
  /** Who this is for — the 'for:' line in the index. */
  audience: string;
  summary: string;
  deliverables: string[];
}
