import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/cookie';

/**
 * The admin is not public.
 *
 * Next 16 renamed `middleware` to `proxy`; the behaviour is the same and the old filename is
 * deprecated.
 *
 * This checks only that a session cookie is present. It does not open a database connection, and
 * deliberately so: the documentation is explicit that proxy may be deployed away from the
 * application and should not rely on shared modules, so anything authoritative belongs in the
 * admin layout, which calls requireStaff(). A cookie here is a claim, not proof.
 *
 * What this does buy is worth having on its own. Thirteen admin routes stop being served to
 * anyone who types the URL, including crawlers, before any React renders, so the CMS never
 * appears in a search index and an unauthenticated request never costs a database round trip.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The login page has to stay reachable, or there is no way back in.
  if (pathname === '/admin/login') return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    // Remember where they were going, so signing in does not dump them on the dashboard.
    url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
