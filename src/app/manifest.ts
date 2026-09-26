import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/**
 * Web app manifest — what Android uses when someone adds the site to their home screen.
 * Icons come from scripts/prepare-icons.mjs; the maskable one is the C alone, because
 * Android crops maskable icons to a circle and the wordmark would lose its ends.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // The name shown under the icon when the site is installed on a phone: the firm, nothing more.
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ec',
    theme_color: '#11341b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
