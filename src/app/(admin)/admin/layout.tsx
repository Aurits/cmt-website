import type { Metadata } from 'next';
import { AdminAuthGate } from '@/components/admin/AdminAuthGate';
import { AdminProvider } from '@/lib/admin/store';

export const metadata: Metadata = {
  title: { default: 'CMT Realtors — Admin', template: '%s — CMT Admin' },
  robots: { index: false, follow: false },
};

/**
 * The CMS's own shell, isolated from the public site under the (site) route group — no
 * Header, Footer or StickyMobileCTA here. AdminProvider is mounted only inside this group,
 * so the public pages never pay for the CMS's localStorage read/write. AdminAuthGate decides
 * between the login screen and the sidebar shell — see its own comment for why that check is
 * a frontend-only stand-in rather than real authentication.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminAuthGate>{children}</AdminAuthGate>
    </AdminProvider>
  );
}
