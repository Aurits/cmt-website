# Layout specs — how each page is built, and what it asks the visitor to do

Nine sheets, A-00 to A-08. Companion to `SITE-STRATEGY.md`, which establishes the positioning and the
sitemap these pages implement.

Every dimension below resolves against tokens already in `src/app/globals.css` — the 1200px measure, the
8pt rhythm, sharp surfaces with 4px controls, one easing curve. Nothing here needs a new dependency, and
nothing is specified that the existing components cannot render.

**Legend.** [new] marks a new or substantially changed piece. Sections marked *green* are authority
bands; *photo* are photographic.

---

## A-00 · Foundations

**One rhythm, three registers.** Every page is built from the same vertical rhythm and alternates between
three surface registers — *cream* (the page), *paper* (a raised object), *green* (authority). A page that
never reaches green feels administrative; a page that is mostly green feels like a brochure. Two to three
green bands per page, no more.

| | |
|---|---|
| **Grid** | 12 columns, `max-width 1200`, gutter `16px` below 640 and `24px` above, column gap `24px`. Content measure caps at **66ch** for body, **54ch** for a section lead, **18–30ch** for a headline |
| **Vertical rhythm** | Sections `padding-block: 48 / 64 / 80` at base / md / lg. Green bands take one step more: `56 / 72 / 96`. Inside a section, the gap between heading block and content is always `32px`; between sibling content rows, `24px`. **No other vertical values** |
| **Type scale** | `display clamp(2.4rem,6.2vw,4.3rem)` · `h2 clamp(1.75rem,3.4vw,2.6rem)` · `h3 1.1875rem` · body `17px` at lg, `16px` base · secondary `15px` · micro `13px` · mono label `12px / .14em / uppercase`. Headlines Fraunces 600 at `-0.015em`; nothing else gets negative tracking |
| **Radius** | Surfaces `0`. Controls `4px`. The pill nav is the only exception — settled, see the radius note in `globals.css` |
| **Touch & hit** | Every control **≥44×44px**. Inputs `min-height 46px` (`40px` for the `sm` variant). Adjacent controls never closer than `8px`. Link text targets get `padding-block: 6px` so the hit area clears 44px without moving the baseline |
| **Motion** | One curve: `cubic-bezier(.22,1,.36,1)`. Reveal is `18px / 650ms`; stagger `70–90ms` per item and **never more than 240ms total** across a group. Hover transitions `150ms`. All of it dead under `prefers-reduced-motion` |
| **Gold budget** | Gold appears at most **four times per viewport**: the section rule, one figure, one control, one marker. Never a fill larger than a button. If a fifth gold thing appears, one of the others is decoration |
| **Focus** | `2px solid gold, offset 3px` — already global. Every interactive element reachable in DOM order; the matrix on A-03 is the only component needing custom arrow-key handling |

---

## A-01 · Home — `/`

**Standing in three seconds, then one of three jobs.** The hero's job is not to describe the firm — it is
to make the visitor believe the figure will hold before they have read a sentence. That means the
credential line sits *in* the hero, not two screens down.

**Flow:** arrives (bank referral / brand search) → reads standing → **picks one of three jobs** → proof
deepens → **valuation enquiry**

| # | Section | Notes |
|---|---|---|
| 01 | Hero copy + video | 46/54 split at lg. H1 · lead · 2 CTAs · credential line [new]. Video floor-to-ceiling right, poster fallback |
| 02 | The counter [new] | Value a property · Buy or rent · Talk to a valuer. Overlaps band foot, gold 2px top rule |
| 03 | Ledger *(green)* | 16+ yrs · 20+ institutions · 9 offices, 2 countries · RICS + FISU. 4 cells, 2-up at sm |
| 04 | Featured *(photo)* | Full-bleed carousel, `clamp(520,76vh,760)`. Unchanged |
| 05 | Identity | Photograph + "A valuation firm first" + 3 ruled claims. Order swaps at lg |
| 06 | What we're asked [new] | Top three valuation purposes, 3-up. Links into the A-03 matrix |
| 07 | Advisory *(green)* | Five advisory lines, 4-up at xl. Was "services" |
| 08 | Clients | Single conveyor belt + link through. CSS-only, unchanged |
| 09 | Close *(green)* | CTA banner over skyline, `py 80` |

