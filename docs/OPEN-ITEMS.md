# Open items — what we need from CMT

Everything below is a gap in the brief or in what CMT publishes. Nothing here has been guessed at in the
build: each one is wired so that one edit switches it on. Ordered by what blocks launch first.

This file is the record — the site itself no longer carries the small on-page "flagged" notes it used to
(the ※ callouts on Services, Listings, Clients and Contact). The client asked for those removed, since a
prototype visibly annotating its own gaps reads as unfinished rather than in-progress. Every fact those
notes carried is still here.

**For CMT, read `CONTENT-NEEDED.md` instead.** That is the same list in plain language, grouped for
the people who will answer it. This file is the technical record behind it: where each item lives in
the code and what it switches on.

**Revised 26 September 2026** after a full review of every public page. The remaining on-page notes
addressed to CMT were removed in that pass (on About, Our people, Credentials, Offices and Contact),
completing the instruction above; each fact they carried is in both documents.

**Revised 15 September 2026** against a review of CMT's own published material (Uganda and Kenya sites)
and the competitive field — see `SITE-STRATEGY.md`. That review closed two items, materially changed a
third, and opened three new ones that now block more than anything else on this list.

---

## 1. Registration numbers and the exact form of the credentials — blocks the repositioning

**New, and now the top of the list.** CMT's Kenya site and public directories show that director Godfrey
Omondi is a **chartered valuation surveyor, MRICS**, registered to practise through RICS and licensed by
both the Institution of Surveyors of Kenya and Uganda's Surveyors Registration Board. Co-director Michael
Oballim is **FISU**, a Fellow of the Institution of Surveyors of Uganda.

None of this is on the site, and it is a far stronger position than the "regulated by the Uganda
Institution of Surveyors" line we currently run. It is also the sentence that wins DFI, audit and
cross-border work.

We will not publish a professional credential we have not had confirmed by the holder. Needed: the
registration numbers, the correct post-nominals, and the firm's own registration. Until they arrive the
credential line on the homepage renders nothing, the standing schedule on About and the registrations on
Credentials show "Awaiting confirmation", and agent cards omit the Qualifications block entirely.

## 2. The relationship between the Uganda and Kenya entities — a structural decision

**New.** CMT Realtors is incorporated in Kenya (2010) with branches in Nairobi, Kisumu, Mombasa, Kisii and
Bungoma, alongside the Uganda practice in Kampala with branches in Gulu, Mbale and Mbarara. The stated
vision is to lead the East Africa region.

One firm with two arms, or two firms sharing a director? This decides whether this is one regional site or
two linked national ones, and it affects the masthead, the footer, the offices page and every "we cover"
sentence on the site. It is not a copy question and cannot be deferred to content.

## 3. Office mobile for WhatsApp — blocks a required CTA

The brief requires a WhatsApp route in the header, on every agent card and in the sticky mobile bar. CMT
publishes only a landline (+256 414 346 344), which cannot receive WhatsApp, and we will not publish a
number we invented.

Until it is supplied, WhatsApp buttons route to `/contact#whatsapp`, which explains the position. Set
`whatsapp: '256…'` in `src/data/site.ts` and every WhatsApp CTA on the site starts working.

## 4. Which service lines CMT actually wants work in

**New.** CMT publishes six service lines spanning seven asset classes and six valuation purposes. A site
that pushes all six equally pushes none. The `/valuations` hub is built to lead on one combination and the
homepage surfaces three — we need CMT to tell us which three pay best, rather than us ranking them by
guess.

Current assumption, stated so it can be corrected: **valuation for lending** leads, with financial
reporting and compensation behind it.

## 5. Team headshots and confirmed job titles

Materially changed. The build previously showed only `Kanshabe Lindah` and `Waniala Andrew`, the two
property agents listed on the current site. The credibility actually sits with the **directors** —
Godfrey Omondi and Michael Oballim — plus valuers Namujjumbi Stella and Kingsley Adams, none of whom
appeared anywhere.

