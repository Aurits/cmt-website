import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';

/**
 * Inter for everything you read and operate; Newsreader for headlines. Both self-hosted through
 * next/font, so no render-blocking request to Google and no layout shift on a slow connection.
 *
 * Newsreader replaced Fraunces after both were compared on the rendered page, alongside Source
 * Serif 4, Playfair Display, Libre Caslon and Cormorant Garamond. Fraunces is a soft, ball-
 * terminal display face that reads as a lifestyle magazine; beside a regulated valuer's wordmark
 * it was the wrong register. Playfair matched the wordmark's contrast best but sets old-style
 * figures, so "10–15 working days" shrank to lowercase height, and a firm whose headings are so
 * often numbers cannot have numerals that duck. Newsreader keeps lining figures, holds up at the
 * 17px the ledger labels use, and carries an optical-size axis: the same family draws finer
 * contrast at hero size and sturdier strokes in a card title, without a second font.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  // Variable weight plus the optical-size axis; see above for why opsz is the point.
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
    /*
     * The font variables go on <html>, not <body>, and this is load-bearing. Tailwind emits the
     * theme tokens (--font-sans: var(--font-inter), --font-display: var(--font-newsreader)) on
     * :root, and a custom property resolves its var() where it is DECLARED. With the next/font
     * variables on <body>, :root had no font variable to point at, both tokens resolved to
     * empty, and every page silently fell back to the system font stack: the site shipped in
     * Segoe UI on Windows, with neither brand font ever requested.
     */
    <html
      lang="en-UG"
      className={`${inter.variable} ${newsreader.variable}`}
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-brand focus:bg-green focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
