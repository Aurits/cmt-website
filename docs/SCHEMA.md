# Schema and auth

The database and login design for the Supabase backend. Derived from the types already in
`src/lib/types.ts` and `src/lib/admin/types.ts`, and from the operations `src/lib/admin/store.tsx`
already performs, so the admin screens need no rewrite.

Companion to `BUILD-PLAN.md`.

---

## 1. Decisions taken first

**What goes in the database, and what stays in code.**

The admin has screens for listings, agents, partners, testimonials, inquiries and settings. It has
no screen for categories, valuation purposes, valuation assets or advisory services, and that is
correct. Those are not editorial content, they are the site's information architecture: the
valuation matrix, the five category landing pages and the advisory index are built from them, and
changing one means changing routes and copy, not just a row. **They stay in `src/data/*.ts`.**

Offices stay in code too, for now. `AdminSiteSettings` does not model them, and nine rows that
change once a year do not need a table.

**Surrogate keys, not slugs.**

Every table gets a `uuid` primary key with the human slug alongside it as a unique column. Admin
routes keep using the slug (`/admin/listings/[id]` already resolves by slug and that stays), but
foreign keys and storage paths reference the uuid.

The reason is concrete: retitling a property changes its slug. With a slug primary key, that
rewrites every child row and orphans every uploaded photograph. With a uuid, a retitle is one
column update and the files stay where they are.

**Text and CHECK, not Postgres enums.**

Status values are constrained by CHECK rather than `CREATE TYPE`. Postgres enums cannot drop a
value and adding one is awkward inside a transaction. Over a two-week build where the taxonomy may
still move, CHECK constraints are the safer shape, and the TypeScript unions remain the real
source of truth.

**`assignedListings` is never stored.**

`AdminAgent.assignedListings` mirrors `Listing.agentId` in the other direction. Storing both
guarantees they drift. It becomes a query.

---

## 2. Tables

