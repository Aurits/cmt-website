# CMT Realtors — website redesign (frontend prototype)

Frontend-only prototype of the redesigned [cmtrealtors.com](https://cmtrealtors.com). Built
against `docs/Plan.md`, the client brief in this repo. No database, no authentication and no CMS
this phase: listings, partners, agents and services are static data, and forms are UI only.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Stack

- Next.js 16 (App Router) with TypeScript and Tailwind CSS v4
- Leaflet and OpenStreetMap for maps (no API key)
- `next/font` for Inter and Fraunces, self-hosted at build time
- `next/image` for every photograph

## Where things live

```
src/app/                     routes
  page.tsx                   home
  about, services, clients, contact
  listings/                  all listings, with filter, sort and pagination
  listings/[category]/       the five category landing pages
  properties/[slug]/         property detail
src/components/              reusable components (see below)
src/data/                    all content: site, categories, listings, agents,
                             partners, services, testimonials
src/lib/                     types, currency formatting, class helper
scripts/prepare-images.mjs   photography pipeline, documents photo provenance
scripts/prepare-partner-logos.mjs
                             pulls the client logos from CMT's own site and normalises them
scripts/prepare-icons.mjs    builds favicon.ico, icon.png, apple-icon.png and the manifest
                             icons from the client's own artwork — nothing redrawn
public/images/CREDITS.md     licence and source of every photograph
public/brand/cmt-logo.png    the client-supplied mark, optimised
public/brand/partners/       client logos + CREDITS.md
docs/                        the written record: brief, strategy, layout specs,
                             open items and the client workplan
```

### Reusable components

`Header`, `Footer`, `StickyMobileCTA`, `StatsStrip`, `PropertyCard`, `CategoryCard`,
`TestimonialCard`, `AgentCard`, `CTABanner`, `PartnerConveyor` (+ `PartnerConveyorGroups`),
`Select` (the site's dropdown), plus `FeaturedCarousel`, `ListingsExplorer` (filter, sort,
pagination), `PropertyGallery`, `PropertyMap`, `HeroSearchTabs`, `Reveal`, `ContactForm` and
`InquiryForm`. Page files compose these; they do not restyle them.

## Design decisions worth knowing

- **Colour tokens** live in `src/app/globals.css`: green `#11341b`, gold `#daa706`, cream
  `#f7f2dd` — gold and cream exactly as the brief sets them. Body text is a warm near-black
  `#171612` rather than pure black, which reads harsh on cream.
- **The gold comes in a pair, and they are not interchangeable.** `--color-gold` (`#daa706`) is
  the brief's value and is used as a fill under dark text, or as text on the brand green — 6.2:1
  both ways. It is never text on a light ground, where it measures 1.97:1 and simply is not there.
  `--color-gold-deep` (`#816304`) is the readable half: words and icons on cream or paper, and
  fills with cream text over them. Every pair on the site was measured; the audit is in the commit
  that introduced this line.
- **One green, everywhere**: `#11341b`, the green inside the supplied logo tile, is the
  only green on the site. Masthead, footer, page headers, stats, CTA bands, buttons and map
  pins all use it, so the logo merges into any surface and the site reads as one material.
  Depth comes from alpha of that same green (`green/8`, `green/85`) and from gold hairlines,
  never from a second hue. This supersedes the brief's `#143d1e` at the client's direction —
  see `docs/OPEN-ITEMS.md`.
- **Type**: Inter for UI and body, Fraunces for headlines, picking up the tall serif of the
  CMT wordmark.
- **Sharp surfaces, softened controls**: two radii, and the split carries meaning. Anything
  that presents information — cards, panels, photo frames, the map, badges — is square
  (`rounded-brand`, 0), because a schedule, a certificate and a ruled table are square, and
  those edges argue the same thing the hairlines and tabular numerals argue. Anything you
  press or type into — buttons, inputs, the `Select` trigger, pagers, chips — takes 4px
  (`rounded-control`). Against genuinely sharp surfaces 4px is all it takes to read as a
  control, and it keeps the gold top rule straight. Read it as: sharp means read this,
  softened means press this. The pill-shaped nav breaks both on purpose.
- **Structure**: ruled key/value "schedules" (label, figure, hairline) are the recurring
  device, borrowed from how a valuation report presents facts. Prices and figures use
  tabular numerals.
- **Mobile first and light**: no autoplay video, no icon library, no animation library.
  Leaflet is loaded on the client only and lazily, so phones do not pay for a map they
  have not scrolled to.
- **Motion, in three kinds and no more**: content arriving on scroll (`Reveal`), the
  homepage carousel cross-fading and drifting, and the client conveyor. All three stop dead
  under `prefers-reduced-motion`. `Reveal` never ships hidden content in the server HTML —
  it hides below-the-fold elements on the client before paint, so nothing depends on
  JavaScript to become visible.
- **The client conveyor is CSS-only**: one track of colour with a desaturating veil over
  each side, so whatever passes the centre is the only mark at full strength. No JS, and
  the colour and grey states cannot fall out of register. Speed is one logo every 6.5s,
  uniform across belts regardless of how many logos each holds.
- **Prices** are rendered as `UGX 2,800,000,000`, not with Intl's `USh` symbol, because
  Ugandan property is advertised and valued in UGX.
- **Favicon steps down with size.** The supplied mark is a 3:1 wordmark, and dropped whole
  into a 16px tab icon it turns to a grey smear — tested, not assumed. `scripts/prepare-
  icons.mjs` crops the "C" alone for 16px and 32px, where it stays sharp, and uses the full
  wordmark from 48px up. `favicon.ico` is hand-built (a minimal ICO writer in that script)
  so the two sizes can carry different artwork rather than one image stretched.
- **Dropdowns are a custom listbox (`Select`), not native `<select>`.** A native select's
  open menu is drawn by the OS, in the OS font and colour, which is the one control that
  always looks borrowed on a page this deliberate. `Select` is the ARIA combobox/listbox
  pattern: paper ground, hairline rows, gold marker on the chosen row, full keyboard
  support (arrows, Home/End, typeahead, Escape to cancel, Tab to close). Ten native selects
  across the filters, hero search and forms all route through it now.

The brief forbids invented testimonials, and the same principle is applied throughout:
where CMT has not supplied something, the UI says so instead of filling the gap with a
plausible fiction. See `docs/OPEN-ITEMS.md` for the full list and where each one is wired.

## Strategy and layout

Two documents drive the current direction, written after a review of CMT's own published material
(Uganda and Kenya) and the competitive field:

- **`docs/SITE-STRATEGY.md`** — what the research found, the positioning, the navigation naming and the
  sitemap. Read this first; it explains *why* the pages are what they are.
- **`docs/LAYOUT-SPECS.md`** — nine sheets specifying how each page in that sitemap is built: structural
  concept, visitor flow, section order and exact dimensions, all resolving against the tokens in
  `globals.css`.

- **`docs/WORKPLAN.md`** — the Phase 1 delivery plan issued to CMT, 17 to 30 September. Converted
  from `docs/Website Development & Launch Workplan.pdf`, which sits beside it and is the version
  that was signed off.

`docs/Plan.md` remains the client's original brief and is not edited — where the strategy supersedes it, the
strategy says so and gives the reason.

## Replacing placeholder content

- **Listings**: edit `src/data/listings.ts`. Photographs go in `public/images/listings/`.
- **Photography**: drop client files at the existing paths and nothing else changes.
- **Partner logos**: `node scripts/prepare-partner-logos.mjs --force` re-pulls them from
  CMT's site; to add one by hand, drop a file in `public/brand/partners/` and point a row in
  `src/data/partners.ts` at it. A row with no `logo` falls back to its name set in type.
- **Testimonials**: add entries to `src/data/testimonials.ts` and the homepage swaps from
  the empty state to real cards.
- **WhatsApp**: set `whatsapp` in `src/data/site.ts` to the office mobile in international
  digits and every WhatsApp CTA on the site starts working.

## Known non-issues

**"A tree hydrated but some attributes of the server rendered HTML didn't match"** in the
browser console is caused by browser extensions, not by this app. Grammarly stamps
`data-gr-ext-installed` and `data-new-gr-c-s-check-loaded` onto `<body>`, and Scribe stamps
`data-scribe-recorder-ready` onto `<html>`, before React hydrates; React reports the
difference against the server HTML. Loading any route in a clean profile (or an incognito
window with extensions disabled) hydrates without a warning.

`suppressHydrationWarning` is set on `<html>` and `<body>` in `src/app/layout.tsx` to keep
that noise out of the console. It suppresses attribute and text differences **only on
those two elements**, never on their children, so genuine mismatches inside the page are
still reported. Do not add the prop anywhere else to quieten a warning — there it would
hide a real bug. If you do see a mismatch reported on an element inside the page, that one
is ours: check the client components (`grep -rl "'use client'" src`) for values that differ
between server and browser.

## Out of scope this phase

Database, backend API, authentication, staff CMS, real property data, working form
submission, and SEO migration from the WordPress site.
