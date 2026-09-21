import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/data/adapters/postgres';

/**
 * Sessions, stored rather than self-describing.
 *
 * A signed JWT would save a query and cost the ability to revoke. With a row per session,
 * signing someone out actually signs them out, and so does removing a colleague — which for a
 * tool that edits a client's live website is worth one indexed lookup per request.
 *
 * The cookie carries a random token; the database stores only its SHA-256. A leak of the
 * sessions table therefore hands over nothing usable. Hashing is a plain digest rather than a
 * password KDF on purpose: the token is 32 random bytes, so there is no dictionary to attack and
 * nothing for a slow hash to defend against.
 */
const COOKIE = 'cmt_session';
const LIFETIME_DAYS = 7;
/** Re-issued once a session is more than a day old, so an active editor is not logged out mid-week. */
const REFRESH_AFTER_DAYS = 1;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createSession(
  userId: string,
  context?: { userAgent?: string; ip?: string },
): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + LIFETIME_DAYS * 86_400_000);

  await getDb()
    .insertInto('sessions')
    .values({
      user_id: userId,
      token_hash: hashToken(token),
      expires_at: expires,
      user_agent: context?.userAgent ?? null,
      ip: context?.ip ?? null,
    } as never)
    .execute();

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    // Lax rather than Strict: Strict would drop the cookie when an editor follows a link to the
    // CMS from an email, which reads as a random logout rather than as a security feature.
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

/**
 * The authoritative check. Hits the database, so it belongs in a layout or a server action,
 * never in proxy.ts.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const row = await getDb()
    .selectFrom('sessions')
    .innerJoin('users', 'users.id', 'sessions.user_id')
    .select([
      'sessions.id as session_id',
      'sessions.expires_at',
      'users.id as user_id',
      'users.email',
      'users.full_name',
      'users.role',
      'users.activated_at',
    ])
    .where('sessions.token_hash', '=', hashToken(token))
    .executeTakeFirst();

  if (!row) return null;

  if (new Date(row.expires_at) < new Date()) {
    // Expired rows are cleared on encounter rather than by a cron nobody set up.
    await getDb().deleteFrom('sessions').where('id', '=', row.session_id).execute();
    return null;
  }

  // Invited but never activated is not a usable account.
  if (!row.activated_at) return null;

  const age = Date.now() - (new Date(row.expires_at).getTime() - LIFETIME_DAYS * 86_400_000);
  if (age > REFRESH_AFTER_DAYS * 86_400_000) {
    const expires = new Date(Date.now() + LIFETIME_DAYS * 86_400_000);
    await getDb()
      .updateTable('sessions')
      .set({ expires_at: expires } as never)
      .where('id', '=', row.session_id)
      .execute();
  }

  return {
    id: row.user_id,
    email: row.email,
    name: row.full_name ?? row.email,
    role: row.role as SessionUser['role'],
  };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await getDb().deleteFrom('sessions').where('token_hash', '=', hashToken(token)).execute();
  }
  jar.delete(COOKIE);
}

/** Every session for one person, for "sign out everywhere" and for removing a colleague. */
export async function destroyAllSessions(userId: string): Promise<void> {
  await getDb().deleteFrom('sessions').where('user_id', '=', userId).execute();
}

export const SESSION_COOKIE = COOKIE;
