import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA';
import { site } from '@/data/site';

/**
 * Inter for everything you read and operate; Fraunces for headlines, picking up the tall
 * serif of the CMT wordmark. Both self-hosted through next/font, so no render-blocking
 * request to Google and no layout shift on a slow mobile connection.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: 'website',
    locale: 'en_UG',
  },
};

/** Colours the browser chrome on mobile to match the masthead. */
export const viewport: Viewport = {
  themeColor: '#11341b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * suppressHydrationWarning is deliberately scoped to <html> and <body> only.
     *
     * Browser extensions write their own attributes onto these two elements before React
     * hydrates — Grammarly adds data-gr-ext-installed and data-new-gr-c-s-check-loaded,
     * Scribe adds data-scribe-recorder-ready — and React reports the difference against
     * the server HTML as a hydration mismatch. It is noise from the visitor's browser, not
     * from this app: a clean profile hydrates every route without a warning.
     *
     * React only suppresses attribute and text differences on the element carrying the
     * prop, never on its children, so a genuine mismatch anywhere inside the page is still
     * reported. Do not add this prop further down the tree to quieten a warning — there it
     * would hide a real bug.
     */
    <html lang="en-UG" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
        {/*
          Scroll-revealed sections start hidden and are shown by an observer. Without
          JavaScript that observer never runs, so this pins them visible instead of
          leaving a blank page.
        */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-brand focus:bg-green focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        {/* Bottom padding clears the sticky mobile CTA bar. */}
        <div className="flex min-h-screen flex-col pb-14 lg:pb-0">
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <StickyMobileCTA />
      </body>
    </html>
  );
}
