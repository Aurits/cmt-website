import type { NextConfig } from "next";

/**
 * Old routes keep working.
 *
 * /services split into /valuations and /advisory, and /clients moved under /about when the
 * navigation was restructured (SITE-STRATEGY.md §4). These are permanent redirects because the
 * old paths were live on the prototype and may be linked. The broader SEO migration from the
 * WordPress site is a later phase — Plan.md §13 — and is where /listings is revisited.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/services", destination: "/valuations", permanent: true },
      { source: "/clients", destination: "/about/clients", permanent: true },
    ];
  },
};

export default nextConfig;
