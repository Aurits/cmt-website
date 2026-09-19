import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA';

/**
 * Public site chrome, isolated from the admin CMS.
 *
 * Everything under (site) gets the masthead, footer and mobile CTA bar; everything under
 * (admin) gets its own shell instead. Moved out of the root layout so the two can diverge —
 * see src/app/(admin)/admin/layout.tsx.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-14 lg:pb-0">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
