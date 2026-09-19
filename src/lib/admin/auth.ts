/**
 * Frontend-only session flag. There is no backend this phase — see AGENTS.md/README.md —
 * so this is not real authentication: it exists so the CMS has a login screen and a gate to
 * design against, and so the shape of the check (a redirect to /admin/login when absent) is
 * already in place for when a real session cookie/token replaces it. The login page itself
 * accepts any username and password, and also offers an explicit bypass, because enforcing a
 * password with no server to check it against would be theatre rather than security.
 */
const AUTH_KEY = 'cmt-admin-authed';
const USER_KEY = 'cmt-admin-user';

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function signIn(username: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_KEY, 'true');
    window.localStorage.setItem(USER_KEY, username.trim() || 'Guest admin');
  } catch {
    /* private browsing or storage disabled — session just won't persist across a reload */
  }
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* nothing to clean up if storage was never writable */
  }
}

export function currentAdminUser(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(USER_KEY) ?? '';
  } catch {
    return '';
  }
}
