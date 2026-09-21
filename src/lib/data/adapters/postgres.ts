import 'server-only';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { databaseUrl } from '@/lib/env';
import type { Agent, BlogPost, Listing } from '@/lib/types';
import type { Inquiry } from '@/lib/admin/types';
import type { Repository } from '@/lib/data/repository';
import { UnsupportedOperation } from '@/lib/data/repository';

/**
 * Postgres, through Kysely.
 *
 * The tables here mirror docs/SCHEMA.md exactly, and that document stays the source of truth: the
 * schema is created by SQL migrations, not generated from this file. Types describe what is
 * already there rather than defining it, which is why the CHECK constraints, partial indexes and
 * the view in SCHEMA.md survive intact instead of being flattened into whatever a schema DSL can
 * express.
 *
 * Only reached when DATABASE_URL is set (see ../index.ts), so `pg` never loads on a machine
 * without a database and the static build stays as light as it is today.
 *
 * MAPPING. The database speaks snake_case, uuids and strings; the domain speaks camelCase,
 * slugs and numbers. The two vocabularies meet only in the map* functions below, so nothing
 * above src/lib/data ever sees a column name. Note particularly that Listing.agentId holds an
 * agent SLUG while the column holds a uuid, which is why every listing query joins agents: the
 * public type is the one the site was written against and it does not change to suit storage.
 *
 * pg returns bigint and numeric as strings to avoid silent precision loss, so price and
 * coordinates are converted explicitly rather than trusted.
 */

// Column shapes, written the way the database actually stores them: snake_case, dates as
// strings, arrays as arrays. Mapping into the domain types happens in the methods below, which
// is the one place the two vocabularies are allowed to meet.
interface ListingRow {
  id: string;
  slug: string;
  reference: string;
  title: string;
  category: string;
  listing_type: string;
  price: string;
  rent_period: string | null;
  city: string;
  area: string;
  lat: string;
  lng: string;
  beds: number | null;
  baths: number | null;
  size: string;
  size_label: string;
  tenure: string;
  summary: string;
  description: string[];
  features: string[];
  agent_id: string | null;
  featured: boolean;
  valued_on: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface ListingImageRow {
  id: string;
  listing_id: string;
  path: string;
  alt: string;
  sort_order: number;
}

interface AgentRow {
  id: string;
  slug: string;
  name: string;
  role_title: string;
  rank: string;
  based: string | null;
  bio: string | null;
  photo_path: string | null;
  phone: string | null;
  email: string | null;
  qualifications: string[];
  credentials_confirmed: boolean;
  sourced_from: string;
  sort_order: number;
}

interface AgentRegistrationRow {
  id: string;
  agent_id: string;
  authority: string;
  authority_full: string;
  jurisdiction: string;
  post_nominals: string | null;
  number: string | null;
  confirmed: boolean;
  sort_order: number;
}

interface PartnerGroupRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
}

interface PartnerRow {
  id: string;
  group_id: string;
  name: string;
  short_name: string | null;
  logo_path: string | null;
  verified: boolean;
  sort_order: number;
}

interface TestimonialRow {
  id: string;
  quote: string;
  name: string;
  organisation: string;
  role_title: string | null;
  published: boolean;
  sort_order: number;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  finding: string;
  excerpt: string;
  body: string;
  pull_figure: string | null;
  pull_caption: string | null;
  key_figures: { label: string; value: string }[];
  author_id: string | null;
  cover_path: string | null;
  meta_description: string | null;
  tags: string[];
  status: string;
  published_at: Date | null;
}

interface InquiryRow {
  id: string;
  type: string;
  status: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  listing_slug: string | null;
  valuation_asset: string | null;
  valuation_purpose: string | null;
  source_path: string | null;
  created_at: Date;
}

interface SiteSettingsRow {
  id: number;
  name: string;
  short_name: string;
  tagline: string;
  description: string;
  url: string;
  phone_display: string;
  phone_href: string;
  email: string;
  whatsapp: string | null;
  address: unknown;
  address_lat: string;
  address_lng: string;
  nairobi_address: string | null;
  cities: string[];
  regulator: string;
  region_confirmed: boolean;
  hours: unknown;
  hours_confirmed: boolean;
  years_in_business: string;
  stats: unknown;
}