```sql
-- ── people who can log in ──────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'editor' check (role in ('admin','editor')),
  created_at  timestamptz not null default now()
);

-- ── the team shown on the public site ──────────────────────────────────
create table agents (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,          -- 'godfrey-omondi'
  name          text not null,
  role_title    text not null,
  rank          text not null check (rank in ('director','valuer','agent')),
  based         text,
  bio           text,
  photo_path    text,                          -- storage path, not a URL
  phone         text,
  email         text,
  qualifications text[] not null default '{}',
  -- false until CMT confirms in writing. Gates every credential on the site.
  credentials_confirmed boolean not null default false,
  sourced_from  text not null default 'cmt' check (sourced_from in ('cmt','directory')),
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table agent_registrations (
  id             uuid primary key default gen_random_uuid(),
  agent_id       uuid not null references agents on delete cascade,
  authority      text not null,                -- 'RICS'
  authority_full text not null,
  jurisdiction   text not null,
  post_nominals  text,
  -- Null until confirmed. The unverified claim is simply never stored.
  number         text,
  confirmed      boolean not null default false,
  sort_order     int not null default 0
);

-- ── property ───────────────────────────────────────────────────────────
create table listings (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  reference    text not null unique,           -- 'CMT-R-1042'
  title        text not null,
  category     text not null check (category in
                 ('residential','commercial','industrial','land','agricultural')),
  listing_type text not null check (listing_type in ('sale','rent')),
  price        bigint not null,                -- UGX, whole shillings
  rent_period  text check (rent_period in ('month')),
  city         text not null,
  area         text not null,
  lat          numeric(9,6) not null,
  lng          numeric(9,6) not null,
  beds         int,
  baths        int,
  size         text not null,                  -- '420 sqm', already formatted
  size_label   text not null check (size_label in
                 ('Built area','Plot size','Land area','Floor area')),
  tenure       text not null check (tenure in
                 ('Freehold','Leasehold','Mailo','Customary')),
  summary      text not null,
  description  text[] not null default '{}',   -- one entry per paragraph
  features     text[] not null default '{}',
  agent_id     uuid references agents on delete set null,
  featured     boolean not null default false,
  valued_on    text,                           -- 'Mar 2026', drives the provenance badge
  status       text not null default 'draft' check (status in
                 ('published','draft','archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index listings_status_idx   on listings (status);
create index listings_category_idx on listings (category) where status = 'published';

-- Ordered, and a child table rather than jsonb because each row is a real file
-- in the bucket that has to be findable when the listing is deleted.
create table listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings on delete cascade,
  path       text not null,                    -- storage path
  alt        text not null default '',
  sort_order int  not null default 0
);

create index listing_images_listing_idx on listing_images (listing_id, sort_order);

-- ── clients ────────────────────────────────────────────────────────────
create table partner_groups (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,            -- 'banks'
  title       text not null,
  description text not null,
  sort_order  int  not null default 0
);

create table partners (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references partner_groups on delete cascade,
  name       text not null,
  short_name text,
  logo_path  text,
  verified   boolean not null default false,
  sort_order int  not null default 0
);

create index partners_group_idx on partners (group_id, sort_order);

-- ── testimonials ───────────────────────────────────────────────────────
-- Still empty on purpose. Real, named references only.
create table testimonials (
  id           uuid primary key default gen_random_uuid(),
  quote        text not null,
  name         text not null,
  organisation text not null,
  role_title   text,
  published    boolean not null default false,
  sort_order   int not null default 0
);

-- ── the blog ─────────────────────────────────────────────────────────
-- Shaped by LAYOUT-SPECS A-07: the index is a ruled list of date, title and a
-- one-line finding, each post carries a single pull figure, and the post page
-- has a sticky rail of key figures beside it.
create table blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  -- The one-line finding shown against the title in the index.
  finding         text not null,
  -- ~40 words, for the full-width "latest note" block at the top of the index.
  excerpt         text not null,
  body            text not null,               -- markdown
  -- The number that gets quoted and screenshotted. This is the reason to publish.
  pull_figure     text,                        -- '12.5%'
  pull_caption    text,
  -- The sticky rail: [{ label, value }]. A schedule, so jsonb rather than a table.
  key_figures     jsonb not null default '[]',
  author_id       uuid references agents on delete set null,
  cover_path      text,                        -- storage path
  meta_description text,
  tags            text[] not null default '{}',
  status          text not null default 'draft' check (status in
                    ('published','draft','archived')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index blog_posts_published_idx
  on blog_posts (published_at desc) where status = 'published';

-- ── enquiries ──────────────────────────────────────────────────────────
create table inquiries (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in
                  ('valuation','agent-contact','list-a-property','general')),
  status        text not null default 'New' check (status in
                  ('New','In Progress','Contacted','Closed')),
  name          text not null,
  phone         text,
  email         text,
  message       text not null,
  listing_slug  text,                          -- deliberately not an FK: the
                                               -- enquiry outlives the listing
  valuation_asset   text,                      -- carried from the matrix
  valuation_purpose text,
  source_path   text,                          -- which page it came from
  created_at    timestamptz not null default now()
);

create index inquiries_status_idx on inquiries (status, created_at desc);

-- ── settings ───────────────────────────────────────────────────────────
-- One row, enforced. Matches AdminSiteSettings.
create table site_settings (
  id                serial primary key check (id = 1),
  name              text not null,
  short_name        text not null,
  tagline           text not null,
  description       text not null,
  url               text not null,             -- metadataBase, needed by OG images
  phone_display     text not null,
  phone_href        text not null,
  email             text not null,
  whatsapp          text,                      -- null until CMT supplies it
  address           jsonb not null,            -- building, line1, street, city, country
  address_lat       numeric(9,6) not null,     -- the contact and offices maps
  address_lng       numeric(9,6) not null,
  nairobi_address   text,
  cities            text[] not null default '{}',
  regulator         text not null,
  region_confirmed  boolean not null default false,
  hours             jsonb not null default '[]',
  hours_confirmed   boolean not null default false,
  years_in_business text not null,
  stats             jsonb not null default '[]',
  updated_at        timestamptz not null default now()
);
```

### The derived query that replaces `assignedListings`