### The credential line — the one new piece

A single row beneath the hero CTAs. This is what converts the repositioning from a claim into a fact, and
it costs 40px of vertical space.

- **Composition** — three items, `13px` mono, `letter-spacing .06em`, colour `muted`, separated by a
  `1px × 12px` gold vertical rule with `16px` margin either side. Reads: **RICS chartered · Registered
  SRB Uganda · ISK Kenya**.
- **Placement** — `margin-top: 28px` from the CTA row, with a `1px` hairline `rule` above at
  `padding-top: 20px`. Left-aligned to the H1, never centred.
- **Wrap** — below 480px the rules drop and it becomes three stacked lines at `line-height 1.9`. It must
  never produce an orphan.
- **Gate** — renders only when the registration numbers are confirmed. Until then the component returns
  `null` rather than showing an unverified claim.

### The counter, retabbed

- **Tabs** — **Value a property** (default, was third) · **Buy or rent** (merges two tabs) · **Talk to a
  valuer**. Valuation leads because it is the business.
- **Fields** — Tab 1: property type + location → `/contact/request-a-valuation`. Tab 2: type + location +
  buy/rent toggle → `/properties`. Tab 3: collapses to a single button, no fields — three dropdowns in
  front of "talk to someone" is a toll gate.
- **Geometry** — tab row `min-height 52px`, equal flex. Panel `padding 16/20`, grid `1fr 1fr auto` at sm,
  stacked below. Submit `py 12 / px 24`, gold.

### Cut from this page

**Testimonials and the market-blog posts band.** Eleven sections is two too many, and both currently end
the page on a promise rather than a proof — an empty testimonial state and a "coming soon" note are the
last two things a visitor reads before the footer. Move testimonials to `/about/clients` where the logo
wall carries them, and let the Blog nav item do the work the teaser band was doing. **Home drops from
11 sections to 9** and ends on the CTA.

---

## A-02 · About — the firm — `/about`

**The cover sheet of a valuation report.** Every report CMT issues opens by stating who prepared it and
under what authority. This page is that page. It opens on registrations, not on a mission statement —
because it now sits first in the nav and has to earn the slot in one screen.

**Flow:** arrives first-in-nav → **reads standing** → sees the two-country reach → meets the signatories
→ **routes to Valuations**

| # | Section | Notes |
|---|---|---|
| 01 | Standing *(green)* [new] | H1 + three registrations as a ruled schedule. Replaces the generic PageHeader lead |
| 02 | The baseline [new] | 9 offices on a survey baseline — Uganda \| Kenya. Full-bleed, `h 180`, cream |
| 03 | What the years buy | Two paragraphs, evidence-led, measure 62ch + office photograph `4:3` → `min-h 420` at lg |
| 04 | How the practice grew [new] | Four stages as a vertical schedule. Was a 2×2 grid |
| 05 | Signatories [new] | Directors 2-up, portrait + credential schedule. Then valuers 4-up |
| 06 | Accreditation *(green)* | RICS · SRB · ISK · Red Book, as badge rows, 3-up at lg |
| 07 | Who instructs us | Three categorised belts + testimonials. Moved from home |
| 08 | Close *(green)* | Talk to our team, `py 80` |

### 01 · The standing schedule

Three rows in the green page header, under the H1. Set as a schedule because that is how a report states
its own authority — label left, value right, hairline between.

- **Rows** — **Chartered** → RICS · reg. no · **Uganda** → Surveyors Registration Board · reg. no ·
  **Kenya** → Institution of Surveyors of Kenya · reg. no
