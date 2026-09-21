# Build plan: putting a real backend under the CMS

Internal companion to `WORKPLAN.md`, which is the version CMT has. That one says what is being
delivered. This one says how, and records the decisions so they do not get re-argued halfway
through.

**Eight working days left:** Mon 21, Tue 22, Wed 23, Thu 24, Fri 25, Mon 28, Tue 29, Wed 30.

---

## 1. Where we actually are

Better than the workplan implies, because two of the three hard parts are already built.

| | |
|---|---|
| Public site | Done. 54 routes, palette and type audited, responsive |
| Admin CMS interface | Done. 13 screens, listings and agents with full create and edit, inquiries, partners, testimonials, settings |
| Backend | Nothing |

The admin dashboard is real work already finished. What it lacks is anything underneath it: the
store is `localStorage`, seeded from `src/data/*.ts`, and its edits never reach the public site.

**That means the remaining job is not "build a CMS". It is "put a database under the CMS that
exists".** The seam is a single file, `src/lib/admin/store.tsx`. Every screen already calls into
it. Swap what is behind those calls and the whole dashboard becomes real.

---

## 2. Storage: can Postgres hold the images?

It can. It should not.

**Postgres has two ways to store binary data.** `bytea` is a byte-array column, stored inline and
moved out of line by TOAST above a couple of kilobytes, with a hard ceiling of 1GB per value.
Large Objects (`pg_largeobject`) are the older streaming API, addressed by OID, good to 4TB, and
they need explicit cleanup with `vacuumlo` or they leak rows when the referencing record is
deleted.

**Neither is right for property photographs:**

- Every image request would travel through the application and consume a database connection.
  Photographs are the heaviest, most-requested thing on the site and the one thing that should be
  cached hardest at the edge. Through Postgres, none of it caches at a CDN.
- Backups inflate with the images. Sixteen listings at five photographs each is manageable. Real
  stock is not, and restores get slow exactly when you need them fast.
- `next/image` wants a URL it can fetch, resize and cache. It cannot optimise a blob.
- Database storage costs several times more per gigabyte than object storage.
- This market is on metered mobile data. Images have to be small, cached and served from
  somewhere cheap. That is the whole argument.

**What to do instead** is the standard split: bytes in an object store, a URL and its metadata in
Postgres. The `Listing.images` shape already in `src/lib/types.ts` (`{ src, alt }`) barely changes.

### The recommendation

**Supabase.** It gives Postgres, S3-compatible object storage with an image transformer, and real
authentication, from one vendor with one set of credentials.

That last part matters more than it looks. Admin auth is currently a `localStorage` flag with a
bypass button, honestly labelled in the code as theatre. It has to become real before this site
goes on cmtrealtors.com, and Supabase means we are not also picking and wiring an auth provider in
the same week.

> **This does not break the promise made to CMT.** The workplan commits to a custom CMS built from
> scratch, and that is exactly what the admin dashboard is. Supabase is a database, a file bucket
> and a login service underneath it. It is infrastructure, not a CMS. Nothing about the interface
> CMT was shown changes.

**Alternatives, if the recommendation is rejected:**

- **Cloudflare R2 + Neon.** R2 charges no egress, which is the cheapest way to serve a lot of
  photographs. Two vendors instead of one, and auth still unsolved.
- **Vercel Blob.** Simplest if hosting is Vercel, and the most expensive per gigabyte.

### What this needs in the app

Remote images have to be allowlisted before `next/image` will touch them. In this version of
Next, that is `images.remotePatterns` in `next.config.ts`, matched on protocol, hostname, port,
pathname and search. Getting this wrong is the single most common way an image pipeline silently
fails in production, so it gets done on the day the bucket is created, not at cutover.

---

## 3. The data model

No modelling work is needed. `src/lib/types.ts` already defines `Listing`, `Agent`, `Partner`,
`Testimonial`, `Registration` and `Office`, and `src/lib/admin/types.ts` adds the admin-side
shapes. The tables follow those, and `src/data/*.ts` becomes the seed script rather than being
thrown away.

One addition: **inquiries**, which currently exist only as an admin screen with no source. The
forms have to write into that table for the screen to mean anything.

---

## 4. The eight days

**Mon 21 — decide and provision.**
Confirm the stack. Create the Supabase project, the storage bucket and the hosting project, all in
CMT's name. Write the schema from the existing types. Chase CMT on the information list, which is
still the critical path and has been since the 17th.

**Tue 22 — the store becomes real.**
Seed the database from `src/data/*.ts`. Replace the internals of `store.tsx` with real queries.
The admin dashboard now reads and writes Postgres, with no screen changing.

**Wed 23 — images and auth.**
Storage bucket wired into `ImageGalleryManager`. `remotePatterns` configured and verified against a
real uploaded file. Supabase Auth replaces the `localStorage` gate, and the bypass button goes.

**Thu 24 — the public site reads the database.**
Listings, property detail, agents, partners and testimonials switch from static imports to
queries. On-demand revalidation wired to saves, so an edit in the CMS reaches a statically
generated page without a redeploy.

**Fri 25 — forms, email, and the client sees it.**
Server actions for all three intents. Validation, honeypot, rate limiting. Submissions land in the
inquiries table and appear on the admin screen. Transactional email out, with SPF, DKIM and DMARC
on the sending domain. **Client review on the staging URL. CMT's information deadline.**

**Mon 28 — launch infrastructure.**
Everything in section 5 below. This is the day the site stops being a prototype.

**Tue 29 — cutover.**
DNS, SSL, redirects live. Smoke test every route, submit a real enquiry through every form, check
every old URL.

**Wed 30 — handover.**
Training, then the manual written from what was actually asked. Monitoring, backups, one tested
restore, accounts confirmed in CMT's name.

---

## 5. The pre-launch gate

None of this is in the client workplan, and all of it has to be true before DNS moves.

- [ ] **`/admin` is not reachable by the public.** Real auth, middleware on the route group, and
      `robots.txt` disallowing it. Thirteen admin routes are currently statically generated and
      crawlable, and the login accepts anything.
- [ ] `robots.txt` and `sitemap.xml`, both generated from the route data
- [ ] 301 map from the existing WordPress URLs, tested before the switch rather than after
- [ ] Structured data, and Open Graph images so a shared link is not a bare URL
- [ ] Privacy policy and terms. The site collects names, phones and emails, which brings Uganda's
      Data Protection and Privacy Act into scope
- [ ] Analytics, with the valuation request tracked as a conversion
- [ ] A backup of the existing WordPress site, taken before anything changes
- [ ] DNS TTL lowered a day ahead, so a bad switch is reversible in minutes

---

## 6. Risks

| | |
|---|---|
| **CMT's information** | Still the critical path, unchanged since the 17th. The site degrades honestly without it, so it launches either way, but the credentials reading "pending" wastes the strongest argument the firm has |
| **`/admin` shipping open** | The one thing on this list that is a genuine incident rather than a disappointment. It is a hard gate on Tue 29 |
| **Image pipeline found late** | Scheduled Wed 23 against a real upload, not assumed working at cutover |
| **Registrar access** | Requested on the 17th. This delays more launches than any technical problem |
| **Nobody has browsed the site yet** | Everything is verified by clean builds. Thu 24 and Fri 25 carry the first real looks |

---

## 7. Open questions for the team

1. Supabase, or R2 plus Neon? Decide Monday, not Wednesday.
2. Where hosting lands, and whether the account is CMT's from day one or transferred later.
3. Who receives enquiry emails, and does the same address work the lead queue in the CMS?
4. Does CMT want the blog live at launch, which needs a first post written?