```sql
create view agent_listings as
  select a.id as agent_id, l.slug, l.title, l.status
  from agents a join listings l on l.agent_id = a.id;
```

---

## 3. Row level security

Deny by default, then open only what the public actually needs. Enable RLS on **every** table,
including the ones that look harmless.

```sql
alter table profiles            enable row level security;
alter table agents              enable row level security;
alter table agent_registrations enable row level security;
alter table listings            enable row level security;
alter table listing_images      enable row level security;
alter table partner_groups      enable row level security;
alter table partners            enable row level security;
alter table testimonials        enable row level security;
alter table inquiries           enable row level security;
alter table site_settings       enable row level security;

-- Is the caller staff? Security definer so the policy can read profiles
-- without recursing through its own RLS.
create function is_staff() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;
```

**Public read, and only of what is published.**

```sql
create policy "public reads published listings" on listings
  for select to anon using (status = 'published');

create policy "public reads images of published listings" on listing_images
  for select to anon using (exists (
    select 1 from listings l
    where l.id = listing_id and l.status = 'published'
  ));

create policy "public reads the team"     on agents         for select to anon using (true);
create policy "public reads credentials"  on agent_registrations for select to anon using (true);
create policy "public reads partners"     on partners       for select to anon using (true);
create policy "public reads groups"       on partner_groups for select to anon using (true);
create policy "public reads settings"     on site_settings  for select to anon using (true);

create policy "public reads published testimonials" on testimonials
  for select to anon using (published = true);

create policy "public reads published blog posts" on blog_posts
  for select to anon using (status = 'published');
```

`agent_registrations` is safe to read publicly because an unconfirmed registration stores no
number. The claim is simply absent rather than hidden, which is the same posture the UI already
takes.

**Enquiries: write only.**

```sql
create policy "anyone may submit an enquiry" on inquiries
  for insert to anon with check (true);

create policy "only staff may read enquiries" on inquiries
  for select to authenticated using (is_staff());

create policy "only staff may update enquiries" on inquiries
  for update to authenticated using (is_staff());
```

> This is the most important policy in the project. Enquiries hold names, phone numbers and email
> addresses. **`anon` gets `insert` and nothing else.** There is no public select policy on this
> table, so there is no way to read it with the anon key, which is the key that ships to browsers.
>
> Under the portable architecture there is no browser-facing key at all, so the same protection is
> carried by the repository: `inquiries.create()` is public, `inquiries.list()` sits behind
> `requireStaff()`. The guarantee moves from the database to one reviewable directory. See
> `PORTABILITY.md` section 4.

**Staff write everything else.**

```sql
-- Repeat for each content table.
create policy "staff write listings" on listings
  for all to authenticated using (is_staff()) with check (is_staff());
```

---

## 4. Storage

Three public-read buckets, with paths keyed by uuid so a retitle never orphans a file.

| Bucket | Path | Public |
|---|---|---|
| `listings` | `listings/<listing_id>/<uuid>.webp` | read |
| `team` | `agents/<agent_id>/<uuid>.webp` | read |
| `partners` | `partners/<partner_id>/<uuid>.png` | read |
| `blog_posts` | `blog posts/<blog post_id>/<uuid>.webp` | read |

```sql
create policy "public may read listing images" on storage.objects
  for select to anon using (bucket_id = 'listings');

create policy "staff may write listing images" on storage.objects
  for all to authenticated using (bucket_id = 'listings' and is_staff());
```

**Tables store the path, never the full URL.** The public URL is composed at render time, so
moving buckets or putting a CDN in front later is a config change rather than a data migration.

**`next.config.ts` must allowlist the host** before `next/image` will touch any of it:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '<project>.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
},
```

Verify this against a real uploaded file on the day the bucket is created. A silently failing
image pipeline is the classic launch-morning discovery.

---

## 5. Auth

> **Amended by `PORTABILITY.md`.** This section describes the Supabase Auth path. The project has
> since chosen its own auth, in the repo, with users in our own Postgres, so that changing
> database host does not touch authentication. The shape below still holds — profiles table,
> roles, no public signup, a server-side gate in middleware — but `auth.users`, the trigger and
> the Supabase keys are replaced by the arrangement in `PORTABILITY.md` section 3.


**Supabase Auth, email and password, and public signup switched off.** This is the first setting
to change in the dashboard. Left on, anyone can create an account, and `is_staff()` returns true
for any row in `profiles`.

```sql
-- A profile follows every auth user, defaulting to the lower role.
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