// Auth lives in the same database, so it shares one pool and one Kysely instance. The queries
// themselves live in src/lib/auth, which is the only thing outside src/lib/data allowed to reach
// for getDb(), because a user table is not content and does not belong behind the repository.
interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  password_hash: string;
  role: string;
  activated_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
}

interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  user_agent: string | null;
  ip: string | null;
}

export interface Database {
  users: UserRow;
  sessions: SessionRow;
  site_settings: SiteSettingsRow;
  listings: ListingRow;
  listing_images: ListingImageRow;
  agents: AgentRow;
  agent_registrations: AgentRegistrationRow;
  partner_groups: PartnerGroupRow;
  partners: PartnerRow;
  testimonials: TestimonialRow;
  blog_posts: BlogPostRow;
  inquiries: InquiryRow;
}

let pool: Pool | null = null;
let db: Kysely<Database> | null = null;

/**
 * One pool for the process. Serverless reuses a warm instance between invocations, so building a
 * pool per request is how a connection limit gets exhausted on the first busy afternoon.
 */
export function getDb(): Kysely<Database> {
  if (db) return db;
  pool = new Pool({ connectionString: databaseUrl(), max: 5 });
  db = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) });
  return db;
}

/* ── row to domain ──────────────────────────────────────────────────────────────────────── */

type ListingWithAgent = ListingRow & { agent_slug: string | null };

function mapListing(row: ListingWithAgent, images: ListingImageRow[]): Listing {
  return {
    slug: row.slug,
    reference: row.reference,
    title: row.title,
    category: row.category as Listing['category'],
    listingType: row.listing_type as Listing['listingType'],
    price: Number(row.price),
    ...(row.rent_period ? { rentPeriod: 'month' as const } : {}),
    city: row.city,
    area: row.area,
    coords: [Number(row.lat), Number(row.lng)],
    ...(row.beds !== null ? { beds: row.beds } : {}),
    ...(row.baths !== null ? { baths: row.baths } : {}),
    size: row.size,
    sizeLabel: row.size_label as Listing['sizeLabel'],
    tenure: row.tenure as Listing['tenure'],
    images: images.map((image) => ({ src: image.path, alt: image.alt })),
    summary: row.summary,
    description: row.description,
    features: row.features,
    agentId: row.agent_slug ?? '',
    featured: row.featured,
    ...(row.valued_on ? { valuedOn: row.valued_on } : {}),
  };
}

function mapAgent(row: AgentRow, registrations: AgentRegistrationRow[]): Agent {
  return {
    id: row.slug,
    name: row.name,
    role: row.role_title,
    rank: row.rank as Agent['rank'],
    ...(row.based ? { based: row.based } : {}),
    ...(row.bio ? { bio: row.bio } : {}),
    ...(row.photo_path ? { photo: row.photo_path } : {}),
    ...(row.phone ? { phone: row.phone } : {}),
    ...(row.email ? { email: row.email } : {}),
    qualifications: row.qualifications,
    registrations: registrations.map((reg) => ({
      authority: reg.authority,
      authorityFull: reg.authority_full,
      jurisdiction: reg.jurisdiction,
      ...(reg.post_nominals ? { postNominals: reg.post_nominals } : {}),
      ...(reg.number ? { number: reg.number } : {}),
      confirmed: reg.confirmed,
    })),
    credentialsConfirmed: row.credentials_confirmed,
    sourcedFrom: row.sourced_from as Agent['sourcedFrom'],
  };
}

function mapPost(row: BlogPostRow & { author_slug: string | null }): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    finding: row.finding,
    excerpt: row.excerpt,
    body: row.body,
    ...(row.pull_figure ? { pullFigure: row.pull_figure } : {}),
    ...(row.pull_caption ? { pullCaption: row.pull_caption } : {}),
    keyFigures: row.key_figures ?? [],
    ...(row.author_slug ? { authorId: row.author_slug } : {}),
    ...(row.cover_path ? { coverImage: row.cover_path } : {}),
    tags: row.tags,
    publishedAt: (row.published_at ?? new Date()).toISOString().slice(0, 10),
  };
}