We show initials on brand green rather than a stock photograph of an unrelated person standing in for a
named colleague. Needed: headshots, exact job titles, qualifications as they should be written, and direct
lines or extensions if they are to be published. Data lives in `src/data/agents.ts`.

## 6. Real, named testimonials

The brief allows real, named testimonials only, and forbids reusing the current site's Lorem ipsum. None
have been supplied, so the section carries an honest empty state rather than invented quotes attributed to
banks. Add entries to `src/data/testimonials.ts` and the section switches to real cards.

Each one needs: the quote, the person's name, their organisation, and their permission to publish.
Worth asking for too: which instruction the quote is about and the year (e.g. "Mortgage valuation, 2025").
A reference that names the job is worth more than one that does not, and the card shows it when supplied.
Until the first one arrives, the homepage shows four plain statements about CMT in that slot instead, and
`/about/clients` shows nothing.

## 7. The full client list, with permission to name them

CMT states **20+ leading institutions**. Fourteen logos are already public on their clients page and are
live on the site. The gap between fourteen and "20+" is roughly six institutions of free proof.

Also still outstanding from the original review:

- **EXIM Bank** and **Uganda Development Bank** appear on CMT's live clients page but not in the brief.
  Both are included because the client publishes them — confirm they are current and correctly placed.
- **UNFCU** currently sits under *Corporate and development partners*, where CMT has it. It is a credit
  union, so it could equally sit under *Banks and financial institutions*. One-line move in
  `src/data/partners.ts`.
- The African Development Bank file on that page held two seals side by side — the Bank and the African
  Development *Fund*, which are different institutions. Only the Bank's seal is used.
- Several source files are small — KCB, Stanbic, UBA and VisionFund are around 73px tall — so
  higher-resolution versions would sharpen the conveyor on retina screens.

The ledger shows 14, the number of logos we hold (`stats` in `src/data/site.ts`); CMT says 20+.

## 8. Office hours

Not published anywhere. The Contact page shows plausible hours with a visitor-facing line asking people
to call ahead. Set `hours` and flip `hoursConfirmed` to `true` in `src/data/site.ts` and the line goes.

## 9. One redacted sample report

**New, and cheap.** Even a single blurred page on `/valuations` answers "what do I actually receive"
better than any paragraph could, and no competitor in this market shows one. A redacted contents page
would do.

## 10. Real listings and photography

All sixteen listings are illustrative: prices, references and specifications are placeholders, and
photographs are licensed stock (`public/images/CREDITS.md`). Property pages say so on the page. No
photograph used anywhere on the site depicts a specific, identifiable Kampala building, per the brief's
legal constraint.

## 11. Map pin for the office

The Contact page pin is placed at street level from the published address (Ambassador House, Plot 56/60,
Kampala Road) and is captioned as not surveyed. Confirm the exact coordinates, or accept the street-level
pin. Set in `src/data/site.ts`.

## 12. The gold wordmark exists — we would like the source file

The whole site is one green, taken from the logo tile, so the mark merges into every green surface. That
was the client's call and it supersedes the brief's `#143d1e`.

While pulling the client logos we found that CMT's own clients page carries a **gold CMT wordmark on a
transparent background** (`logo-e1744454247659.png`). It is only 200x108, too small to use as the
masthead, but it proves a knocked-out variant exists somewhere.

**Worth asking for:** the source of that gold mark, ideally as SVG, plus a white or single-colour version.
With a transparent mark the masthead is no longer tied to the tile's green, so the site could return to
the brief's `#143d1e` — or use the gold wordmark on cream, where the green tile currently cannot go at
all.

---

## 13. Social profile URLs

