# Workplan, 17 to 30 September 2026

Two weeks is **10 working days**: Thu 17, Fri 18, Mon 21 to Fri 25, Mon 28 to Wed 30.

This plan covers the Phase 1 scope list plus the work that list does not name but that a launch
still needs. Companion to `SITE-STRATEGY.md` (why the site is shaped as it is),
`LAYOUT-SPECS.md` (how each page is built) and `OPEN-ITEMS.md` (what only CMT can supply).

---

## 1. Where the project actually is

**Done.** The frontend is substantially built: 44 routes, the navigation restructured around
valuations, the instruction matrix, the About section with the standing schedule and survey
baseline, three contact intents, and the property explorer. Palette and typography have both been
audited against WCAG and are on a documented scale. It builds clean.

**Not started.** Everything behind the glass:

| | Status |
|---|---|
| Database, CMS, admin auth | Nothing. All content is static TypeScript in `src/data/` |
| Form submission | UI only. No API route, no server action, no storage, no email |
| `sitemap.xml`, `robots.txt` | Absent |
| Structured data, Open Graph images | Absent |
| Analytics, Search Console | Not installed |
| Privacy policy, terms, cookie notice | No routes exist |
| Staging environment, hosting, DNS | Not provisioned |
| Redirect map from the WordPress site | Not written |

---

## 2. What the scope list is missing

The list is a good skeleton. These are the things that are not on it and that will each stop a
launch if they are found late.

### A. Content and assets from CMT — the critical path

There is no line item for chasing content, and it is the single most likely reason this slips.
`OPEN-ITEMS.md` lists 12 outstanding items. Three of them block the repositioning the whole site
is built on: the registration numbers, the Uganda/Kenya entity relationship, and which service
lines CMT actually wants work in. Also outstanding: headshots, the full client list, the office
mobile for WhatsApp, confirmed office hours, and real listings with real photography.

The site is built to degrade honestly without these, so it can launch with gaps. But every gap is
a weaker launch, and none of them are things we can produce ourselves.

**This work starts on day 1 and runs in parallel with everything else.**

### B. The backend the CMS list implies but does not name

"DB setup" and "property management" skip several things that sit between them:

- **The API layer** between the CMS and the frontend, and whether pages stay statically generated.
- **Migrating `src/data/*.ts` into the database.** The types are already defined and clean, which
  makes this a mapping job rather than a modelling one, but it is still a day of work.
- **Revalidation.** Most routes are statically generated at build time. An editor changing a price
  must see it on the live site without a redeploy. That needs on-demand revalidation wired to the
  CMS save hook, or those routes move to dynamic rendering and lose their speed.
- **Image uploads.** Photography is currently optimised at build time from `public/`. CMS-uploaded
  images come from somewhere else and need a storage bucket, a CDN, and `next.config.ts` remote
  patterns before `next/image` will touch them. This is routinely discovered late.

### C. Forms, beyond "lead capture"

Every form on the site is UI only and says so on the page. Making them real needs: a server
action, server-side validation, spam protection, delivery, and storage. Spam protection should be
a honeypot plus rate limiting rather than a CAPTCHA, which costs a third-party key and hurts the
mobile performance this market needs.

Also undecided: **where a lead goes.** An inbox, the CMS, or both? If a valuer is meant to act on
it the same working day, an unmonitored database table is not enough.

### D. Email infrastructure

Not on the list at all. Needs a transactional provider, an auto-reply to the enquirer, a
notification to the office, and **SPF, DKIM and DMARC records on the sending domain**. Without
those, notifications land in spam and nobody notices until a lead complains that they never heard
back.

### E. Legal and compliance

No privacy policy, terms, or cookie notice exists. The site captures names, phone numbers and
email addresses, which brings it under Uganda's **Data Protection and Privacy Act 2019**. Worth
confirming with CMT whether they are registered with the Personal Data Protection Office, since a
regulated professional firm is exactly the kind of organisation expected to be.

Treat this as a real task with a real owner, not a footer link added on launch morning.

### F. SEO, beyond keywords

Keyword selection is on the list. These are not, and matter more:

- **A 301 redirect map from the old WordPress URLs.** The current site has live pages with
  existing rankings and inbound links. Losing them at cutover is a direct, measurable cost.
  `Plan.md` deferred this to the backend phase, and this is that phase. It has to be written
  before DNS changes, not after.
