import type { BlogPost } from '@/lib/types';

/**
 * Market notes.
 *
 * Intentionally empty, for the same reason `testimonials.ts` is.
 *
 * A market note is a claim about what rents are doing, what banks are lending against and which
 * corridors are absorbing stock, published under a valuation firm's name. Inventing one to fill a
 * page would be fabricating market evidence for a practice whose entire argument is that its
 * figures can be checked. It is the single worst thing this site could carry.
 *
 * So /blog renders an honest empty state, the nav item stays out until the first real note
 * exists (see docs/OPEN-ITEMS.md), and the admin at /admin/blog is where CMT writes it. Drop
 * an entry in here and the index, the latest-note band and the note page all light up with no
 * other change.
 */
export const posts: BlogPost[] = [];

export const postBySlug = Object.fromEntries(
  posts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

/** Newest first. The index is chronological and nothing else. */
export function sortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
