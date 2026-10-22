import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA';
import { SiteProvider } from '@/components/SiteProvider';
import { getNavFacts, getSite } from '@/lib/content';

/**
 * Public site chrome, isolated from the admin CMS.
 *
 * Everything under (site) gets the masthead, footer and mobile CTA bar; everything under
 * (admin) gets its own shell instead. Moved out of the root layout so the two can diverge —
 * see src/app/(admin)/admin/layout.tsx.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // The listing counts and figures the masthead menus print, read here on the server so the
  // header (a client component) receives numbers rather than the data they are counted from.
  const [facts, info] = await Promise.all([getNavFacts(), getSite()]);

  return (
    // The office's contact facts, CMS-edited, for every client component below (SiteProvider.tsx).
    <SiteProvider value={info}>
      <div className="flex min-h-screen flex-col pb-[var(--mobile-cta-h)] lg:pb-0">
        <Header facts={facts} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyMobileCTA />
      </div>
    </SiteProvider>
  );
}