- **Geometry** — `display:flex; justify-content:space-between; align-items:baseline`, `border-top: 1px
  solid rgba(cream,.22)`, `padding-block: 12px`. Label `15px cream/70`, value `15px mono tnum cream`.
  Max width `560px`, left column.
- **At lg** — schedule moves to the right half of the header on a `grid-template-columns: 1fr 560px`,
  baseline-aligned with the H1's last line. Below lg it stacks under the lead at `margin-top: 32px`.
- **Unconfirmed state** — value renders as `— pending` in `cream/45`. The row stays; the claim does not.

### 02 · The survey baseline

The distinctive piece on this page, borrowed directly from the trade: a surveyor's baseline with stations
ticked along it. Nine offices, two countries, one rule.

- **Form** — a single `1px` horizontal rule at the vertical centre of a `180px` full-bleed cream band.
  Each office is a `1px × 10px` tick rising from the rule, with the city name below at `13px mono` and
  the branch type above at `11px`.
- **Division** — a `2px` gold vertical at the midpoint, `32px` tall, labelled **UG** left and **KE**
  right at `11px mono, .12em`. Head offices (Kampala, Nairobi) get a **filled 6px square** on the rule
  instead of a tick.
- **Spacing** — stations distribute with `justify-content: space-between` inside two equal halves — *not*
  evenly across all nine, or the two-country split disappears.
- **Below 720px** — rotates to vertical: the rule runs down the left at `margin-left: 12px`, stations
  become rows at `44px` pitch. Same object, turned 90°, never a wrapped mess.
- **Not a map** — deliberately. A Leaflet map of nine pins across two countries is a slow, zoomed-out
  blur. A baseline reads instantly and says something a map cannot: *we are organised*.

### 05 · Signatories

- **Directors** — 2-up at lg (`1fr 1fr`, gap `32px`), 1-up below. Portrait `aspect-ratio 4/5`,
  `object-position: top`. Name Fraunces `24px`, role `15px muted`, then a credential schedule beneath at
  `13px mono` — qualification, institution, registration. **Directors first and larger than the agents**;
  the current build has this exactly inverted.
- **Valuers** — 4-up at lg, 2-up at sm. Same card, `0.72×` scale, no bio.
- **No headshot** — the initials plate on green stays, but at `4/5` to hold the grid, with initials at
  `Fraunces 40px` centred. A square plate in a portrait grid is the tell that a photo is missing.

---

## A-03 · Valuations — the hub — `/valuations`

**The instruction matrix.** The hardest and most valuable screen in the project. CMT's own taxonomy has
two axes — *what is being valued* and *what the figure is for* — and every competitor flattens them into
a bullet list. Presenting them as a matrix is instantly legible, impossible to copy without the same depth
of service, and does the visitor's filing for them.

**Flow:** arrives with a situation, not a service in mind → **picks an axis** → reads the intersection →
**enquiry, pre-filled**

| Purpose ↓ / Asset → | Property | Plant & machinery | Business & shares |
|---|---|---|---|
| **For lending** | lead line | ✓ | — |
| **Financial reporting** | ✓ | ✓ | ✓ |
| **Insurance** | ✓ | ✓ | — |
| **Tax & litigation** | ✓ | ✓ | ✓ |
| **Compensation** | ✓ | — | — |

*Schematic only — the built version is a grid of links, not a table of ticks.*

- **Structure** — CSS grid, `grid-template-columns: minmax(150px,1fr) repeat(3,1fr)`. Row headers are the
  five purposes; column headers the three asset classes. Each filled cell is an `<a>` to
  `/valuations/[purpose]#[asset]`. **Cells are links, not checkboxes** — there is no filter state to
  manage and no JS required for the core function.
- **Cell** — `min-height 72px`, `padding 12px 14px`, hairline `1px rule` on all sides via `gap:1px` on a
  `rule`-coloured grid background. Empty combinations render as a `paper-2` cell with an em-dash in
  `muted` — **present but inert**, which communicates scope honestly.
