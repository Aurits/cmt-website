import 'server-only';
import { cache } from 'react';
import { buildTeam } from '@/data/agents';
import { categories } from '@/data/categories';
import { citiesOf } from '@/data/listings';
import { site, type SiteInfo } from '@/data/site';
import { buildStats } from '@/data/stats';
import type { AdminBlogPost, AdminListing } from '@/lib/admin/types';
import type { BlogPost, CategorySlug, Listing } from '@/lib/types';
import { UnsupportedOperation, getRepository } from '@/lib/data';

/**
 * What the public pages read. Everything here goes through the repository, so the same page shows
 * the files in src/data on a machine with no database and whatever staff saved in the CMS once
 * DATABASE_URL is set. Nothing on the public side imports a CMS-managed list from src/data
 * directly any more; if a page needs one, it asks here.
 *
 * Each getter is wrapped in React's `cache`, so a page and the layout around it can both ask for
 * the listings and the database is queried once per render, not once per caller.
 *
 * The CMS writes revalidate the paths they affect (src/lib/admin/actions.ts), which is what makes
 * an edit appear on the site without a rebuild.
 *
 * The office's contact facts (phone, email, WhatsApp, address, hours) come from here too, via
 * getSite. Server components await it; client components read the same object from SiteProvider,
 * which the site layout fills once per request.
 */

/** The admin fields mean nothing on the public side, and should not travel to the browser. */
function publicListing(listing: AdminListing): Listing {
  const { status, updatedAt, ...rest } = listing;
  void status;
  void updatedAt;
  return rest;
}

function publicPost(post: AdminBlogPost): BlogPost {
  const { status, updatedAt, ...rest } = post;
  void status;
  void updatedAt;
  return rest;
}

/** Published listings only: the repository never returns drafts unless asked to. */
export const getListings = cache(async (): Promise<Listing[]> => {
  const repository = await getRepository();
  return (await repository.listings.list()).map(publicListing);
});

export const getListing = cache(async (slug: string): Promise<Listing | null> => {
  const repository = await getRepository();
  const listing = await repository.listings.bySlug(slug);
  return listing && listing.status === 'published' ? publicListing(listing) : null;
});

export const getTeam = cache(async () => {
  const repository = await getRepository();
  return buildTeam(await repository.agents.list());
});

/**
 * The firm's public facts: src/data/site.ts, with whatever staff have saved on the CMS settings
 * screen laid over it. Only the fields the CMS edits are replaced; the rest (regulator, cities,
 * map position, social links) stay as the file has them. With no settings row yet (a database
 * that has not been seeded), the file is used as it stands.
 */
export const getSite = cache(async (): Promise<SiteInfo> => {
  const base = site as unknown as SiteInfo;
  let settings;
  try {
    settings = await (await getRepository()).settings.get();
  } catch (error) {
    if (error instanceof UnsupportedOperation) return base;
    throw error;
  }
  return {
    ...base,
    name: settings.name || base.name,
    shortName: settings.shortName || base.shortName,
    tagline: settings.tagline || base.tagline,
    description: settings.description || base.description,
    phone: settings.phone.display ? settings.phone : base.phone,
    email: settings.email || base.email,
    whatsapp: settings.whatsapp || null,
    address: { ...base.address, ...settings.address },
    hours: settings.hours.length ? settings.hours : base.hours,
    hoursConfirmed: settings.hoursConfirmed,
    yearsInBusiness: settings.yearsInBusiness || base.yearsInBusiness,
  };
});

/** The four figures under the homepage headline, on /about and in the About menu. */
export const getStats = cache(async () => {
  const [team, info] = await Promise.all([getTeam(), getSite()]);
  return buildStats(team.signatories.length, info.yearsInBusiness);
});

export const getPartnerGroups = cache(async () => (await getRepository()).partners.groups());

export const getPartners = cache(async () =>
  (await getPartnerGroups()).flatMap((group) => group.partners),
);

export const getTestimonials = cache(async () => (await getRepository()).testimonials.list());

/** Newest first. Published only. */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const repository = await getRepository();
  return (await repository.posts.list())
    .filter((post) => post.status === 'published')
    .map(publicPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const repository = await getRepository();
  const post = await repository.posts.bySlug(slug);
  return post && post.status === 'published' ? publicPost(post) : null;
});

/**
 * The few numbers the masthead menus print. Computed on the server and handed to the header as
 * plain data, so the browser receives five counts rather than the whole listing file.
 */
export const getNavFacts = cache(async () => {
  const [listings, stats] = await Promise.all([getListings(), getStats()]);
  return {
    listingTotal: listings.length,
    cityTotal: citiesOf(listings).length,
    byCategory: Object.fromEntries(
      categories.map((category) => [
        category.slug,
        listings.filter((listing) => listing.category === category.slug).length,
      ]),
    ) as Record<CategorySlug, number>,
    stats,
  };
});

export type NavFacts = Awaited<ReturnType<typeof getNavFacts>>;
