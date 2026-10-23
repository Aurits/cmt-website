import type { NextConfig } from "next";

/**
 * Old routes keep working.
 *
 * /services split into /valuations and /advisory, and /clients moved under /about when the
 * navigation was restructured (site-strategy.md §4). These are permanent redirects because the
 * old paths were live on the prototype and may be linked. The broader SEO migration from the
 * WordPress site is a later phase — plan.md §13 — and is where /listings is revisited.
 */
/*
 * next/image refuses any remote host that is not listed here, silently, with no error in the
 * console and no broken-image icon in most browsers. It is the most common way an image pipeline
 * appears to work in development and serves nothing in production, so the host is added the day
 * the bucket is created rather than at cutover.
 *
 * Derived from S3_ENDPOINT so there is one place to change the vendor. Supabase serves public
 * objects from <ref>.supabase.co while the S3 API lives on <ref>.storage.supabase.co, so both
 * are allowed: the first is what the site links to, the second is what a signed URL would use.
 */
function bucketPatterns() {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) return [];
  try {
    const host = new URL(endpoint).hostname;
    const hosts = new Set([host, host.replace('.storage.', '.')]);
    return [...hosts].map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/storage/v1/object/public/**',
    }));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: bucketPatterns(),
    /*
     * Optimised images are kept for 31 days. Safe because an upload never changes in place: the
     * CMS names every file with a fresh uuid (lib/admin/upload.ts), so a new photograph is a new
     * URL rather than a stale copy of an old one.
     */
    minimumCacheTTL: 2_678_400,
  },

  experimental: {
    /*
     * The browser's own page cache (Next's client router cache). A page a visitor has already
     * opened is reused for this long when they come back to it, so back-and-forth between the
     * listings and a property, or between About pages, is instant and costs the server nothing.
     * `dynamic` covers the pages rendered on request (listings with filters, contact), `static`
     * the prerendered ones. Short enough that a CMS edit reaches a visitor within a minute or
     * five; the admin is unaffected in practice, because every save calls router.refresh().
     */
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },

  /*
   * The photographs and brand files bundled in /public change only with a deploy. A day in the
   * browser and a week of stale-while-revalidate means repeat visits fetch nothing, and a new
   * deploy is picked up within a day at most.
   */
  async headers() {
    return ['/images/:path*', '/brand/:path*'].map((source) => ({
      source,
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ],
    }));
  },

  async redirects() {
    return [
      { source: "/services", destination: "/valuations", permanent: true },
      { source: "/clients", destination: "/about/clients", permanent: true },
    ];
  },
};

export default nextConfig;