- `sitemap.xml` and `robots.txt`, both generated by Next.js from the route data.
- **JSON-LD structured data**: `ProfessionalService` for the firm, with the offices; `Person` for
  the directors once credentials are confirmed.
- **Open Graph images.** There are none, so every share of this site currently renders as a bare
  link.
- Google Search Console verification and sitemap submission.
- Google Business Profile for the Kampala office, which is most of local search in this market.

### G. Analytics

Not on the list. Needs an analytics install, conversion tracking on the valuation request (the
one event that matters), and agreement on what gets reported to CMT and how often.

### H. QA, performance and accessibility

Not on the list. "Responsiveness" is there, which is part of it.

- **Nobody has looked at this site in a browser yet.** Everything built so far is verified by
  clean builds, not by eye. Several pieces are the kind that compile fine and look wrong: the
  matrix reflow below `md`, the survey baseline rotation, the two-tier filter disclosure.
- Real-device testing on mid-range Android over metered data, which is what this market is on.
- A performance budget. The brief made mobile data cost an explicit constraint.
- An accessibility pass. The palette and focus ring now clear WCAG AA by measurement, but that is
  contrast only, not keyboard traversal or screen reader order.

### I. Environments and cutover

"DNS rerouting" and "hosting setup" are on the list. The rest of a safe cutover is not:

- A **staging environment behind basic auth**, so the client reviews a real site and Google does
  not index it.
- A **full backup of the existing WordPress site** before anything changes.
- **Lowering DNS TTL** 24 to 48 hours ahead of the switch, so a mistake is reversible in minutes
  rather than a day.
- SSL certificate issuance and verification.
- A content freeze on the old site during cutover.
- A written rollback plan.

### J. After launch

"User training" and "user manual" are on the list, which is more than most plans have. Missing:

- A **defects window**, typically 30 days, with what counts as a defect versus a change request.
- Uptime monitoring and an alert that reaches a person.
- Automated database backups, and one tested restore.
- Who holds the accounts. Domain, hosting, database, email and analytics should be in CMT's name
  with us granted access, not the other way round.

### K. "Website integration" was left blank

Best guess at what belongs there, all of it small: WhatsApp Business deep links (blocked on the
office mobile), Google Maps or the existing Leaflet map, social profile links, and a mailing list
signup if the Insights notes are going to have subscribers.

---

## 3. The honest reading of the timeline

The full scope as listed, with a custom-built CMS, is a four to six week job. It does not fit in
10 days.

It fits if one decision goes the right way.

> **Do not hand-build the CMS.** Property management, blog management, query management, lead
> capture, auth, roles, media handling and an admin UI is most of the remaining budget. A headless
> CMS gives all of it on day two. **Payload** is the strongest fit here: it runs inside the
> existing Next.js app rather than beside it, uses Postgres, and brings auth, roles, the admin
> panel and media handling with it. Sanity or Directus are reasonable alternatives.
>
> Building it by hand costs roughly two of the ten days and buys nothing CMT will ever see.

With that decision made on day 1, the plan below lands a launched, CMS-backed site on **Tuesday 29
September**, leaving Wednesday 30 as buffer and training. Launching on the last day of a plan
leaves nowhere to go when something breaks.

---

## 4. The plan

Owners: **D** development, **C** CMT, **B** both.

### Week 1

**Thu 17 — decisions, accounts, and the content chase**
- **B** Send CMT the content request, structured as a checklist with a deadline of Fri 25. Drawn
  straight from `OPEN-ITEMS.md`, ordered by what blocks most.
- **D** Choose the CMS and commit to it. Provision: hosting, database, storage bucket,
  transactional email, analytics. **All accounts created in CMT's name.**
- **C** Grant registrar and current-host access. Take a full backup of the WordPress site.
- **D** Write the redirect map: every live URL on the old site to its destination on the new one.

**Fri 18 — schema and scaffold**
- **D** CMS installed and running. Collections modelled on the existing types in `src/lib/types.ts`:
  listings, insights, team, clients, plus leads. The types are already clean, so this is mapping.
- **D** Auth and roles. Admin and editor.
- **D** Staging environment live behind basic auth, `robots.txt` blocking it.

**Mon 21 — content layer**
- **D** Migrate `src/data/*.ts` into the database. Keep the static files as the seed script.
- **D** Repoint listings, categories and property detail at the CMS.
- **D** On-demand revalidation wired to the CMS save hook, so an edit reaches a static page.

