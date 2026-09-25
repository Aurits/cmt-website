/**
 * The session cookie's name, and nothing else in this file.
 *
 * It has to be known in two places that cannot share much: src/proxy.ts, which checks for the
 * cookie before a request reaches the app, and src/lib/auth/session.ts, which sets and reads it.
 * session.ts pulls in next/headers and a database connection, none of which belongs anywhere near
 * the proxy, so the constant lives here on its own where both can import it without dragging the
 * rest along. It was duplicated as a literal in both files until this existed.
 */
export const SESSION_COOKIE = 'cmt_session';
