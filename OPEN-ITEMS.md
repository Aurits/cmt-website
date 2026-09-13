# Open items — what we need from CMT

Everything below is a gap in the brief or in what CMT publishes. Nothing here has been
guessed at in the build: each one is wired so that one edit switches it on. Ordered by
what blocks launch first.

This file is the record — the site itself no longer carries the small on-page "flagged"
notes it used to (the ※ callouts on Services, Listings, Clients and Contact). The client
asked for those removed, since a prototype visibly annotating its own gaps reads as
unfinished rather than in-progress. Every fact those notes carried is still here.

## 1. Office mobile for WhatsApp — blocks a required CTA

The brief requires a WhatsApp route in the header, on every agent card and in the sticky
mobile bar. CMT publishes only a landline (+256 414 346 344), which cannot receive
WhatsApp, and we will not publish a number we invented.

Until it is supplied, WhatsApp buttons route to `/contact#whatsapp`, which explains the
position. Set `whatsapp: '256…'` in `src/data/site.ts` and every WhatsApp CTA on the site
starts working.

## 2. Real, named testimonials

The brief allows real, named testimonials only, and forbids reusing the current site's
Lorem ipsum. None have been supplied, so the homepage section carries an honest empty
state rather than invented quotes attributed to banks. Add entries to
`src/data/testimonials.ts` and the section switches to real cards.

Each one needs: the quote, the person's name, their organisation, and their permission to
publish.

## 3. Team headshots and confirmed job titles

`Kanshabe Lindah` and `Waniala Andrew` are listed on the current site as agents. We show
their initials on brand green rather than a stock photograph of an unrelated person
standing in for a named colleague.

Needed: headshots, exact job titles, and direct lines or extensions if they are to be
published. Data lives in `src/data/agents.ts`.

## 4. Full services list

The brief lists this as open and tells us to use valuation and consultancy as
placeholders. We built four services from what CMT already publishes — property valuation,
valuation for lending, real estate consultancy, listing and sales management — and the
Services page states plainly that the list is provisional. Confirm, correct or extend
in `src/data/services.ts`.

## 5. Company history and timeline

Also flagged as open in the brief. The About page timeline is written as four stages
rather than dated milestones, because we do not know the founding year and would rather
not invent one. Needed: founding year, the milestones CMT considers landmarks, and any
figures they are happy to publish (instructions completed, institutions served).

## 6. Office hours

Not published anywhere. The Contact page shows a plausible placeholder with a visible note
that it needs confirming. Set `hours` and flip `hoursConfirmed` to `true` in
`src/data/site.ts`.

## 7. Where UNFCU belongs

The brief asks us to confirm this. UNFCU is currently under **Corporate and development
partners**, where CMT has it. It is a credit union, so it could equally sit under **Banks
and financial institutions**. One-line move in `src/data/partners.ts`.

## 8. Two clients we found that the brief does not list

CMT's live clients page carries **EXIM Bank** and **Uganda Development Bank** alongside the
twelve institutions in the brief. Both are included, because the client publishes them, but
confirm they are current and correctly placed.

The African Development Bank file on that page actually held two seals side by side — the
Bank and the African Development *Fund*, which are different institutions. Only the Bank's
seal is used.

All fourteen marks are now live: `scripts/prepare-partner-logos.mjs` pulls them from CMT's
own clients page (the source the brief names), trims and normalises them, and records each
one in `public/brand/partners/CREDITS.md`. Several source files are small — KCB, Stanbic,
UBA and VisionFund are around 73px tall — so higher-resolution versions would sharpen the
conveyor on retina screens.

## 9. Real listings and photography

All sixteen listings are illustrative: prices, references and specifications are
placeholders, and photographs are licensed stock (`public/images/CREDITS.md`). Property
pages say so on the page. No photograph used anywhere on the site depicts a specific,
identifiable Kampala building, per the brief's legal constraint.

## 10. Map pin for the office

The Contact page pin is placed at street level from the published address
(Ambassador House, Plot 56/60, Kampala Road) and is captioned as not surveyed. Confirm the
exact coordinates, or accept the street-level pin. Set in `src/data/site.ts`.

## 11. The gold wordmark exists — we would like the source file

The whole site is now one green, `#1b361c`, taken from the logo tile, so the mark merges
into every green surface. That was the client's call and it supersedes the brief's
`#143d1e`.

While pulling the client logos we found that CMT's own clients page carries a **gold CMT
wordmark on a transparent background** (`logo-e1744454247659.png`). It is only 200x108, too
small to use as the masthead, but it proves a knocked-out variant exists somewhere.

**Worth asking for:** the source of that gold mark, ideally as SVG, plus a white or
single-colour version. With a transparent mark the masthead is no longer tied to the tile's
green, so the site could return to the brief's `#143d1e` — or use the gold wordmark on
cream, where the green tile currently cannot go at all.

## Decisions we made rather than blocking on

- **Body text is `#171612`**, a warm near-black, not pure `#000000`. The brief invited this
  judgement: pure black on the cream ground reads harsh and slightly cold.
- **Prices render as `UGX 2,800,000,000`**. `Intl` renders UGX as "USh", which is not how
  Ugandan property is advertised or valued.
- **Property detail lives at `/properties/[slug]`**, so `/listings/[category]` stays clean
  for the five category landing pages.
- **One green across the whole site, the logo's `#1b361c`.** The client's decision, taken
  after the masthead showed how much better the mark reads when the surface matches it.
  Item 11 above is what would let the palette return to the brief's `#143d1e`.
- **The homepage is one belt, /clients has three.** The brief asks for categorised client
  logos; running all three categorised belts on the homepage as well made it longer, which
  was the opposite of what was wanted, so the homepage carries a single combined belt and
  links through.
- **Map pins are neighbourhood-level** on listings, captioned as such. It is what a real
  agent publishes before a viewing is booked, and it avoids implying a surveyed position.
