'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/fields';
import { signIn } from '@/lib/admin/auth';
import { site } from '@/data/site';

/**
 * The CMS's front door. There is no backend this phase — see AGENTS.md/README.md — so this
 * accepts any username and password rather than pretending to check one: the point of this
 * screen is the gate and the session flag it sets (see lib/admin/auth.ts), which a real
 * sign-in endpoint slots behind later without changing how the rest of the admin reads
 * "am I signed in". The bypass link says the same thing out loud instead of hiding it.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const enter = (name: string) => {
    signIn(name);
    router.replace('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green px-4 py-12">
      <div className="w-full max-w-[420px] rounded-brand border-t-2 border-gold bg-paper p-8">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/cmt-logo.png" alt={site.name} width={900} height={431} className="h-12 w-auto" />
          <h1 className="mt-5 font-display text-h3 text-green">Admin sign in</h1>
          <p className="mt-1.5 text-micro text-muted">Content management, not the public site.</p>
        </div>

        <form
          className="mt-7 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            enter(username);
          }}
        >
          <TextField
            id="username"
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Sign in
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-micro uppercase tracking-[0.1em] text-muted">
          <span className="h-px flex-1 bg-rule" />
          or
          <span className="h-px flex-1 bg-rule" />
        </div>

        <Button type="button" variant="outline" size="md" fullWidth onClick={() => enter('Guest admin')}>
          Continue without signing in
        </Button>

        <p className="mt-5 text-center text-micro leading-relaxed text-muted">
          Prototype only: any username and password are accepted. Real authentication is a
          backend concern, added when this CMS is wired to one.
        </p>
      </div>
    </div>
  );
}