**Tue 22 — forms and leads**
- **D** Server actions for all three intents. Validation, honeypot, rate limiting.
- **D** Leads stored and visible in the CMS, with status so a valuer can work the queue.
- **D** Transactional email: notification to the office, auto-reply to the enquirer.
- **D** SPF, DKIM, DMARC on the sending domain.

**Wed 23 — media and the rest of the CMS**
- **D** Image upload pipeline: bucket, CDN, `next/image` remote patterns, sensible size presets.
- **D** Property management end to end. Create, edit, publish, unpublish, reorder, feature.
- **D** Insights and blog management end to end.

**Thu 24 — the first real look**
- **D** Run the whole site in a browser at 390, 768, 1024 and 1440. Fix what the build could not
  catch. The matrix reflow, the survey baseline rotation and the filter disclosure are the three
  most likely to need work.
- **D** Real-device pass on mid-range Android.
- **D** Accessibility pass: keyboard traversal, focus order, screen reader headings.

**Fri 25 — review and content load**
- **D** Performance pass against a budget. Images, fonts, the Leaflet bundle.
- **B** **Client review on staging.** Walk the site with CMT, capture everything in one list.
- **C** **Content deadline.** Whatever has arrived goes in; whatever has not stays gated and
  visibly pending, which the site already handles.

### Week 2

**Mon 28 — SEO and legal**
- **D** `sitemap.xml`, `robots.txt`, JSON-LD, Open Graph images, per-route metadata review.
- **D** Apply the agreed keywords to titles, descriptions and headings. Refine.
- **D** Redirect map implemented and tested against the live old URLs.
- **B** Privacy policy, terms and cookie notice. CMT to confirm their data protection position.
- **D** Analytics installed, conversion tracking on the valuation request.

**Tue 29 — cutover**
- **D** TTL already lowered. Final content freeze on the old site.
- **D** DNS switch, SSL issued and verified.
- **D** Smoke test: every route, every form end to end with a real submission, every redirect.
- **D** Search Console verified, sitemap submitted.
- **B** Google Business Profile claimed or updated.

**Wed 30 — handover**
- **B** **Training session** with whoever will run the site. Adding a property, writing a note,
  working the lead queue.
- **D** **User manual**, written from the training session rather than before it, so it answers
  the questions they actually asked.
- **D** Monitoring, alerting and automated backups live. One restore tested.
- **B** Account handover confirmed. Defects window starts.

---

## 5. Critical path and risks

**The critical path is content, not code.** Everything in section A is outside our control and
gates the quality of the launch, not its date. The site is built to degrade honestly, so it will
launch either way, but a launch with the credentials still reading "pending" wastes the strongest
argument the firm has.

| Risk | Likelihood | What we do about it |
|---|---|---|
| Content arrives late or not at all | High | Site already degrades honestly. Launch without it, switch it on later with one edit per item |
| A custom CMS is attempted | Fatal to the date | Settle it on day 1 |
| Image pipeline found late | Medium | Scheduled on day 5, not left to cutover |
| Old URLs not mapped before DNS | Medium | Redirect map is a day 1 deliverable, not a launch-day one |
| Registrar access slow to obtain | Medium | Requested on day 1. This has killed more launch dates than any technical problem |
| Browser review finds real layout problems | Likely | A full day is already reserved on Thu 24 |

## 6. Definition of done

A launch is complete when all of these are true:

- [ ] Every route resolves, on the live domain, over HTTPS
- [ ] Every old URL either resolves or 301s to a sensible destination
- [ ] A test enquiry through each of the three forms arrives in the office inbox and in the CMS
- [ ] The auto-reply arrives and does not land in spam
- [ ] CMT can add a property, publish it, and see it live without calling us
- [ ] `sitemap.xml` submitted and Search Console reporting no critical errors
- [ ] Analytics recording a valuation request as a conversion
- [ ] Privacy policy live and linked
- [ ] Backups running, one restore tested
- [ ] Every account in CMT's name
- [ ] Manual delivered, training done, defects window agreed in writing

---

## 7. What is explicitly not in these two weeks

Naming these now avoids an argument later.

- Real property photography and the full real stock. Arrives when CMT supplies it.
- The Insights section going live. It stays out of the navigation until the first note exists,
  by deliberate decision.
- Kenya as a full second site. Until the entity relationship is confirmed, Kenya is a linked
  practice, not a second instance.
- Any purpose page promoted from a section of the `/valuations` hub to its own route. Phase 2.
- Client portal, saved searches, property alerts, online payments.
