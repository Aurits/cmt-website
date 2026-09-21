import type {
  Agent,
  BlogPost,
  CategorySlug,
  Listing,
  PartnerGroup,
  Testimonial,
} from '@/lib/types';
import type { AdminSiteSettings, Inquiry, InquiryStatus } from '@/lib/admin/types';

/**
 * The only way anything reaches stored content.
 *
 * One rule makes the whole portability argument work, and it is worth stating plainly because it
 * is the rule that gets broken first when someone is in a hurry:
 *
 *   NOTHING OUTSIDE src/lib/data OPENS A CONNECTION.
 *
 * Not a page, not a component, not a route handler. Everything goes through this interface. That
 * is what makes swapping Postgres hosts, or leaving one entirely, a matter of writing one file in
 * adapters/ rather than auditing the application. It is also what carries the access rules now
 * that row level security is not the primary control: the repository is the boundary, and it is
 * small enough to review in an afternoon. See docs/PORTABILITY.md section 4.
 *
 * Reads are what the public site needs. Writes are what the CMS needs. They sit on one interface
 * because they hit one store, but an adapter is free to reject writes — the static adapter does
 * exactly that.
 */

export interface ListingFilter {
  category?: CategorySlug;
  featured?: boolean;
  /** Admin only. The public site never sees anything but published. */
  includeUnpublished?: boolean;
}

export interface Repository {
  /** What this adapter can actually do, so callers and the admin can say so honestly. */
  readonly capabilities: { readonly writes: boolean };

  listings: {
    list(filter?: ListingFilter): Promise<Listing[]>;
    bySlug(slug: string): Promise<Listing | null>;
    upsert(listing: Listing): Promise<void>;
    remove(slug: string): Promise<void>;
  };

  agents: {
    list(): Promise<Agent[]>;
    byId(id: string): Promise<Agent | null>;
    upsert(agent: Agent): Promise<void>;
    remove(id: string): Promise<void>;
  };

  partners: {
    groups(): Promise<PartnerGroup[]>;
  };

  testimonials: {
    list(): Promise<Testimonial[]>;
  };

  posts: {
    list(options?: { includeUnpublished?: boolean }): Promise<BlogPost[]>;
    bySlug(slug: string): Promise<BlogPost | null>;
    upsert(post: BlogPost): Promise<void>;
    remove(slug: string): Promise<void>;
  };

  inquiries: {
    /** Public. The forms call this and nothing else. */
    create(inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<void>;
    /** Staff only. Never reachable from an unauthenticated path. */
    list(): Promise<Inquiry[]>;
    setStatus(id: string, status: InquiryStatus): Promise<void>;
  };

  settings: {
    get(): Promise<AdminSiteSettings>;
  };
}

/** Thrown by an adapter asked to do something it cannot. Never swallowed silently. */
export class UnsupportedOperation extends Error {
  constructor(operation: string) {
    super(
      `${operation} is not supported by the current data adapter. ` +
        'Set DATABASE_URL to use the Postgres adapter.',
    );
    this.name = 'UnsupportedOperation';
  }
}
