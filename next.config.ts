import type { NextConfig } from "next";

/**
 * Old routes keep working.
 *
 * /services split into /valuations and /advisory, and /clients moved under /about when the
 * navigation was restructured (SITE-STRATEGY.md §4). These are permanent redirects because the
 * old paths were live on the prototype and may be linked. The broader SEO migration from the
 * WordPress site is a later phase — PLAN.md §13 — and is where /listings is revisited.
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
  },

  async redirects() {
    return [
      { source: "/services", destination: "/valuations", permanent: true },
      { source: "/clients", destination: "/about/clients", permanent: true },
    ];
  },
};

export default nextConfig;
