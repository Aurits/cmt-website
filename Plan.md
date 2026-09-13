# CMT Realtors Website Redesign — Frontend Build Brief

## 1. Project Context

CMT Realtors is a 15+ year Kampala real estate valuation and consultancy firm, regulated by the Uganda Institution of Surveyors, serving banks, government bodies, and corporate clients. Their current site (cmtrealtors.com, WordPress/Elementor) is dated and product-first. This is a full redesign, starting with a frontend-only prototype. Backend, authentication, and a staff CMS are a later phase and are explicitly out of scope right now.

## 2. Read This First

- Re-read this brief in full, and re-check the actual repo, before writing any code. Do not rely on assumptions carried over from a previous session.
- This phase is frontend/UI only. Do not scaffold a database, authentication, or admin CMS. Listings, partners, agents, and testimonials are static/mock data for now.
- If anything in this brief is ambiguous, or a decision is missing, stop and report it rather than guessing.
- Use the brand hex codes below exactly. Do not approximate or auto-generate a palette from the logo.
- All non-logo images must come from free, commercially licensed sources (see Section 10). Never use a photo of a specific, identifiable Kampala building without confirmed rights, this is a real legal risk for the client, not a style preference.

## 3. Brand

### Colors

- Deep Green (primary): `#143d1e`
- Gold/Amber (accent): `#daa706`
- Cream (background/surface): `#f7f2dd`
- Black/near-black (body text): `#000000`, but soften to a near-black if pure black reads too harsh against the cream background. Use judgement here and flag the choice made.

### Logo

- File: `cmt-logo-01.png` (included in this handoff). Place at `public/brand/cmt-logo.png`.
- It's a self-contained badge: a white "CMT" serif wordmark with "REALTORS LIMITED" on a cream tag underneath, both sitting on a solid deep-green tile. Use it as-is wherever it appears, it carries its own background. Do not try to strip the green or recolor it.
- There is no separate reversed or text-only logo variant yet. If a design needs the logo treated differently (e.g. a small monochrome favicon), flag that as a follow-up need rather than fabricating a variant.

### Typography

Decision: **Inter** for body and UI text, **Fraunces** for headline and display accents. Both are free (Google Fonts).

Reasoning: the logo's wordmark is a confident, tall serif. A serif accent on headlines keeps the new site visually connected to the existing mark instead of feeling like a mismatched rebrand, while Inter keeps navigation, listings, and forms clean and legible at small sizes on mobile. Both families are widely supported and age slowly rather than reading as a passing trend.

## 4. Design Principles

Separate what should stay structurally fixed (grid, type hierarchy, spacing, component patterns, information architecture) from what can be refreshed cheaply later (hero imagery, accent usage, copy). That's the realistic version of "a site that lasts," rather than promising a look that never needs a refresh.

Build mobile-first. A large share of visitors will be on phones, often on metered mobile data, so keep pages light: compressed images, no autoplay video, no heavy JS beyond what Next.js needs. Keep navigation shallow (the six items below, nothing deeper without a strong reason) and CTAs reachable within one or two taps.

Lead with identity before product. The homepage and the nav order both establish who CMT is and why they're credible before asking the visitor to search listings.

## 5. Information Architecture

Nav order: **Home → About Us → Services → Property Listings → Our Clients → Contact**, plus a persistent "List Your Property" CTA button in the header, and a visible phone/WhatsApp contact.

## 6. Page-by-Page Structure

### Home
1. Header/nav as above
2. Hero: identity-first headline + subcopy, two CTAs (Browse Properties / Request a Valuation), quick filter tabs underneath (Buy, Rent, Value a Property)
3. Stats strip: years in business, institutions served, cities covered, regulatory accreditation
4. About/Why Choose Us: short identity section
5. Property categories grid: Residential, Commercial, Industrial, Land, Agricultural, each a card with an image and short label
6. Featured listings: clean cards, image, price, type, city, CTA
7. Services overview: brief cards, each with its own CTA
8. Our Clients preview: categorized partner logos (see Section 9)
9. Testimonials: real, named entries only, do not carry over the placeholder Lorem ipsum text from the current site
10. Market Insights teaser: a "more coming soon" placeholder is fine for this phase
11. Final CTA banner + footer

