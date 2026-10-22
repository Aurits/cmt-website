import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';

/**
 * Fraunces for headlines, Inter for everything you read and operate: the pairing the client's
 * hero design (Hero.html, October 2026) is set in, adopted as specified. Both self-hosted through
 * next/font, so no render-blocking request to Google and no layout shift on a slow connection.
 *
 * Fraunces carries an optical-size axis, so the same family draws finer at hero size and
 * sturdier in a card title. Inter keeps true tabular figures for the prices and the ledger.
 */
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-face',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: {
    // A vertical bar, not an em dash: the standard separator in a tab or a search result, and the
    // site keeps em dashes out of anything a visitor reads.
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    type: 'website',
    locale: 'en_UG',
  },
};

/** Colours the browser chrome on mobile to match the masthead. */
export const viewport: Viewport = {
  themeColor: '#0f2a1a',
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
    /*
     * The font variables go on <html>, not <body>, and this is load-bearing. Tailwind emits the
     * theme tokens (--font-sans: var(--font-sans-face), --font-display: var(--font-display-face)) on
     * :root, and a custom property resolves its var() where it is DECLARED. With the next/font
     * variables on <body>, :root had no font variable to point at, both tokens resolved to
     * empty, and every page silently fell back to the system font stack: the site shipped in
     * Segoe UI on Windows, with neither brand font ever requested.
     */
    <html
      lang="en-UG"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-(--z-skip) focus:rounded-brand focus:bg-green focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