async function loadListings(options: {
  slug?: string;
  category?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
}): Promise<Listing[]> {
  const kysely = getDb();

  let query = kysely
    .selectFrom('listings')
    .leftJoin('agents', 'agents.id', 'listings.agent_id')
    .selectAll('listings')
    .select('agents.slug as agent_slug');

  if (options.slug) query = query.where('listings.slug', '=', options.slug);
  if (options.category) query = query.where('listings.category', '=', options.category);
  if (options.featured) query = query.where('listings.featured', '=', true);
  if (!options.includeUnpublished) query = query.where('listings.status', '=', 'published');

  const rows = (await query
    .orderBy('listings.featured', 'desc')
    .orderBy('listings.created_at', 'desc')
    .execute()) as ListingWithAgent[];

  if (rows.length === 0) return [];

  // One query for every image rather than one per listing. Sixteen listings is not a lot, but
  // a per-row query is the kind of thing that is invisible until the stock is real.
  const images = await kysely
    .selectFrom('listing_images')
    .selectAll()
    .where(
      'listing_id',
      'in',
      rows.map((row) => row.id),
    )
    .orderBy('sort_order')
    .execute();

  const byListing = new Map<string, ListingImageRow[]>();
  for (const image of images) {
    const bucket = byListing.get(image.listing_id) ?? [];
    bucket.push(image);
    byListing.set(image.listing_id, bucket);
  }

  return rows.map((row) => mapListing(row, byListing.get(row.id) ?? []));
}

/* ── the adapter ────────────────────────────────────────────────────────────────────────── */

