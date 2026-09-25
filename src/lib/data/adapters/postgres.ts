import 'server-only';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { databaseUrl } from '@/lib/env';
import { publicUrl, toStoredPath } from '@/lib/storage';
import type { Agent, Listing } from '@/lib/types';
import type {
  AdminBlogPost,
  AdminListing,
  AdminSiteSettings,
  Inquiry,
} from '@/lib/admin/types';
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

/*
 * A draft created in the browser carries an id like "testimonial-lq3k4j" because the client has
 * no way to mint a uuid the database will accept. Comparing that to a uuid column does not
 * return false, it raises "invalid input syntax for type uuid" and fails the save. So anything
 * that is not a uuid is treated as new, which is exactly what it is.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (value: string) => UUID.test(value);

/* ── row to domain ──────────────────────────────────────────────────────────────────────── */

type ListingWithAgent = ListingRow & { agent_slug: string | null };

function mapListing(row: ListingWithAgent, images: ListingImageRow[]): AdminListing {
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
    images: images.map((image) => ({ src: publicUrl(image.path), alt: image.alt })),
    summary: row.summary,
    description: row.description,
    features: row.features,
    agentId: row.agent_slug ?? '',
    featured: row.featured,
    ...(row.valued_on ? { valuedOn: row.valued_on } : {}),
    status: row.status as AdminListing['status'],
    updatedAt: row.updated_at.toISOString(),
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
    ...(row.photo_path ? { photo: publicUrl(row.photo_path) } : {}),
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

function mapPost(row: BlogPostRow & { author_slug: string | null }): AdminBlogPost {
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
    ...(row.cover_path ? { coverImage: publicUrl(row.cover_path) } : {}),
    tags: row.tags,
    publishedAt: (row.published_at ?? new Date()).toISOString().slice(0, 10),
    status: row.status as AdminBlogPost['status'],
    updatedAt: new Date().toISOString(),
  };
}