- **Hover / focus** — cell fills `green/8`; **its entire row and column header also highlight** to
  `green` text on `gold/16`. This crosshair is the whole idea — it shows the visitor they are at an
  intersection, not on a list item. `transition: 150ms`.
- **Keyboard** — `role="grid"` with roving `tabindex`. Arrow keys move between cells, `Home/End` to row
  ends, `Ctrl+Home` to first cell, `Enter` follows the link. The crosshair follows focus, not just hover.
- **Below 780px** — the matrix does not scroll sideways, it **becomes two questions**. A stacked
  accordion: "What are you valuing?" (3 options) then "What do you need it for?" (filtered to the valid
  purposes). Same routes, same content, a different instrument. A horizontally scrolling matrix on a phone
  is a matrix nobody reads.
- **Default state** — never empty. On load the **For lending × Property** cell is marked as the lead line
  with a solid green fill and a one-line caption beneath the matrix. It is 60%+ of instructions and the
  most common reason someone is on this page at all.

### Page flow around the matrix

| # | Section | Notes |
|---|---|---|
| 01 | *(green)* | H1: "What do you need valued, and what for?" No lead paragraph — the matrix is the lead |
| 02 | The matrix [new] | 5 purposes × 3 assets, crosshair on hover. `py 64`, becomes 2 questions < 780 |
| 03 | How it runs | Four steps with real durations. Horizontal at lg, ruled list below |
| 04 | The deliverable *(photo)* [new] | Redacted report spread + contents schedule, 2-up. The asset nobody else shows |
| 05 | Who signs it | Director cards pulled from `/about/people`. Reuses `AgentCard`, contact variant |
| 06 | Close *(green)* | Request a valuation, `py 80` |

---

## A-04 · Valuation purpose — template — `/valuations/[purpose]`

**Answer the question they typed.** Someone landing here searched "valuation for a bank loan" or
"valuation for probate". They arrive mid-problem, often under time pressure. So the page opens by stating
their situation back to them, and the sidebar carries the enquiry from the first pixel — they should never
have to scroll to act.

**Flow:** lands from search, mid-problem → **recognises their situation in line 1** → checks what they get
+ how long → **enquires from the sticky rail**

| # | Section | Notes |
|---|---|---|
| 01 | *(green)* | Breadcrumb · H1 · the situation in one sentence. `py 56` |
| 02 | Body | Situation → basis of value → evidence → limits. Measure 62ch, schedule rows for facts |
| 03 | Rail [new] | Enquiry form · turnaround · signatory. `sticky top: calc(header + 16)` |
| 04 | Timeline [new] | Instruction → inspection → evidence → report, with real days. 4-col at lg |
| 05 | Related purposes | The other four, as a ruled index — not cards |
| 06 | Close *(green)* | Request this valuation |

- **Opening sentence** — Fraunces `clamp(1.25rem,2.4vw,1.6rem)`, measure `42ch`, directly under the H1
  with `margin-top: 20px`. Second person, naming the actual situation: *"Your bank has asked for a
  valuation before it will release the facility."* **This line does more work than the rest of the page.**
- **The rail** — `position: sticky; top: calc(var(--header-h) + 16px)`, `align-self: start`. Contains, in
  order: turnaround figure (`Fraunces 32px tnum gold`), the form, the signatory line. **Unsticks below
  lg** and moves to the foot of the body column — a sticky rail on a phone eats the viewport.
- **Turnaround** — stated as a range in working days with the caveat inline: `5–8 working days · from the
  date of inspection`. A firm that states a number and a caveat reads as more honest than one that states
  neither.
- **Timeline** — four steps, `grid-template-columns: repeat(4,1fr)` at lg with a `1px rule` running behind
  the step numbers at their vertical centre; gold `8px` squares sit on the rule. Below lg it becomes the
  existing `.schedule-row` pattern — **no horizontal scroll, ever**.
