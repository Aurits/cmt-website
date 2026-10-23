import 'server-only';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { buildTeam } from '@/data/agents';
import { categories } from '@/data/categories';
import { citiesOf } from '@/data/listings';
import { site, type SiteInfo } from '@/data/site';
import { buildStats } from '@/data/stats';
import type { AdminBlogPost, AdminListing } from '@/lib/admin/types';
import type { BlogPost, CategorySlug, Listing } from '@/lib/types';
import { CONTENT_REVALIDATE, CONTENT_TAG } from '@/lib/cache-tags';
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
 * TWO CACHES. React's `cache` (above) shares one read within a single request. Under it,
 * `stored()` keeps each database read in Next's data cache for five minutes, shared by every
 * visitor and every page, tagged `content`. Pages that render on request (the listings with their
 * filters, the contact forms) then cost no database round trip at all for most visitors, which is
 * both speed and headroom under the session pooler's 15-connection cap. Every CMS save expires
 * the tag (src/lib/admin/actions.ts), so an edit is on the site at the very next request; the
 * five minutes only matters for changes made outside the CMS.
 *
 * A single listing or post is found in the cached list rather than queried on its own, so a
 * property page is free once the list is warm.
 *
 * The CMS writes also revalidate the paths they affect, which is what refreshes the pages that
 * were prerendered at build time.
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

/** A database read kept in the shared data cache for five minutes, under the `content` tag. */
function stored<T>(key: string, read: () => Promise<T>): () => Promise<T> {
  return unstable_cache(read, ['content', key], {
    revalidate: CONTENT_REVALIDATE,
    tags: [CONTENT_TAG],
  });
}

const storedListings = stored('listings', async () =>
  (await (await getRepository()).listings.list()).map(publicListing),
);
const storedAgents = stored('agents', async () => (await getRepository()).agents.list());
/** null when there is no settings row (an unseeded database): the file's values are used then. */
const storedSettings = stored('settings', async () => {
  try {
    return await (await getRepository()).settings.get();
  } catch (error) {
    if (error instanceof UnsupportedOperation) return null;
    throw error;
  }
});
const storedPartnerGroups = stored('partner-groups', async () =>
  (await getRepository()).partners.groups(),
);
const storedTestimonials = stored('testimonials', async () =>
  (await getRepository()).testimonials.list(),
);
const storedPosts = stored('posts', async () =>
  (await (await getRepository()).posts.list())
    .filter((post) => post.status === 'published')
    .map(publicPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
);

/** Published listings only: the repository never returns drafts unless asked to. */
export const getListings = cache(async (): Promise<Listing[]> => storedListings());

export const getListing = cache(
  async (slug: string): Promise<Listing | null> =>
    (await getListings()).find((listing) => listing.slug === slug) ?? null,
);

export const getTeam = cache(async () => buildTeam(await storedAgents()));

/**
 * The firm's public facts: src/data/site.ts, with whatever staff have saved on the CMS settings
 * screen laid over it. Only the fields the CMS edits are replaced; the rest (regulator, cities,
 * map position, social links) stay as the file has them. With no settings row yet (a database
 * that has not been seeded), the file is used as it stands.
 */
export const getSite = cache(async (): Promise<SiteInfo> => {
  const base = site as unknown as SiteInfo;
  const settings = await storedSettings();
  if (!settings) return base;
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

export const getPartnerGroups = cache(async () => storedPartnerGroups());

export const getPartners = cache(async () =>
  (await getPartnerGroups()).flatMap((group) => group.partners),
);

export const getTestimonials = cache(async () => storedTestimonials());

/** Newest first. Published only. */
export const getPosts = cache(async (): Promise<BlogPost[]> => storedPosts());

export const getPost = cache(
  async (slug: string): Promise<BlogPost | null> =>
    (await getPosts()).find((post) => post.slug === slug) ?? null,
);

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
