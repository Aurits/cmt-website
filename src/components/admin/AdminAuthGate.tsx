'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { currentAdminUser, isAuthed } from '@/lib/admin/auth';

const LOGIN_PATH = '/admin/login';

/**
 * The gate between /admin/login and everywhere else under (admin). The login route itself
 * passes straight through — it has no sidebar to show and nothing to check yet — every other
 * admin route waits for a client-side read of the session flag (localStorage does not exist
 * on the server) before deciding whether to render the shell or send the visitor to sign in.
 */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'authed' | 'anonymous'>('checking');
  const [adminEmail, setAdminEmail] = useState('');

  const isLoginRoute = pathname === LOGIN_PATH;

  useEffect(() => {
    if (isLoginRoute) return;
    // One-time read of an external store (localStorage) that cannot exist during SSR —
    // see the identical rationale on the effect in lib/admin/store.tsx.
    if (isAuthed()) {
      setAdminEmail(currentAdminUser()); // eslint-disable-line react-hooks/set-state-in-effect
      setState('authed');
    } else {
      setState('anonymous');
      router.replace(LOGIN_PATH);
    }
  }, [pathname, isLoginRoute, router]);

  if (isLoginRoute) return <>{children}</>;

  if (state !== 'authed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-body text-muted">
          {state === 'checking' ? 'Checking admin session…' : 'Redirecting to sign in…'}
        </p>
      </div>
    );
  }

  return <AdminShell adminEmail={adminEmail || 'Guest admin'}>{children}</AdminShell>;
}
