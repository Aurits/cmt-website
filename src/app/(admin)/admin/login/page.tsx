'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/fields';
import { signIn, type SignInState } from '@/lib/auth/actions';
import { site } from '@/data/site';

/**
 * The CMS's front door, and now a real one.
 *
 * It used to accept any username and offer an explicit bypass, which was the honest thing to do
 * while there was no server to check a password against. There is one now, so both are gone.
 *
 * A server action rather than a fetch: the password never touches client state, the session
 * cookie is set httpOnly where script cannot read it, and the form still submits if the bundle
 * fails to load. Errors come back as a value rather than a thrown exception, deliberately — a
 * failed sign-in is an ordinary outcome, not an exception.
 */
export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-green px-4 py-12">
      <div className="w-full max-w-[420px] border-t-2 border-gold bg-paper p-8">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/brand/cmt-logo.png"
            alt={site.name}
            width={900}
            height={431}
            className="h-12 w-auto"
          />
          <h1 className="mt-5 font-display text-h3 text-green">Admin sign in</h1>
          <p className="mt-1.5 text-micro text-muted">Content management, not the public site.</p>
        </div>

        <form className="mt-7 grid gap-5" action={action}>
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="username"
            placeholder="you@cmtrealtors.com"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {state.error && (
            <p
              role="alert"
              className="border-l-[3px] border-flag bg-flag/10 px-3 py-2 text-micro text-flag"
            >
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
            {pending ? 'Checking…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