async function loadListings(options: {
  slug?: string;
  category?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
}): Promise<AdminListing[]> {
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
      /*
       * One transaction, because a listing and its images are one thing to an editor. Without it
       * a failure halfway leaves a property with the wrong photographs, which is worse than a
       * failure that changes nothing.
       */
      async upsert(listing) {
        await kysely.transaction().execute(async (tx) => {
          const agent = listing.agentId
            ? await tx
                .selectFrom('agents')
                .select('id')
                .where('slug', '=', listing.agentId)
                .executeTakeFirst()
            : undefined;

          const values = {
            slug: listing.slug,
            reference: listing.reference,
            title: listing.title,
            category: listing.category,
            listing_type: listing.listingType,
            price: String(listing.price),
            rent_period: listing.rentPeriod ?? null,
            city: listing.city,
            area: listing.area,
            lat: String(listing.coords[0]),
            lng: String(listing.coords[1]),
            beds: listing.beds ?? null,
            baths: listing.baths ?? null,
            size: listing.size,
            size_label: listing.sizeLabel,
            tenure: listing.tenure,
            summary: listing.summary,
            description: listing.description,
            features: listing.features,
            agent_id: agent?.id ?? null,
            featured: listing.featured ?? false,
            valued_on: listing.valuedOn ?? null,
            status: listing.status,
            updated_at: new Date(),
          };

          const saved = await tx
            .insertInto('listings')
            .values(values as never)
            .onConflict((conflict) => conflict.column('slug').doUpdateSet(values as never))
            .returning('id')
            .executeTakeFirstOrThrow();

          // Replaced wholesale rather than diffed: the editor reorders and removes in the
          // gallery, and matching that by hand is more code and more ways to be wrong.
          await tx.deleteFrom('listing_images').where('listing_id', '=', saved.id).execute();
          if (listing.images.length) {
            await tx
              .insertInto('listing_images')
              .values(
                listing.images.map((image, index) => ({
                  listing_id: saved.id,
                  path: toStoredPath(image.src),
                  alt: image.alt,
                  sort_order: index,
                })) as never,
              )
              .execute();
          }
        });
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
      async upsert(agent) {
        await kysely.transaction().execute(async (tx) => {
          const values = {
            slug: agent.id,
            name: agent.name,
            role_title: agent.role,
            rank: agent.rank,
            based: agent.based ?? null,
            bio: agent.bio ?? null,
            photo_path: agent.photo ? toStoredPath(agent.photo) : null,
            phone: agent.phone ?? null,
            email: agent.email ?? null,
            qualifications: agent.qualifications ?? [],
            credentials_confirmed: agent.credentialsConfirmed,
            sourced_from: agent.sourcedFrom,
            updated_at: new Date(),
          };

          const saved = await tx
            .insertInto('agents')
            .values(values as never)
            .onConflict((conflict) => conflict.column('slug').doUpdateSet(values as never))
            .returning('id')
            .executeTakeFirstOrThrow();

          await tx.deleteFrom('agent_registrations').where('agent_id', '=', saved.id).execute();
          const registrations = agent.registrations ?? [];
          if (registrations.length) {
            await tx
              .insertInto('agent_registrations')
              .values(
                registrations.map((reg, index) => ({
                  agent_id: saved.id,
                  authority: reg.authority,
                  authority_full: reg.authorityFull,
                  jurisdiction: reg.jurisdiction,
                  post_nominals: reg.postNominals ?? null,
                  // The gate that runs everywhere else runs here too: an unconfirmed
                  // registration stores no number, so there is nothing to leak later.
                  number: reg.confirmed ? (reg.number ?? null) : null,
                  confirmed: reg.confirmed,
                  sort_order: index,
                })) as never,
              )
              .execute();
          }
        });
      },
      async remove(id) {
        await kysely.deleteFrom('agents').where('slug', '=', id).execute();
      },
    },

    partners: {
      async listForAdmin() {
        const groups = await kysely.selectFrom('partner_groups').selectAll().execute();
        const slugOf = new Map(groups.map((group) => [group.id, group.slug]));
        const rows = await kysely
          .selectFrom('partners')
          .selectAll()
          .orderBy('sort_order')
          .execute();
        return rows.map((row) => ({
          id: row.id,
          groupId: slugOf.get(row.group_id) ?? '',
          name: row.name,
          ...(row.short_name ? { shortName: row.short_name } : {}),
          ...(row.logo_path ? { logo: publicUrl(row.logo_path) } : {}),
          order: row.sort_order,
          verified: row.verified,
        }));
      },
      async upsert(partner) {
        const group = await kysely
          .selectFrom('partner_groups')
          .select('id')
          .where('slug', '=', partner.groupId)
          .executeTakeFirst();
        if (!group) throw new UnsupportedOperation(`Unknown partner group "${partner.groupId}"`);

        const values = {
          group_id: group.id,
          name: partner.name,
          short_name: partner.shortName ?? null,
          logo_path: partner.logo ? toStoredPath(partner.logo) : null,
          verified: partner.verified,
          sort_order: partner.order,
        };

        const existing = isUuid(partner.id)
          ? await kysely
              .selectFrom('partners')
              .select('id')
              .where('id', '=', partner.id)
              .executeTakeFirst()
          : undefined;

        if (existing) {
          await kysely
            .updateTable('partners')
            .set(values as never)
            .where('id', '=', partner.id)
            .execute();
        } else {
          await kysely.insertInto('partners').values(values as never).execute();
        }
      },
      async remove(id) {
        if (!isUuid(id)) return; // a draft that was never saved
        await kysely.deleteFrom('partners').where('id', '=', id).execute();
      },
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
              ...(partner.logo_path ? { logo: publicUrl(partner.logo_path) } : {}),
            })),
        }));
      },
    },

    testimonials: {
      async listForAdmin() {
        const rows = await kysely
          .selectFrom('testimonials')
          .selectAll()
          .orderBy('sort_order')
          .execute();
        return rows.map((row) => ({
          id: row.id,
          quote: row.quote,
          name: row.name,
          organisation: row.organisation,
          ...(row.role_title ? { role: row.role_title } : {}),
        }));
      },
      async upsert(testimonial) {
        const values = {
          quote: testimonial.quote,
          name: testimonial.name,
          organisation: testimonial.organisation,
          role_title: testimonial.role ?? null,
          published: true,
        };
        const existing = isUuid(testimonial.id)
          ? await kysely
              .selectFrom('testimonials')
              .select('id')
              .where('id', '=', testimonial.id)
              .executeTakeFirst()
          : undefined;
        if (existing) {
          await kysely
            .updateTable('testimonials')
            .set(values as never)
            .where('id', '=', testimonial.id)
            .execute();
        } else {
          await kysely.insertInto('testimonials').values(values as never).execute();
        }
      },
      async remove(id) {
        if (!isUuid(id)) return; // a draft that was never saved
        await kysely.deleteFrom('testimonials').where('id', '=', id).execute();
      },
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
      async upsert(post) {
        const author = post.authorId
          ? await kysely
              .selectFrom('agents')
              .select('id')
              .where('slug', '=', post.authorId)
              .executeTakeFirst()
          : undefined;

        const values = {
          slug: post.slug,
          title: post.title,
          finding: post.finding,
          excerpt: post.excerpt,
          body: post.body,
          pull_figure: post.pullFigure ?? null,
          pull_caption: post.pullCaption ?? null,
          key_figures: JSON.stringify(post.keyFigures ?? []),
          author_id: author?.id ?? null,
          cover_path: post.coverImage ? toStoredPath(post.coverImage) : null,
          tags: post.tags ?? [],
          status: post.status,
          published_at: post.publishedAt ? new Date(post.publishedAt) : null,
          updated_at: new Date(),
        };

        await kysely
          .insertInto('blog_posts')
          .values(values as never)
          .onConflict((conflict) => conflict.column('slug').doUpdateSet(values as never))
          .execute();
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
        if (!isUuid(id)) return;
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
      async update(settings: AdminSiteSettings) {
        await kysely
          .updateTable('site_settings')
          .set({
            name: settings.name,
            short_name: settings.shortName,
            tagline: settings.tagline,
            description: settings.description,
            phone_display: settings.phone.display,
            phone_href: settings.phone.href,
            email: settings.email,
            whatsapp: settings.whatsapp,
            address: JSON.stringify(settings.address),
            nairobi_address: settings.nairobiAddress || null,
            hours: JSON.stringify(settings.hours),
            hours_confirmed: settings.hoursConfirmed,
            years_in_business: settings.yearsInBusiness,
            stats: JSON.stringify(settings.stats),
            updated_at: new Date(),
          } as never)
          .where('id', '=', 1)
          .execute();
      },
    },
  };
}

