'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Keeps a screen current while it is open: re-reads the CMS state from the server when the screen
 * mounts, when the tab regains focus, and every `seconds` while it is visible. Used where things
 * arrive from outside the CMS (enquiries from the public forms), so a new one shows up without a
 * reload. Renders nothing.
 */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };
    refresh();
    const timer = window.setInterval(refresh, seconds * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router, seconds]);

  return null;
}
