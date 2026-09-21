import { agents, agentById } from '@/data/agents';
import { posts, postBySlug, sortedPosts } from '@/data/blog';
import { listings, listingBySlug, listingsByCategory } from '@/data/listings';
import { partnerGroups } from '@/data/partners';
import { site } from '@/data/site';
import { testimonials } from '@/data/testimonials';
import type { Repository } from '@/lib/data/repository';
import { UnsupportedOperation } from '@/lib/data/repository';

/**
 * The content that is in the repository today, behind the interface.
 *
 * This is not a stub or a placeholder. It is the adapter the site runs on right now, and it will
 * keep working after the Postgres one lands: with no DATABASE_URL set, a fresh clone builds and
 * serves the whole site with no backend at all, which is what keeps CI green and what makes the
 * migration something that can be done one table at a time instead of in one leap.
 *
 * It is read-only, and says so rather than pretending. A CMS pointed at this adapter can render
 * every screen and save nothing, which is exactly the honest description of where the project is
 * until Tuesday.
 */
export const staticRepository: Repository = {
  capabilities: { writes: false },

  listings: {
    async list(filter) {
      let result = filter?.category ? listingsByCategory(filter.category) : listings;
      if (filter?.featured) result = result.filter((listing) => listing.featured);
      return result;
    },
    async bySlug(slug) {
      return listingBySlug[slug] ?? null;
    },
    async upsert() {
      throw new UnsupportedOperation('Saving a listing');
    },
    async remove() {
      throw new UnsupportedOperation('Deleting a listing');
    },
  },

  agents: {
    async list() {
      return agents;
    },
    async byId(id) {
      return agentById[id] ?? null;
    },
    async upsert() {
      throw new UnsupportedOperation('Saving a team member');
    },
    async remove() {
      throw new UnsupportedOperation('Deleting a team member');
    },
  },

  partners: {
    async groups() {
      return partnerGroups;
    },
  },

  testimonials: {
    async list() {
      return testimonials;
    },
  },

  posts: {
    async list() {
      return sortedPosts();
    },
    async bySlug(slug) {
      return postBySlug[slug] ?? null;
    },
    async upsert() {
      throw new UnsupportedOperation('Saving a blog post');
    },
    async remove() {
      throw new UnsupportedOperation('Deleting a blog post');
    },
  },

  inquiries: {
    async create() {
      // Not a silent no-op. A form that appears to send and does not is worse than one that
      // says it cannot, which is what the UI already tells the visitor.
      throw new UnsupportedOperation('Recording an enquiry');
    },
    async list() {
      return [];
    },
    async setStatus() {
      throw new UnsupportedOperation('Updating an enquiry');
    },
  },

  settings: {
    async get() {
      return {
        name: site.name,
        shortName: site.shortName,
        tagline: site.tagline,
        description: site.description,
        phone: { display: site.phone.display, href: site.phone.href },
        email: site.email,
        whatsapp: site.whatsapp,
        address: {
          building: site.address.building,
          line1: site.address.line1,
          street: site.address.street,
          city: site.address.city,
          country: site.address.country,
        },
        nairobiAddress: '',
        hours: site.hours.map((entry) => ({ days: entry.days, time: entry.time })),
        hoursConfirmed: site.hoursConfirmed,
        yearsInBusiness: site.yearsInBusiness,
        stats: [],
      };
    },
  },
};

/** Exported so the seed script and the Postgres adapter can share one source of truth. */
export const staticContent = { agents, listings, partnerGroups, testimonials, posts };
