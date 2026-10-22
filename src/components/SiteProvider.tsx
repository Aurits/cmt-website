'use client';

import { createContext, useContext } from 'react';
import { site, type SiteInfo } from '@/data/site';

/**
 * The firm's contact facts for client components (the masthead, the menus, the forms).
 *
 * Server components read the same object with `await getSite()` (src/lib/content.ts); the site
 * layout reads it once and hands it down through this provider, so a phone number changed on the
 * CMS settings screen reaches every button and form on the site, not only the server-rendered
 * ones. The default is the file's own values, for anything rendered outside the provider.
 */
const SiteContext = createContext<SiteInfo>(site as unknown as SiteInfo);

export function SiteProvider({ value, children }: { value: SiteInfo; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteInfo {
  return useContext(SiteContext);
}
