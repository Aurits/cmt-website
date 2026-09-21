import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'CMT Realtors — Admin', template: '%s — CMT Admin' },
  // Belt and braces with proxy.ts and robots.txt. A CMS has no business in a search index.
  robots: { index: false, follow: false },
};

/**
 * Metadata only. The authentication gate lives one level down in (protected), so that
 * /admin/login can sit under the same URL prefix without being behind the thing it exists to
 * get you through.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