export function postgresRepository(): Repository {
  const kysely = getDb();

  return {
    capabilities: { writes: true },

    listings: {
      async list(filter) {
        return loadListings({
          category: filter?.category,
          featured: filter?.featured,
          includeUnpublished: filter?.includeUnpublished,
        });
      },
      async bySlug(slug) {
        // Admin edits a draft by slug, so unpublished has to be reachable here.
        const found = await loadListings({ slug, includeUnpublished: true });
        return found[0] ?? null;
      },
      async upsert() {
        throw new UnsupportedOperation('Saving a listing');
      },
      async remove(slug) {
        await kysely.deleteFrom('listings').where('slug', '=', slug).execute();
      },
    },

    agents: {
      async list() {
        const rows = await kysely.selectFrom('agents').selectAll().orderBy('sort_order').execute();
        const registrations = await kysely
          .selectFrom('agent_registrations')
          .selectAll()
          .orderBy('sort_order')
          .execute();
        return rows.map((row) =>
          mapAgent(
            row,
            registrations.filter((reg) => reg.agent_id === row.id),
          ),
        );
      },
      async byId(id) {
        const row = await kysely
          .selectFrom('agents')
          .selectAll()
          .where('slug', '=', id)
          .executeTakeFirst();
        if (!row) return null;
        const registrations = await kysely
          .selectFrom('agent_registrations')
          .selectAll()
          .where('agent_id', '=', row.id)
          .orderBy('sort_order')
          .execute();
        return mapAgent(row, registrations);
      },
      async upsert() {
        throw new UnsupportedOperation('Saving a team member');
      },
      async remove(id) {
        await kysely.deleteFrom('agents').where('slug', '=', id).execute();
      },
    },

    partners: {
      async groups() {
        const groups = await kysely
          .selectFrom('partner_groups')
          .selectAll()
          .orderBy('sort_order')
          .execute();
        const members = await kysely
          .selectFrom('partners')
          .selectAll()
          .orderBy('sort_order')
          .execute();
        return groups.map((group) => ({
          id: group.slug,
          title: group.title,
          description: group.description,
          partners: members
            .filter((partner) => partner.group_id === group.id)
            .map((partner) => ({
              name: partner.name,
              ...(partner.short_name ? { shortName: partner.short_name } : {}),
              ...(partner.logo_path ? { logo: partner.logo_path } : {}),
            })),
        }));
      },
    },

    testimonials: {
      async list() {
        const rows = await kysely
          .selectFrom('testimonials')
          .selectAll()
          .where('published', '=', true)
          .orderBy('sort_order')
          .execute();
        return rows.map((row) => ({
          quote: row.quote,
          name: row.name,
          organisation: row.organisation,
          ...(row.role_title ? { role: row.role_title } : {}),
        }));
      },
    },

    posts: {
      async list(options) {
        let query = kysely
          .selectFrom('blog_posts')
          .leftJoin('agents', 'agents.id', 'blog_posts.author_id')
          .selectAll('blog_posts')
          .select('agents.slug as author_slug');
        if (!options?.includeUnpublished) query = query.where('blog_posts.status', '=', 'published');
        const rows = await query.orderBy('blog_posts.published_at', 'desc').execute();
        return rows.map((row) => mapPost(row as BlogPostRow & { author_slug: string | null }));
      },
      async bySlug(slug) {
        const row = await kysely
          .selectFrom('blog_posts')
          .leftJoin('agents', 'agents.id', 'blog_posts.author_id')
          .selectAll('blog_posts')
          .select('agents.slug as author_slug')
          .where('blog_posts.slug', '=', slug)
          .executeTakeFirst();
        return row ? mapPost(row as BlogPostRow & { author_slug: string | null }) : null;
      },
      async upsert() {
        throw new UnsupportedOperation('Saving a blog post');
      },
      async remove(slug) {
        await kysely.deleteFrom('blog_posts').where('slug', '=', slug).execute();
      },
    },

    inquiries: {
      async create(inquiry) {
        await kysely
          .insertInto('inquiries')
          .values({
            type: inquiry.type,
            status: 'New',
            name: inquiry.name,
            phone: inquiry.phone ?? null,
            email: inquiry.email ?? null,
            message: inquiry.message,
            listing_slug: inquiry.listingSlug ?? null,
            valuation_asset: inquiry.valuationAsset ?? null,
            valuation_purpose: inquiry.valuationPurpose ?? null,
            source_path: inquiry.sourcePath ?? null,
          } as never)
          .execute();
      },
      async list() {
        const rows = await kysely
          .selectFrom('inquiries')
          .selectAll()
          .orderBy('created_at', 'desc')
          .execute();
        return rows.map((row) => ({
          id: row.id,
          type: row.type as Inquiry['type'],
          status: row.status as Inquiry['status'],
          name: row.name,
          ...(row.phone ? { phone: row.phone } : {}),
          ...(row.email ? { email: row.email } : {}),
          message: row.message,
          ...(row.listing_slug ? { listingSlug: row.listing_slug } : {}),
          ...(row.valuation_asset ? { valuationAsset: row.valuation_asset } : {}),
          ...(row.valuation_purpose ? { valuationPurpose: row.valuation_purpose } : {}),
          ...(row.source_path ? { sourcePath: row.source_path } : {}),
          createdAt: row.created_at.toISOString(),
        }));
      },
      async setStatus(id, status) {
        await kysely
          .updateTable('inquiries')
          .set({ status } as never)
          .where('id', '=', id)
          .execute();
      },
    },

    settings: {
      async get() {
        const row = await kysely.selectFrom('site_settings').selectAll().executeTakeFirst();
        if (!row) throw new UnsupportedOperation('Settings lookup (no settings row; run the seed)');
        const address = row.address as Record<string, string>;
        return {
          name: row.name,
          shortName: row.short_name,
          tagline: row.tagline,
          description: row.description,
          phone: { display: row.phone_display, href: row.phone_href },
          email: row.email,
          whatsapp: row.whatsapp,
          address: {
            building: address.building,
            line1: address.line1,
            street: address.street,
            city: address.city,
            country: address.country,
          },
          nairobiAddress: row.nairobi_address ?? '',
          hours: row.hours as { days: string; time: string }[],
          hoursConfirmed: row.hours_confirmed,
          yearsInBusiness: row.years_in_business,
          stats: row.stats as { value: string; unit: string; label: string }[],
        };
      },
    },
  };
}

