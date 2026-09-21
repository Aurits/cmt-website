import { AdminShell } from '@/components/admin/AdminShell';
import { AdminProvider } from '@/lib/admin/store';
import { requireStaff } from '@/lib/auth';

/**
 * Everything behind the login.
 *
 * `(protected)` is a route group, so it adds nothing to any URL: /admin still serves
 * (protected)/page.tsx. Its only job is to draw a line that /admin/login sits outside of, which
 * is what lets this layout call requireStaff() unconditionally instead of trying to work out
 * which route it is rendering.
 *
 * This is the authoritative check. proxy.ts already turned away anyone with no session cookie,
 * but a cookie is a claim: this is where the database says whether the session exists, has not
 * expired, and belongs to an activated account. It runs on the server, so admin HTML is never
 * sent to someone who should not have it — which the client-side gate this replaces could not
 * promise, because by the time it ran the page had already been delivered.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();

  return (
    <AdminProvider>
      <AdminShell adminEmail={user.email}>{children}</AdminShell>
    </AdminProvider>
  );
}
