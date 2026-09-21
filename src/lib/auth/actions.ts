'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/data/adapters/postgres';
import { hashPassword, needsRehash, verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession } from '@/lib/auth/session';

export interface SignInState {
  error?: string;
}

/*
 * Per-process throttle on failed sign-ins.
 *
 * Honest about what it is: one instance's memory, so it resets on redeploy and does nothing
 * across several instances. It raises the cost of a naive script and no more. A real limiter
 * belongs at the edge or in a table, and is on the list rather than pretended at here. Sign-in
 * already costs ~300ms of scrypt, which is itself most of the defence against volume.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 10 * 60_000;

function throttled(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;
  if (Date.now() > record.until) {
    attempts.delete(key);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const record = attempts.get(key) ?? { count: 0, until: Date.now() + LOCKOUT_MS };
  record.count += 1;
  record.until = Date.now() + LOCKOUT_MS;
  attempts.set(key, record);
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Enter your email address and password.' };
  if (throttled(email)) {
    return { error: 'Too many attempts. Wait ten minutes and try again.' };
  }

  const db = getDb();
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();

  /*
   * One message for every failure, and the hash is computed even when the account does not
   * exist. Otherwise the response time tells an attacker which email addresses are real, which
   * for a firm whose staff are named on the public site is a short list to guess from.
   */
  const stored = user?.password_hash ?? (await hashPassword('no-such-account'));
  const ok = await verifyPassword(password, stored);

  if (!user || !ok || !user.activated_at) {
    recordFailure(email);
    return { error: 'That email address and password do not match an active account.' };
  }

  attempts.delete(email);

  if (needsRehash(user.password_hash)) {
    await db
      .updateTable('users')
      .set({ password_hash: await hashPassword(password) } as never)
      .where('id', '=', user.id)
      .execute();
  }

  const headerList = await headers();
  await createSession(user.id, {
    userAgent: headerList.get('user-agent') ?? undefined,
    ip: headerList.get('x-forwarded-for')?.split(',')[0]?.trim(),
  });

  await db
    .updateTable('users')
    .set({ last_login_at: new Date() } as never)
    .where('id', '=', user.id)
    .execute();

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}