The masthead utility strip carries Facebook, X, Instagram, LinkedIn, YouTube and TikTok icons, beside
the phone number and the email address. The icons on cmtrealtors.com link to `#`, so we have no profile
URLs we can publish. Paste each URL into `site.social` in `src/data/site.ts` and that icon becomes a
live link. Unlinked icons show dimmed until then. Say which platforms CMT has no presence on and we
will drop those icons.

WhatsApp is not in that row. It is a channel people transact on here rather than a profile to follow,
so it keeps its own button beside the masthead CTA (and see item 3 for the number itself).

## 14. A hero photograph, if one is wanted at all

The homepage hero no longer carries a photograph. It carries an illustrated, dimensioned street
elevation, blurred, behind the headline (`src/components/home/HeroElevation.tsx`), because the slot
previously held licensed stock architecture that said nothing about CMT and made the one firm in this
market that leads with valuation open like the twentieth agency.

Nothing is blocked on the client here. It is recorded because two things follow from it:

- `public/images/hero-home.jpg` moved to the homepage identity section, where abstract architectural
  texture is all that slot needs. It is not Kampala, and `public/images/CREDITS.md` now says so.
- If CMT would rather have a photograph there, we need a real one: a Kampala building the firm has
  actually valued, or their own office. Licensed stock of an anonymous facade is the thing we removed,
  so replacing it with different stock would not be an improvement.

## Closed by the 15 September review

These were listed as blocked on the client. They were not — CMT publishes both in full, and nobody had
checked.

### ~~Full services list~~ — closed

The brief lists this as open and tells us to use valuation and consultancy as placeholders. CMT's own
services page publishes the complete list: property valuation and advisory (across land and development
sites, commercial, residential, specialised assets, plant and machinery, shares and stocks, integral
assets — for financial reporting, loan security, insurance, tax and litigation, investment analysis and
business valuation), acquisition and disposal, development consultancy and market research, leasing, asset
and facilities management, and project management.

This is now the basis for `/valuations` and `/advisory`. Item 4 above replaces it: we know *what* they do,
we need to know what they want to sell.

### ~~Company history and timeline~~ — closed

Also flagged as open in the brief. CMT publishes the founding position (a valuation practice, 15 years,
directors with 25+ years each), the mission, the vision, the core values, and the Kenya incorporation date
of 2010. The About timeline can now be written from fact rather than as four undated stages.

The one figure still genuinely missing is the **Uganda founding year**. We would rather not invent one.

---

## Decisions we made rather than blocking on

- **Body text is `#14211a`**, a green-black, not pure `#000000`, and the neutrals are organised by
  temperature (white, ivory, sage mist) after the September palette overhaul. See the note at the top of
  `src/app/globals.css`.
- **Prices render as `UGX 2,800,000,000`**. `Intl` renders UGX as "USh", which is not how Ugandan property
  is advertised or valued.
- **Property detail lives at `/properties/[slug]`**, so `/listings/[category]` stays clean for the five
  category landing pages. The nav label is now "Properties" while the listings routes keep their paths —
  merging them is a route collision, and SEO migration is a later phase. See `SITE-STRATEGY.md` §4.
- **One green across the whole site, the logo's green.** The client's decision, taken after the masthead
  showed how much better the mark reads when the surface matches it. Item 12 above is what would let the
  palette return to the brief's `#143d1e`.
- **Sharp surfaces, 4px controls.** Two radii, split by role: anything that presents information is
  square, anything you press or type into is softened. Replaces the uniform 10px radius. See the note in
  `src/app/globals.css`.
- **The homepage is one belt, /about/clients has three.** The brief asks for categorised client logos;
  running all three categorised belts on the homepage as well made it longer, which was the opposite of
  what was wanted, so the homepage carries a single combined belt and links through.
- **Map pins are neighbourhood-level** on listings, captioned as such. It is what a real agent publishes
  before a viewing is booked, and it avoids implying a surveyed position.
- **The blog ships when there is something to put in it**, not before. The nav item is held back until the first post exists.