### About Us
- Intro tied to the "Trusted Partner in Real Estate Valuation & Consultancy" identity
- Track record: 15+ years, nationwide coverage (Kampala, Gulu, Mbale, Mbarara), regulated by the Uganda Institution of Surveyors, institutions served count
- Company story/timeline (placeholder content, real copy is an open item, see Section 14)
- Meet the team: agent/valuer profiles with photo, name, role (current site lists Kanshabe Lindah and Waniala Andrew)
- Accreditation and membership badges
- CTA: Talk to Our Team

### Services
- Framed around what the visitor needs, not internal department names
- Service cards, each with a short description and its own CTA
- Exact service list is an open item, use valuation and consultancy as placeholders for now (see Section 14)
- CTA banner: Request a Consultation

### Property Listings
- Main listings page: filter bar (category, price, beds/baths, location), sortable grid, pagination
- Five category landing pages: Residential, Commercial, Industrial, Land, Agricultural, each with a category image, short description, filtered grid, category-specific CTA
- Listing card: image, price, category badge, key specs, city, "View Details" + "Contact Agent"

### Property Detail
- Image gallery
- Key facts panel: price, type, size, beds/baths, location pin (Leaflet map)
- Full description
- Agent contact card: photo, name, phone, WhatsApp, email
- Inquiry form (UI only, no backend submission this phase)
- Related/similar listings
- CTA: Schedule a Viewing

### Our Clients
- Categorized sections, see Section 9 for the actual current list
- Logo grid per section
- CTA: Talk to Us

### Contact
- Contact form: name, email, phone, message, subject dropdown (General / Valuation / Listing), UI only for this phase
- Office address, map (Leaflet), phone, email, WhatsApp link
- Office hours
- Secondary path for owners wanting to submit a property

## 7. Reusable Components

Define these once and reuse across pages rather than rebuilding per page:

- Header/Nav
- Footer
- Stats Strip
- Property Card
- Category Card
- Testimonial Card
- Agent Card
- CTA Banner
- Partner Logo Grid (supports categorized sections)

## 8. Property Categories

Residential, Commercial, Industrial, Land, Agricultural. All five need a landing page and a representative category image (see Section 10 for sourcing rules). Land and Industrial are new additions the current site doesn't have as standalone categories.

## 9. Partners / Clients (current, categorized)

- **Banks & Financial Institutions:** Bank of Uganda, Standard Chartered, UBA, GTBank, Stanbic Bank, KCB Bank, African Development Bank
- **Government & Regulatory Bodies:** Uganda Communications Commission (UCC), National Water and Sewerage Corporation (NWSC)
- **Corporate & Development Partners:** Vivo Energy, Vision Fund Uganda, UNFCU (UN Federal Credit Union)

UNFCU could arguably sit under Banks instead of Corporate & Development Partners, confirm with the client if the distinction matters to them. These are existing partner logos, already public on the current site, and can be reused rather than resourced.

## 10. Image Sourcing Rules

- Use free, commercially licensed stock libraries only: Unsplash, Pexels, Pixabay
- Never use a photo of a specific, identifiable Kampala building or landmark without confirmed rights, even in the background of a shot
- Category imagery should be generic and representative (e.g. a generic modern apartment exterior for Residential, a generic warehouse for Industrial), not tied to a real named property
- Real photography of CMT's actual managed listings comes in a later phase, once the client supplies it

## 11. Calls to Action

CTAs are required in: the homepage hero, every listing card, every property detail page, every category page, the services page (per service), and a sticky mobile CTA bar (call + WhatsApp + valuation) site-wide on phones.

## 12. Tech Stack (This Phase)

- Next.js (App Router), TypeScript, Tailwind CSS
- Static/mock JSON data for listings, categories, partners, testimonials, and agents, no database this phase
- Maps: Leaflet + OpenStreetMap (free, no API key required)
- Forms are UI only, no backend submission yet
- `next/image` for optimization, mobile performance is a priority given typical mobile data costs in this market

## 13. Explicitly Out of Scope for This Phase

- Database, backend API, authentication, staff/admin CMS
- Real property data, functional inquiry form submission
- SEO redirects and migration from the old WordPress site (handled when the backend phase starts)

## 14. Open Items, Needs From the Client

- Full services list, for the Services page
- Company history/timeline, for About Us
- Confirmation on where UNFCU sits in the partner categories
- Eventually: real listing photography, real named testimonials (do not reuse the current site's placeholder Lorem ipsum testimonials under any circumstance)