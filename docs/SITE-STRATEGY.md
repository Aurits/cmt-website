# Site strategy — positioning, naming and information architecture

Recommendation for the CMT Realtors redesign, prepared 15 September 2026 from published material.
Companion to `LAYOUT-SPECS.md`, which specifies how each page in the sitemap below is built.

The prototype is well built and the wrong size. CMT is a two-country chartered practice whose lead
director is RICS-qualified — and the site currently presents them as a Kampala estate agent with four
provisional services. This is the case for a repositioning, and the sitemap that follows from it.

---

## 1. What the research changed

Two facts from CMT's own published material reset the brief. Neither is in the prototype, and both are
worth more than anything currently on the homepage.

### Finding 1 — CMT is not a Kampala firm. It is an East African practice in two countries.

CMT Realtors is incorporated in Kenya (2010) with branches in Nairobi, Kisumu, Mombasa, Kisii and
Bungoma, alongside the Uganda practice in Kampala with branches in Gulu, Mbale and Mbarara. Their own
stated vision is "to be the leading valuation and real estate consultancy firm in East Africa Region."

The prototype says "a Kampala valuation and property consultancy firm."

### Finding 2 — The lead director is a chartered surveyor, MRICS, licensed in both countries.

Godfrey Omondi holds a Master's in Real Estate from the UK (distinction), a Bachelor's in Land
Economics, and is registered with both the Institution of Surveyors of Kenya and Uganda's Surveyors
Registration Board — registered to practise valuation globally through RICS. Co-director Michael
Oballim is **FISU**, a Fellow of the Institution of Surveyors of Uganda.

Neither appears anywhere on the site. **This is the single most valuable asset CMT is not using.**

### The gap, line by line

| | Prototype assumes | What CMT actually is |
|---|---|---|
| **Services** | 4 provisional services, list flagged as an open item | 6 service lines, spanning 7 asset classes and 6 valuation purposes — already published |
| **Asset classes omitted** | — | Plant & machinery, shares & stocks, business valuation, integral assets, specialised assets. The high-margin, low-competition lines: most Kampala "valuers" do land and buildings only |
| **Purposes omitted** | — | Financial reporting (IFRS), insurance reinstatement, tax planning, litigation support, portfolio and investment analysis. This is how buyers search — nobody types "valuation", they type "valuation for probate" |
| **People** | Two property agents, no headshots | The directors are the credibility. Plus valuers Namujjumbi Stella and Kingsley Adams |
| **Client count** | Hardcoded `12`; data file holds 14 | CMT states **20+ leading institutions**. Three different numbers, none confirmed |
| **Accreditation** | "Regulated by the Uganda Institution of Surveyors" | UIS + RICS + licensure in two jurisdictions — materially stronger, and almost no local competitor can match it |

### Correction to the project record

`OPEN-ITEMS.md` item 4 lists "full services list" as an open item awaiting the client. It is not open —
CMT publishes it in full on their own services page. The same is true of the company story (item 5):
founding dates, mission, vision, values and director biographies are all published.

**Two of the eleven open items can be closed today without contacting anyone.**

---

## 2. What the field looks like

Five firms competing for the same instructions.

| Firm | Top-level navigation | What it tells you |
|---|---|---|
| **CMT (today)** | Home · *Property Listings* · Services · Our Clients · About Us · Contact | Leads with the smallest, least defensible part of the business. Reads as an estate agency |
| **Knight Frank Uganda** | Find a Property · Services · People & Offices · *Blog* | Four items. People at top level. Blog is the moat — they publish the Kampala market review everyone else quotes |
| **Allied Property Surveyors** | About Us · *Services & Sectors* · Public Sector · Our Clients · Our Team | Sectors, not products. Breaks out Compulsory Purchase & Compensation and public sector — the Ugandan money lines |
| **Grok Appraisal** | Our Services · About Us · Our Team · Properties · *Compliance* · Resources · Contact | Services first, listings fourth. A whole nav item for Compliance — they understand who is buying |
| **Knight Frank global** | Valuation & Advisory → *Discover · Advise · Validate* | Organised by client type and decision, not department. "Trusted valuation intelligence for global portfolios" |