Admins are created by invitation from the Supabase dashboard. There is no signup screen and there
should not be one.

### What gets deleted

| | |
|---|---|
| `src/lib/admin/auth.ts` | The `localStorage` flag. Replaced by the Supabase session |
| The bypass button on `/admin/login` | Honest while there was no server. Indefensible once there is |
| `AdminAuthGate`'s client-only check | Becomes a session check, with the real gate in middleware |

### The gate has to be server-side

`AdminAuthGate` runs in the browser, which means the admin HTML is still sent before anything
decides whether you should see it. Middleware refuses the request instead:

```ts
// middleware.ts
export const config = { matcher: ['/admin/:path*'] };
```

Redirect to `/admin/login` when there is no session, and let `/admin/login` through. Combined with
`robots.txt` disallowing `/admin`, that closes the hole flagged in `BUILD-PLAN.md`.

### Keys

| | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser. Safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser. Safe **because** RLS is correct. It is not a secret, it is a public identity with the permissions above |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Never prefixed `NEXT_PUBLIC_`. Bypasses RLS entirely |

The service role key is only needed where a server action must act outside the caller's
permissions. Most reads should use the anon key precisely so RLS is exercised in development
rather than discovered in production.

---

## 6. How the app connects

> **Amended by `PORTABILITY.md`.** The comparison below is still the right way to understand the
> five options, and the warning about ORMs bypassing RLS is still true. The project's choice has
> changed: it now reaches Postgres directly through Kysely and enforces access in the repository
> layer instead, for the reasons in `PORTABILITY.md` sections 1 and 4.


Supabase offers five connection options and they are not interchangeable. The choice decides
whether the policies in section 3 are enforced or merely present.

| Option | What it actually is | RLS |
|---|---|---|
| **Framework** | `@supabase/supabase-js` over HTTPS to the auto-generated REST API, with the project URL and a key | **Enforced** |
| **Server** | The same client used from server components, route handlers and server actions | Enforced, or bypassed with the service role key |
| **Direct** | A raw Postgres connection string, used by psql and the CLI | **Bypassed** |
| **ORM** | Prisma, Drizzle or Kysely, which also use the connection string | **Bypassed** |
| **MCP** | A server that lets an AI agent query and migrate the database | Development only |

### What this project uses

**`@supabase/ssr`, the Next.js flavour of the client library, for everything the app does.** It is
the only option that carries the visitor's session in cookies, which is what makes `auth.uid()`
resolve inside a policy. Without it, `is_staff()` has nothing to check and every policy in section
3 evaluates against an anonymous caller.

It is also the only path to Auth and to Storage, both of which this design depends on.

**The connection string, for migrations only.** Running the SQL in this document, through the
dashboard editor or the Supabase CLI. Nothing in the running application uses it.

> **Why not an ORM.** Prisma and Drizzle connect as the `postgres` role, which is a superuser and
> bypasses row level security entirely. Every policy here would still exist and none would run.
> The protection on `inquiries` in particular would stop being a database guarantee and become a
> promise that no future query forgets a `where` clause. For a table holding names, phone numbers
> and email addresses on a site where the key ships to browsers, that is the wrong trade.
>
> RLS can be made to work under an ORM by connecting as a restricted role and setting the JWT
> claims on every transaction. It is real, it is fiddly, and it is not a thing to take on in the
> eight days that are left.

**One trap if the connection string is ever used from the app.** Serverless functions open a
connection per invocation and will exhaust the direct limit quickly, so that path needs Supabase's
pooled connection string rather than the direct one. The client library sidesteps this entirely by
being HTTP, with no pool to manage.

**MCP** is worth turning on for development. It lets an agent read the schema and run migrations
against the project directly, which shortens the loop in section 7. It is not part of the
deployed application and should not be pointed at production.