- **Basis of value** — rendered as a schedule, not prose: **Market value**, **Forced-sale value**,
  **Reinstatement cost** — whichever apply, each with a one-line plain definition. These are terms of art
  and defining them is a service, not filler.
- **Content budget** — **250–350 words**. Any purpose page that needs more is really two pages. This is
  what makes phase 2 an afternoon with a director rather than a content project.

---

## A-05 · Advisory — `/advisory`

**An index, not a product grid.** Advisory work is scoped, priced and negotiated — it is not bought off a
card. So the page is built as the contents page of a capability statement: five ruled entries, each
stating what it is, who it is for, and what you leave with. The restraint *is* the positioning.

**Flow:** arrives evaluating a firm, not buying a product → scans five capabilities → **opens the one that
matches** → **scoping conversation**

| # | Section | Notes |
|---|---|---|
| 01 | *(green)* | H1 + "scoped in writing before it starts". `py 56` |
| 02 | The index [new] | 5 ruled entries — no cards, no images. `1fr` at base, `20ch + 1fr` at md |
| 03 | Engagement *(photo)* | One photograph, total. How an engagement runs · fee basis · who you work with |
| 04 | Sectors | Where we have done this work — 5 property classes, chips |
| 05 | Close *(green)* | Request a consultation |

- **Index entry** — `grid-template-columns: 20ch 1fr` at md+, single column below. Left: service name in
  Fraunces `19px` + a `13px mono` "for:" line naming the client type. Right: two sentences at `15px`, then
  a deliverables schedule. Divider `1px rule`, `padding-block: 28px`.
- **No images per service** — deliberate, and the opposite of the current Services page. Four alternating
  stock photographs of hands and blueprints say nothing and triple the page height. **One photograph on
  the page**, at the engagement section.
- **Hover** — the entry's left rule thickens from `1px` to `3px` gold and the name shifts to green. No
  lift, no shadow — this is an index, and index rows do not float.
- **Order** — Development · Acquisition & disposal · Asset & facilities management · Project management ·
  Market research. **Highest-value first**, not alphabetical.

---

## A-06 · Properties — `/properties`

**Already built well — three refinements.** `ListingsExplorer` is the most complete component in the repo.
The work here is not a redesign; it is reducing the cost of entry and tying the agency arm back to the
valuation credibility that sells it.

1. **Two-tier filter.** Five dropdowns in a row is a wall. Tier 1, always visible: **type**, **location**,
   **buy/rent** — the three that actually narrow. Tier 2 behind a **More filters** disclosure: price
   ceiling, bedrooms. The disclosure shows an active count badge (`More filters · 2`) so nothing is hidden
   silently. `grid-template-columns: repeat(3,1fr) auto` at lg.
2. **Sticky filter bar.** On scroll past its own height the bar collapses to a `56px` strip — active
   filters as removable chips plus the result count — and sticks at `top: var(--header-h)` with
   `z-index: 20` (below the masthead's 40, above the `Select` listbox's 35 anchor). **Below lg it does not
   stick**; it collapses into a single full-width **Filter** button opening a sheet.
3. **The provenance badge.** The one genuinely new idea on this page. Listings CMT has also valued carry a
   `13px mono` gold-ruled tag: **Valued by CMT · Mar 2026**. It is the only thing on any property portal in
   this market that a pure estate agent structurally cannot say, and it makes the agency arm an argument
   *for* the valuation arm rather than a distraction from it. Sits below the price, `margin-top: 8px`.

- **Card, unchanged** — `4:3` cover, price leading in Fraunces `24px tnum`, specs as a 2-col schedule, two
  CTAs and the reference. It is right. Do not touch it.
- **Empty state** — keep, but add the register-a-requirement form *inline* rather than linking away. A
  visitor who filtered to nothing is the highest-intent visitor on the page.

---

## A-07 · Blog — `/blog`