**The opening.** Every serious firm leads with the professional work and puts proof — people, sectors,
compliance, research — at top level. Only Knight Frank publishes blog posts. In a market where one foreign
firm owns the market-commentary ground and everyone else competes on adjectives, a quarterly note from a
chartered, dual-licensed local practice is the cheapest credibility CMT can buy.

---

## 3. The story

> **A figure is only worth the name on it.**

Every competitor claims accuracy, reliability, excellence and trust. Those words are free, so they prove
nothing. CMT's actual differentiator is not experience — it is **standing**: a signature recognised by
RICS, by two national regulators, and by the institutions already on the client list, including the
central bank.

That reframes the whole site. CMT does not sell valuations. It sells **a figure that survives the people
who will test it** — a credit committee, an auditor, an insurer, a tax authority, a judge. Everything on
the site should be arranged to answer one question: *will this number hold?*

**Proposed H1**
> A figure is only worth the name on it.

**Sub**
> CMT Realtors is a chartered valuation and property consultancy practice in Uganda and Kenya. Banks,
> auditors, courts and government bodies rely on our reports — and on the valuers who sign them.

**Alternative, if the client wants plainer**
> "Chartered valuations, Kampala to Nairobi." — factual, differentiating, and no competitor in Uganda
> can copy it.

---

## 4. The navigation

**About · Valuations · Advisory · Properties · Blog · Contact**

Six items, as the brief allows. Identity leads — as `Plan.md` requires — then the professional work,
with the agency arm demoted from first to third. A persistent **Request a valuation** button sits in the
masthead.

### About — *first; was "About Us"*

The brief requires identity before product, and for this firm that is the right call: the thesis in
section 3 is that CMT sells standing, which makes identity the product. It also serves the most valuable
visitor — a bank deciding whether to put CMT on its panel is making a judgement about the firm, not
shopping for a service.

The cost is real but small: leftmost is the highest-intent slot, and a referred client who needs a
valuation today has to skip past it. Two things pay that back:

1. **The label must promise something.** "About Us" is a utility link; consider **The firm**.
2. **The page must open on credentials** — RICS, two regulators, the central bank — not on a mission
   statement.

### Valuations — *was inside "Services"*

The word people search. Promoting it from a sub-item to a nav item is the single highest-value change.
This is 80% of the business and it currently shares a page with property management.

### Advisory — *was inside "Services"*

Everything that is not a valuation report: development appraisal, acquisition and disposal, asset and
facilities management, project management, research. Splitting these two is how Knight Frank, Savills
and every serious practice do it — because they are bought by different people, on different timelines,
at different prices.

### Properties — *was "Property Listings"*

"Listings" is estate-agent language and CMT is not primarily an estate agent. "Properties" is shorter,
warmer and less junior. It stays in the nav because it earns organic traffic — but third, not first.

**The label changes; the routes do not.** Merging `/listings` into `/properties` is not possible without
restructuring: `/properties/[slug]` already serves property detail, and a second dynamic segment
(`/properties/[category]`) at the same level is a Next.js route collision. The existing split is a
deliberate, documented decision in `OPEN-ITEMS.md`. Renaming would cost a migration across ~15 files plus
redirects, to fix a cosmetic mismatch between a nav label and a URL that no visitor reads — and SEO
migration is explicitly out of scope this phase (`Plan.md` §13). Revisit it there, where the redirects
have to be written anyway.

### Blog — *new*

The open ground. Two or three short notes a year on what CMT is actually seeing in inspections — which
corridors are absorbing stock, what banks are lending against. The prototype already has the teaser band
built and empty. One note turns it from a promise into proof.

### Contact

Unchanged, but the primary action moves out of it: **Request a valuation** becomes a persistent button
in the masthead, replacing "List Your Property". Valuation is the business; listing is a service.

### Considered and rejected

