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
  phone_display     text not null,
  phone_href        text not null,
  email             text not null,
  whatsapp          text,                      -- null until CMT supplies it
  address           jsonb not null,
  nairobi_address   text,
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

## 6. Order of work

1. Project, buckets, signup disabled, keys into `.env.local` and the host
2. Tables, in the order above (profiles, agents, listings, then the rest)
3. RLS on every table, then the policies. **Verify with the anon key that `inquiries` cannot be
   read** before writing any application code
4. Seed from `src/data/*.ts`, which becomes the seed script rather than being deleted
5. Rewrite the internals of `store.tsx`. No admin screen changes
6. Middleware, then remove `auth.ts` and the bypass
7. Public site reads, with revalidation on save
8. Forms insert into `inquiries`

---

## 7. Still open

- **Insights and blog have no table here.** The admin has no screen for them either, and the nav
  item is deliberately held back until a first note exists. If CMT wants it at launch, add
  `insights` alongside `listings` with the same status field, and budget a day.
- Offices remain in code. Move them if CMT starts opening or closing branches.
- No audit trail. If CMT wants to know who changed a price, `updated_by uuid references profiles`
  on the content tables costs almost nothing now and is awkward to add later.
