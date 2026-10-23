'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { CONTENT_TAG } from '@/lib/cache-tags';
import { getRepository } from '@/lib/data';
import { requireStaff } from '@/lib/auth';
import type {
  AdminBlogPost,
  AdminListing,
  AdminPartner,
  AdminSiteSettings,
  AdminState,
  AdminTestimonial,
  InquiryStatus,
} from '@/lib/admin/types';

/**
 * Everything the CMS can change.
 *
 * Two rules, and they are the whole security model now that row level security is not the primary
 * control (docs/portability.md section 4):
 *
 * 1. EVERY function here calls requireStaff() first. Not the caller, not the page, here. A server
 *    action is a public HTTP endpoint with a generated name; being unreachable from the UI is not
 *    the same as being unreachable. If a mutation is added below without that first line, the CMS
 *    is open.
 * 2. Nothing here trusts the client for authorisation. The session is read server-side from a
 *    cookie the browser cannot script.
 *
 * Every write revalidates the public paths it could have changed, which is what makes an edit in
 * the CMS show up on a statically generated page without a redeploy.
 */

async function repo() {
  await requireStaff();
  return getRepository();
}

/**
 * After any save that changes public content: expire the cached reads at once (src/lib/content.ts
 * keeps them for five minutes otherwise) and refresh every page, prerendered or not. Layout-wide,
 * because almost every list shows up in more than one place: the masthead menus count listings and
 * valuers on every page, and the client logos appear on the homepage, /valuations and /about/clients.
 * `{ expire: 0 }` means the next visitor waits for fresh data rather than being served the old.
 */
function publish() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
}

/** The whole CMS state in one read, for the admin layout to hand to the provider. */
export async function loadAdminState(): Promise<AdminState> {
  await requireStaff();
  const data = await getRepository();

  const [listings, agents, partners, testimonials, posts, inquiries, settings] = await Promise.all([
    data.listings.list({ includeUnpublished: true }),
    data.agents.list(),
    data.partners.listForAdmin(),
    data.testimonials.listForAdmin(),
    data.posts.list({ includeUnpublished: true }),
    data.inquiries.list(),
    data.settings.get(),
  ]);

  return {
    listings,
    // assignedListings is derived here rather than stored, so it cannot drift from the listings
    // themselves. See the note on AdminAgent.
    agents: agents.map((agent) => ({
      ...agent,
      assignedListings: listings
        .filter((listing) => listing.agentId === agent.id)
        .map((listing) => listing.slug),
    })),
    partners,
    testimonials,
    posts,
    inquiries,
    settings,
  };
}

/* ── listings ───────────────────────────────────────────────────────────────────────────── */

export async function saveListing(listing: AdminListing): Promise<void> {
  const data = await repo();
  await data.listings.upsert(listing);
  publish();
}

export async function removeListing(slug: string, category: string): Promise<void> {
  const data = await repo();
  await data.listings.remove(slug);
  void category; // kept in the signature for the callers
  publish();
}

/* ── team ───────────────────────────────────────────────────────────────────────────────── */

export async function saveAgent(agent: Parameters<
  Awaited<ReturnType<typeof getRepository>>['agents']['upsert']
>[0]): Promise<void> {
  const data = await repo();
  await data.agents.upsert(agent);
  publish();
}

export async function removeAgent(id: string): Promise<void> {
  const data = await repo();
  await data.agents.remove(id);
  publish();
}

/* ── clients ────────────────────────────────────────────────────────────────────────────── */

export async function savePartner(partner: AdminPartner): Promise<void> {
  const data = await repo();
  await data.partners.upsert(partner);
  publish();
}

export async function removePartner(id: string): Promise<void> {
  const data = await repo();
  await data.partners.remove(id);
  publish();
}

/* ── testimonials ───────────────────────────────────────────────────────────────────────── */

export async function saveTestimonial(testimonial: AdminTestimonial): Promise<void> {
  const data = await repo();
  await data.testimonials.upsert(testimonial);
  publish();
}

export async function removeTestimonial(id: string): Promise<void> {
  const data = await repo();
  await data.testimonials.remove(id);
  publish();
}

/* ── blog ───────────────────────────────────────────────────────────────────────────────── */

export async function savePost(post: AdminBlogPost): Promise<void> {
  const data = await repo();
  await data.posts.upsert(post);
  publish();
}

export async function removePost(slug: string): Promise<void> {
  const data = await repo();
  await data.posts.remove(slug);
  publish();
}

/* ── enquiries ──────────────────────────────────────────────────────────────────────────── */

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const data = await repo();
  await data.inquiries.setStatus(id, status);
  // Nothing public shows an enquiry, so nothing to revalidate.
}

/* ── settings ───────────────────────────────────────────────────────────────────────────── */

export async function saveSettings(settings: AdminSiteSettings): Promise<void> {
  const data = await repo();
  await data.settings.update(settings);
  publish();
}