---

## 7. Consistency audit

Every column was checked back against the type it comes from, and every relation against the data
that has to satisfy it. Four things did not line up.

### Fixed above

**`site_settings` was missing four fields the public site actually reads.** `AdminSiteSettings`
models a subset of what `src/data/site.ts` exports, and the pages read the wider object. Had
settings moved to the database as modelled, `site.address.coords`, `site.cities`, `site.regulator`
and `site.regionConfirmed` would all have come back undefined, taking the contact map, the offices
page wording, several leads and every "regulated by" line with them. Added, plus `url`, which
`metadataBase` needs before Open Graph images can work.

### Needs a change in the TypeScript, not the SQL

**`Inquiry` does not capture what the valuation form collects.** `ValuationRequestForm` asks what
is being valued and what the figure is for, which is the whole point of routing the matrix into
it, and then the type has nowhere to put either. `inquiries` has `valuation_asset`,
`valuation_purpose` and `source_path`; `src/lib/admin/types.ts` needs the same three fields or the
data is dropped between the form and the table.

### Handled at seed time

**`Listing.agentId` holds an agent slug, not a uuid.** The values in `src/data/listings.ts` are
`'kanshabe-lindah'` and `'waniala-andrew'`, which match `agents.id` in the current static data.
The seed inserts agents first, keeps a slug to uuid map, and resolves `agent_id` through it.

**Image paths change meaning.** `listing_images.path` will hold storage paths like
`listings/<uuid>/<uuid>.webp`, but today's data holds public paths like
`/images/listings/res-villa-pool.jpg`. Both are valid during the transition, so the helper that
builds a URL treats a leading `/` as local and anything else as a bucket key. That lets the stock
photography stay where it is while real photographs arrive through the CMS, rather than forcing a
big-bang upload before launch.

### Checked and correct

- `Listing` to `listing_images`: one to many, ordered, cascading on delete so a removed property
  takes its rows with it
- `agents` to `agent_registrations`: one to many, cascading
- `partner_groups` to `partners`: one to many, cascading, ordered within the group, which is what
  `reorderPartner` needs
- `blog posts.author_id` and `listings.agent_id`: both `on delete set null`, because losing a
  colleague should not delete their work
- `inquiries.listing_slug`: deliberately not a foreign key. An enquiry is a record of something
  that happened and has to outlive the listing it came from
- `site_settings`: single row, enforced by `check (id = 1)`

---

## 8. Order of work

1. Project, buckets, signup disabled, keys into `.env.local` and the host
2. Tables, in the order above (profiles, agents, listings, then the rest)
3. RLS on every table, then the policies. **Verify with the anon key that `inquiries` cannot be
   read** before writing any application code
4. Seed from `src/data/*.ts`, which becomes the seed script rather than being deleted. Agents
   first, keeping a slug to uuid map so `listings.agent_id` resolves
5. Rewrite the internals of `store.tsx`. No admin screen changes
6. Middleware, then remove `auth.ts` and the bypass
7. Public site reads, with revalidation on save
8. Forms insert into `inquiries`, after `Inquiry` gains the three fields named in the audit
9. The blog: admin screen, then the public `/blog` routes. Last, because the nav item stays
   hidden until CMT has a first note to publish

---

## 9. Still open

- **The blog has a table but no admin screen.** `blog_posts` is defined above; nothing in
  `src/app/(admin)/` manages it yet. That is a list, a form and a store slice, so roughly a day,
  and it is the one piece of new admin work the backend migration does not otherwise need.
- **The nav item stays hidden until a first note exists**, which is unchanged. The table being
  ready does not mean the section ships empty.
- **No subscribers table.** LAYOUT-SPECS A-07 ends the index with "get the next post by email".
  If that button is to work, it needs somewhere to write to and a consent record with it.
- Offices remain in code. Move them if CMT starts opening or closing branches.
- No audit trail. If CMT wants to know who changed a price, `updated_by uuid references profiles`
  on the content tables costs almost nothing now and is awkward to add later.
