import 'server-only';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { databaseUrl } from '@/lib/env';
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
 * STATUS: connection and types are live. Query bodies land on day two of docs/BUILD-PLAN.md,
 * once the migrations have been run. Each one throws until then rather than returning empty
 * arrays, because a method that silently answers "nothing here" is how an empty site gets
 * deployed without anyone noticing.
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

export interface Database {
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

const pending = (what: string) => {
  throw new UnsupportedOperation(`${what} (Postgres adapter, not implemented yet)`);
};

export function postgresRepository(): Repository {
  return {
    capabilities: { writes: true },

    listings: {
      async list() {
        return pending('Listing lookup');
      },
      async bySlug() {
        return pending('Listing lookup');
      },
      async upsert() {
        return pending('Saving a listing');
      },
      async remove() {
        return pending('Deleting a listing');
      },
    },

    agents: {
      async list() {
        return pending('Team lookup');
      },
      async byId() {
        return pending('Team lookup');
      },
      async upsert() {
        return pending('Saving a team member');
      },
      async remove() {
        return pending('Deleting a team member');
      },
    },

    partners: {
      async groups() {
        return pending('Partner lookup');
      },
    },

    testimonials: {
      async list() {
        return pending('Testimonial lookup');
      },
    },

    posts: {
      async list() {
        return pending('Blog lookup');
      },
      async bySlug() {
        return pending('Blog lookup');
      },
      async upsert() {
        return pending('Saving a blog post');
      },
      async remove() {
        return pending('Deleting a blog post');
      },
    },

    inquiries: {
      async create() {
        return pending('Recording an enquiry');
      },
      async list() {
        return pending('Enquiry lookup');
      },
      async setStatus() {
        return pending('Updating an enquiry');
      },
    },

    settings: {
      async get() {
        return pending('Settings lookup');
      },
    },
  };
}
