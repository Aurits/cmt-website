import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

/**
 * The third lock on the CMS, after proxy.ts and the session check in (protected)/layout.tsx.
 *
 * Those two stop a request; this stops the request being made. A crawler that never asks for
 * /admin cannot end up with a login page in a search index, which is how a quiet admin URL stops
 * being quiet.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
