/**
 * The cache tag on every public content read (src/lib/content.ts). The CMS actions expire it on
 * each save (src/lib/admin/actions.ts), so an edit is on the site at the next request. In its own
 * file because the actions are a "use server" module, which may only export async functions.
 */
export const CONTENT_TAG = 'content';

/** How long a cached read is trusted before it is refreshed in the background, in seconds. */
export const CONTENT_REVALIDATE = 300;
