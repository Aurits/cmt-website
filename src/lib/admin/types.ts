import type { Agent, Listing, Partner, Testimonial } from '@/lib/types';

/**
 * CMS-only extensions to the public data shapes.
 *
 * The public site only ever needs to know whether a listing is for sale or to let, and it
 * has no idea of "draft" or "archived" — those are editorial states that only make sense to
 * an admin managing a pipeline of instructions. `status` is additive so an AdminListing is a
 * drop-in superset of the public Listing, and the seed can be produced by spreading a public
 * record and defaulting status to 'published'.
 */
export type ListingStatus = 'published' | 'draft' | 'archived';

export interface AdminListing extends Listing {
  status: ListingStatus;
  updatedAt: string;
}

export interface AdminPartner extends Partner {
  id: string;
  groupId: string;
  order: number;
  verified: boolean;
}

export interface AdminAgent extends Agent {
  /** Listing slugs this person is instructed on. Mirrors Listing.agentId the other way round. */
  assignedListings: string[];
}

export type InquiryType = 'valuation' | 'agent-contact' | 'list-a-property' | 'general';
export type InquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Closed';

export interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  /** Listing slug, where the enquiry came from a property page. */
  listingSlug?: string;
  createdAt: string;
}

export interface AdminSiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: { display: string; href: string };
  email: string;
  whatsapp: string | null;
  address: {
    building: string;
    line1: string;
    street: string;
    city: string;
    country: string;
  };
  nairobiAddress: string;
  hours: { days: string; time: string }[];
  hoursConfirmed: boolean;
  yearsInBusiness: string;
  stats: { value: string; unit: string; label: string }[];
}

export interface AdminTestimonial extends Testimonial {
  id: string;
}

export interface AdminState {
  listings: AdminListing[];
  agents: AdminAgent[];
  partners: AdminPartner[];
  testimonials: AdminTestimonial[];
  inquiries: Inquiry[];
  settings: AdminSiteSettings;
}