**A research library, not a blog.** Cards with featured images and read-times signal content marketing. A
ruled index with dates, figures and a named author signals research. CMT is competing with Knight Frank's
market review here, and the format has to carry the same seriousness before a word is read.

| # | Section | Notes |
|---|---|---|
| 01 | *(green)* | H1 + what these notes are and are not. `py 56` |
| 02 | Latest [new] | Most recent note, full width. Headline + pull-figure + 40-word finding |
| 03 | The index [new] | Ruled rows: date · title · one-line finding. No images, no cards, no read-times |
| 04 | Close *(green)* | Get the next note by email |

- **Index row** — `grid-template-columns: 8rem 1fr 12rem` at lg — date (`13px mono tnum muted`), title
  (Fraunces `19px`), finding (`14px muted`). Stacks to date-over-title below 720px. `padding-block: 20px`,
  `1px rule` divider.
- **Pull-figure** — each note carries one number — a yield, a rent, a percentage — set in Fraunces
  `clamp(2rem,5vw,3.2rem)` gold with a `13px` caption beneath. This is what gets quoted and screenshotted,
  and it is the whole reason to publish.
- **Note page** — single column, `66ch`, with a sticky right rail at lg carrying **key figures** as a
  schedule and the author. Charts, when they come, take the gold/green palette with hairline gridlines —
  never a default library theme.
- **Launch condition** — **do not ship the nav item until the first post exists.** An empty blog is
  worse than no blog at all: it advertises that the firm started something and stopped.

---

## A-08 · Contact — `/contact`

**Three doors, three different forms.** One form with a subject dropdown asks the visitor to classify
themselves before the page has helped them. Splitting by intent up front means each form asks only what
that intent needs — and the valuation form, which is the business, can ask the four questions that let a
valuer scope the job before calling back.

| # | Section | Notes |
|---|---|---|
| 01 | *(green)* | H1 "Talk to a valuer" + same-day response line |
| 02 | Intent [new] | Request a valuation · List a property · General. 3 tabs, deep-linked by route |
| 03 | Form | Fields vary by intent. 2-col at sm for name/phone |
| 04 | Office [new] | Two-country office list, UG expanded. Paper card · hours · WhatsApp |
| 05 | Map *(photo)* | Leaflet, Kampala, captioned as street-level. `h 380`, lazy, client-only |

- **Valuation form** — name · phone · **what is being valued** (the three asset classes) · **what it is
  for** (the five purposes) · location · message. The two middle fields are the matrix from A-03 as
  selects, so a visitor arriving from a matrix cell finds **both already filled** and the route carries
  the state.
- **List-a-property form** — name · phone · property type · location · asking-price expectation
  (optional). Five fields. Nothing about valuation purpose.
- **General form** — name · email · message. Three fields. Do not make someone pick a department to ask a
  question.
- **Tabs** — `role="tablist"`, each tab a real route (`/contact/request-a-valuation` etc.) so they are
  linkable and back-button-correct, not client-only state. `min-height 52px`, equal flex, active tab green.
- **Submit state** — keep the current honesty ("not sent yet, the site is in build") until there is an
  endpoint. When there is one, the confirmation must state **what happens next and by when**, not "thank
  you".
- **Office card** — Uganda expanded (address, phone, email, hours); Kenya as a collapsed summary row
  linking to the `.ke` site. Nine offices listed in full would bury the one that matters.

---

## Build order

**A-02 and A-03 first** — they carry the repositioning and neither depends on new photography. **A-04**
templates next, launching as sections of the A-03 hub. **A-06** refinements any time. **A-07** only once a
note exists. **A-01**'s credential line ships the day the registration numbers are confirmed.

A-02's standing schedule and A-01's credential line both render `— pending` or return `null` until CMT
confirms registration numbers. The layouts hold either way — but they are designed around a claim that is
not verified yet, so the build should not get ahead of that. See `SITE-STRATEGY.md` §7, ask 1.