- **Keeping "Our Clients" in the nav.** It is CMT's strongest proof, but a low-intent click — nobody
  browses a logo wall. Better used as a strip on the homepage *and repeated on every valuation page*,
  where it answers the doubt at the moment it forms. It lives on as `/about/clients`.
- **"What we do" / "Who we help".** Warmer, but vaguer — and they bury the one word, *valuations*, that
  people are searching for. Human tone belongs in the sentences, not the nav.
- **"Services".** Accurate and invisible. It is the label a firm uses when it has not decided what it
  sells.

---

## 5. The sitemap

The valuation hub is built on two axes CMT already uses in their own material — *what you are valuing*
and *what you need it for*. Purpose pages are what convert; asset pages are what rank.

```
/                                     home — identity, proof, the three jobs
│
├── /about                            first in the nav, per the brief
│   ├── /people                       directors first, credentials visible      [new]
│   ├── /credentials                  RICS, UIS, SRB, Red Book, reg. numbers    [new]
│   ├── /clients                      was top-level
│   └── /offices                      4 Uganda + 5 Kenya, with the map          [new]
│
├── /valuations                       hub: the two-axis chooser
│   ├── by purpose — what the figure is for
│   │   ├── /for-lending              banks, mortgage security, forced-sale     [new]
│   │   ├── /financial-reporting      IFRS, audit, year-end                     [new]
│   │   ├── /insurance                reinstatement cost assessment             [new]
│   │   ├── /tax-and-litigation       disputes, probate, expert witness         [new]
│   │   └── /compensation             compulsory acquisition, public projects   [new]
│   └── by asset — what is being valued
│       ├── /property                 land, buildings, development sites        [new]
│       ├── /plant-and-machinery                                                [new]
│       └── /business-and-shares      shareholdings, going concern              [new]
│
├── /advisory                         hub
│   ├── /development                  feasibility, highest & best use           [new]
│   ├── /acquisition-and-disposal                                               [new]
│   ├── /asset-and-facilities-management                                        [new]
│   ├── /project-management                                                     [new]
│   └── /market-research                                                        [new]
│
├── /listings                         nav label becomes "Properties" — routes unchanged
│   └── /[category]                   the five classes, as now
├── /properties
│   └── /[slug]                       detail page, as now
│
├── /blog                                                                   [new]
│   └── /[slug]                       market notes, 2–3 a year
│
└── /contact
    ├── /request-a-valuation          the one form that matters                 [new]
    └── /list-a-property
```

29 pages plus 16 property detail routes.

### Build it in two phases

**Phase 1 — ship without new content.** Rename the nav, split Valuations from Advisory, move Clients
under About, add `/about/people` and `/about/credentials`. Every purpose page can launch as a section of
the `/valuations` hub rather than its own route. Property routes stay where they are. This needs no client
input beyond confirming the credentials.

**Blog does not ship in phase 1.** The nav item stays out until the first note exists — an empty
blog advertises that the firm started something and stopped. Phase 1 therefore ships a
**five-item nav**: About · Valuations · Advisory · Properties · Contact.

**Phase 2 — as content lands.** Promote the five purpose pages to real routes, open `/blog` with the
first market note, add the Kenya offices. Each purpose page needs roughly 250 words and one worked
example — a single afternoon with a director, not a content project.

---

## 6. The wording

The current copy is not badly written — it is written about the firm instead of about the reader's
problem, and it spends its words on adjectives that every competitor also claims.

### Homepage hero

> **Today:** "15+ Years of Excellence in Property Valuation & Real Estate Solutions. Accurate, Reliable
> East African Leading Valuers."

> **Proposed:** A figure is only worth the name on it.

Four abstract nouns, none of which a competitor couldn't also claim, replaced by a claim only a
chartered firm can make — and one that *invites* the follow-up question the rest of the page answers.

### Services intro

> **Today:** "We deliver market driven valuation for all assets classes."

> **Proposed:** We value land, buildings, plant, machinery and shareholdings — and we state the basis we
> used, so the next person can check it.

