'use server';

import { revalidatePath } from 'next/cache';
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
 * control (docs/PORTABILITY.md section 4):
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
  revalidatePath('/listings');
  revalidatePath(`/listings/${listing.category}`);
  revalidatePath(`/properties/${listing.slug}`);
  revalidatePath('/');
}

export async function removeListing(slug: string, category: string): Promise<void> {
  const data = await repo();
  await data.listings.remove(slug);
  revalidatePath('/listings');
  revalidatePath(`/listings/${category}`);
  revalidatePath('/');
}

/* ── team ───────────────────────────────────────────────────────────────────────────────── */

export async function saveAgent(agent: Parameters<
  Awaited<ReturnType<typeof getRepository>>['agents']['upsert']
>[0]): Promise<void> {
  const data = await repo();
  await data.agents.upsert(agent);
  revalidatePath('/about/people');
  revalidatePath('/about');
  revalidatePath('/about/credentials');
}

export async function removeAgent(id: string): Promise<void> {
  const data = await repo();
  await data.agents.remove(id);
  revalidatePath('/about/people');
  revalidatePath('/about');
}

/* ── clients ────────────────────────────────────────────────────────────────────────────── */

export async function savePartner(partner: AdminPartner): Promise<void> {
  const data = await repo();
  await data.partners.upsert(partner);
  revalidatePath('/about/clients');
  revalidatePath('/');
}

export async function removePartner(id: string): Promise<void> {
  const data = await repo();
  await data.partners.remove(id);
  revalidatePath('/about/clients');
  revalidatePath('/');
}

/* ── testimonials ───────────────────────────────────────────────────────────────────────── */

export async function saveTestimonial(testimonial: AdminTestimonial): Promise<void> {
  const data = await repo();
  await data.testimonials.upsert(testimonial);
  revalidatePath('/about/clients');
}

export async function removeTestimonial(id: string): Promise<void> {
  const data = await repo();
  await data.testimonials.remove(id);
  revalidatePath('/about/clients');
}

/* ── blog ───────────────────────────────────────────────────────────────────────────────── */

export async function savePost(post: AdminBlogPost): Promise<void> {
  const data = await repo();
  await data.posts.upsert(post);
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
}

export async function removePost(slug: string): Promise<void> {
  const data = await repo();
  await data.posts.remove(slug);
  revalidatePath('/blog');
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
  // Settings appear in the header, the footer and the contact page, so on every page.
  revalidatePath('/', 'layout');
}
