-- Content tables. Mirrors docs/SCHEMA.md section 2.
--
-- No RLS here. Under the portable architecture (docs/PORTABILITY.md section 4) there is no
-- browser-facing key: the database is reachable only from the server, through src/lib/data,
-- and that repository is the access boundary. RLS stays available as defence in depth later,
-- reading current_setting('app.user_id') where SCHEMA.md reads auth.uid().

create table if not exists agents (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  role_title            text not null,
  rank                  text not null check (rank in ('director','valuer','agent')),
  based                 text,
  bio                   text,
  photo_path            text,
  phone                 text,
  email                 text,
  qualifications        text[] not null default '{}',
  credentials_confirmed boolean not null default false,
  sourced_from          text not null default 'cmt' check (sourced_from in ('cmt','directory')),
  sort_order            int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists agent_registrations (
  id             uuid primary key default gen_random_uuid(),
  agent_id       uuid not null references agents on delete cascade,
  authority      text not null,
  authority_full text not null,
  jurisdiction   text not null,
  post_nominals  text,
  number         text,
  confirmed      boolean not null default false,
  sort_order     int not null default 0
);

create table if not exists listings (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  reference    text not null unique,
  title        text not null,
  category     text not null check (category in
                 ('residential','commercial','industrial','land','agricultural')),
  listing_type text not null check (listing_type in ('sale','rent')),
  price        bigint not null,
  rent_period  text check (rent_period in ('month')),
  city         text not null,
  area         text not null,
  lat          numeric(9,6) not null,
  lng          numeric(9,6) not null,
  beds         int,
  baths        int,
  size         text not null,
  size_label   text not null check (size_label in
                 ('Built area','Plot size','Land area','Floor area')),
  tenure       text not null check (tenure in ('Freehold','Leasehold','Mailo','Customary')),
  summary      text not null,
  description  text[] not null default '{}',
  features     text[] not null default '{}',
  agent_id     uuid references agents on delete set null,
  featured     boolean not null default false,
  valued_on    text,
  status       text not null default 'draft' check (status in ('published','draft','archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists listings_status_idx on listings (status);
create index if not exists listings_category_idx on listings (category) where status = 'published';

create table if not exists listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings on delete cascade,
  path       text not null,
  alt        text not null default '',
  sort_order int not null default 0
);

create index if not exists listing_images_listing_idx on listing_images (listing_id, sort_order);

create table if not exists partner_groups (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text not null,
  sort_order  int not null default 0
);

create table if not exists partners (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references partner_groups on delete cascade,
  name       text not null,
  short_name text,
  logo_path  text,
  verified   boolean not null default false,
  sort_order int not null default 0
);

create index if not exists partners_group_idx on partners (group_id, sort_order);

create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  quote        text not null,
  name         text not null,
  organisation text not null,
  role_title   text,
  published    boolean not null default false,
  sort_order   int not null default 0
);

create table if not exists blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  finding          text not null,
  excerpt          text not null,
  body             text not null,
  pull_figure      text,
  pull_caption     text,
  key_figures      jsonb not null default '[]',
  author_id        uuid references agents on delete set null,
  cover_path       text,
  meta_description text,
  tags             text[] not null default '{}',
  status           text not null default 'draft' check (status in ('published','draft','archived')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on blog_posts (published_at desc) where status = 'published';

-- listing_slug is deliberately not a foreign key: an enquiry records something that happened
-- and has to outlive the listing it came from.
create table if not exists inquiries (
  id                uuid primary key default gen_random_uuid(),
  type              text not null check (type in
                      ('valuation','agent-contact','list-a-property','general')),
  status            text not null default 'New' check (status in
                      ('New','In Progress','Contacted','Closed')),
  name              text not null,
  phone             text,
  email             text,
  message           text not null,
  listing_slug      text,
  valuation_asset   text,
  valuation_purpose text,
  source_path       text,
  created_at        timestamptz not null default now()
);

create index if not exists inquiries_status_idx on inquiries (status, created_at desc);

create table if not exists site_settings (
  id                serial primary key check (id = 1),
  name              text not null,
  short_name        text not null,
  tagline           text not null,
  description       text not null,
  url               text not null,
  phone_display     text not null,
  phone_href        text not null,
  email             text not null,
  whatsapp          text,
  address           jsonb not null,
  address_lat       numeric(9,6) not null,
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

create or replace view agent_listings as
  select a.id as agent_id, l.slug, l.title, l.status
  from agents a join listings l on l.agent_id = a.id;