"All asset classes" asks the reader to take your word for it. Naming five of them proves it, and the
second clause is the actual differentiator.

### Why choose us

> **Today:** "Why Choose CMT Valuers" — industry leadership, regulatory compliance, professionalism.

> **Proposed:** **Why institutions come back.** The Bank of Uganda, the African Development Bank and
> Standard Chartered do not re-instruct a valuer whose last report gave them trouble.

Nobody is persuaded by a firm telling them it is professional. They are persuaded by the central bank's
logo and a sentence explaining what it implies.

### Mission statement

> **Today:** "To provide the most reliable real estate consultancy services by accurately gathering and
> analyzing information, and using the most current technology…"

> **Proposed:** Cut it. Replace with: "Every report goes out under a named, registered valuer. If the
> figure is challenged, that person answers for it."

Mission statements are written for the boardroom wall. This one says the same thing as a promise the
reader can actually hold you to.

### Accreditation

> **Today:** "Regulated by the Uganda Institution of Surveyors."

> **Proposed:** Chartered through **RICS**. Registered with Uganda's Surveyors Registration Board and the
> Institution of Surveyors of Kenya. Reports prepared to **Red Book** standard.

The true position is far stronger than the stated one, and it is the sentence that wins DFI, audit and
cross-border work. It is currently nowhere on the site.

### Five rules for every line on the site

1. **Lead with the consequence, not the adjective.** Not "accurate valuations" — "a figure your credit
   committee can sign off on Friday".
2. **Name the reader's situation in their words.** "You have an offer, and the bank wants a valuation
   before it will release funds." People recognise their problem faster than your service.
3. **Use names and numbers; ban the four words.** *Leading, excellence, trusted, reliable.* If a sentence
   survives deleting them, it was always the better sentence.
4. **One idea per sentence.** The prototype already does this well. It is why the existing copy reads as
   though a person wrote it.
5. **Say what you don't do.** "We will not value a property we have not inspected." A stated limit is the
   most credible thing on a page full of claims.

---

## 7. What to ask CMT for

Ordered by what unblocks the most. The first three are worth more than every remaining design decision
combined.

1. **Registration numbers and the exact form of the credentials.** Omondi's MRICS number and RICS
   registration; Oballim's FISU and SRB numbers; the firm's own registration. Nothing goes on the site
   unverified — but verified, this is the whole pitch.
2. **The relationship between the Uganda and Kenya entities.** One firm, two arms? Two firms sharing a
   director? This decides whether the site is one regional site or two linked national ones — a
   structural decision, not a copy one.
3. **Confirmation of the full service list, and which lines they actually want work in.** Their site
   lists six. A site that pushes all six equally pushes none. Which three pay best?
4. **The 20+ client list, with permission to name them.** Fourteen logos are already public. The gap
   between 14 and "20+" is six institutions of free proof.
5. **Headshots and titles for the directors and valuers.** Currently initials on green. For a firm
   selling a signature, faces are not decoration.
6. **One redacted sample report.** Even a single blurred page on `/valuations` answers "what do I
   actually receive" better than any paragraph could.
7. **The office mobile for WhatsApp.** Still blocking every WhatsApp CTA on the site. One line in
   `src/data/site.ts`.
8. **Two real, named testimonials — or a decision to drop the section.** An honest empty state is better
   than invented quotes, but it is not better than a client list that already includes the central bank.

---

## Sources

All findings above are drawn from published material, retrieved 15 September 2026.

- cmtrealtors.com — `/`, `/about-us`, `/services`, `/our-clients`
- cmtrealtors.co.ke — `/`, `/team`
- knightfrank.ug/about-us · knightfrank.com/valuations
- alliedpropertysurveyors.com · grokappraisal.com
- srb.go.ug (Surveyors Registration Board) · surveyorsofuganda.org (Institution of Surveyors of Uganda)

**Caveat.** The credential claims are drawn from the Kenya site and third-party business directories,
not from CMT directly. Nothing about RICS should go live until they confirm registration numbers — that
is ask 1 above.
