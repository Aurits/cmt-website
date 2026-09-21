import 'server-only';
import { redirect } from 'next/navigation';
import { getSessionUser, type SessionUser } from '@/lib/auth/session';

export type { SessionUser } from '@/lib/auth/session';

/**
 * The gate every admin page sits behind.
 *
 * proxy.ts turns away requests with no session cookie, which is cheap and keeps the admin out of
 * a crawler's reach, but a cookie is only a claim. This is the check that asks the database
 * whether the session is real, unexpired and attached to an activated account, and it is what
 * actually protects anything.
 */
export async function requireStaff(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  return user;
}

/** For places that want to vary rather than refuse, like showing a name in the topbar. */
export async function currentUser(): Promise<SessionUser | null> {
  return getSessionUser();
}
