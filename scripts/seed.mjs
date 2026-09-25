/**
 * Seed the database from src/data/*.ts.
 *
 * The static content is not thrown away when Postgres arrives, it becomes the seed. That is what
 * keeps one source of truth during the migration: the same sixteen listings the site renders
 * today are the ones in the database tonight, so a difference between the two is a bug rather
 * than a question.
 *
 *   node scripts/seed.mjs            insert or update, leaving anything else alone
 *   node scripts/seed.mjs --reset    empty the content tables first
 *
 * Idempotent by slug, so running it twice is not a way to get thirty-two listings. Enquiries are
 * never touched: they are real records of something that happened, not seed data.
 *
 * The .ts imports work without a build step because Node strips types natively, and every import
 * in src/data is `import type`, so nothing survives stripping that Node would have to resolve.
 */
import fs from 'node:fs';
import pg from 'pg';

import { agents } from '../src/data/agents.ts';
import { listings } from '../src/data/listings.ts';
import { partnerGroups } from '../src/data/partners.ts';
import { testimonials } from '../src/data/testimonials.ts';
import { posts } from '../src/data/blog.ts';
import { site, offices } from '../src/data/site.ts';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (!match) continue;
      if (process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^"|"$/g, '');
      }
    }
  }
}

async function open() {
  loadEnv();
  for (const url of [process.env.DATABASE_URL, process.env.DATABASE_POOL_URL]) {
    if (!url) continue;
    const client = new pg.Client({
      connectionString: url,
      connectionTimeoutMillis: 15000,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      return client;
    } catch {
      try {
        await client.end();
      } catch {}
    }
  }
  throw new Error('Could not reach the database. Is DATABASE_URL set?');
}

const RESET = process.argv.includes('--reset');

async function main() {
  const db = await open();
  const count = {};
  let keptImages = 0;
  let keptLogos = 0;

  if (RESET) {
    // Order matters: children before parents. Enquiries are never in this list.
    await db.query(`truncate listing_images, listings, agent_registrations, agents,
                             partners, partner_groups, testimonials, blog_posts,
                             site_settings restart identity cascade`);
    console.log('reset: content tables emptied (enquiries left alone)');
  }

  // ── agents, first, because listings resolve their author through this map ──────────────
  const agentIds = new Map();
  for (const [index, agent] of agents.entries()) {
    const { rows } = await db.query(
      `insert into agents (slug, name, role_title, rank, based, bio, phone, email,
                           qualifications, credentials_confirmed, sourced_from, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       on conflict (slug) do update set
         name = excluded.name, role_title = excluded.role_title, rank = excluded.rank,
         based = excluded.based, bio = excluded.bio, phone = excluded.phone,
         email = excluded.email, qualifications = excluded.qualifications,
         credentials_confirmed = excluded.credentials_confirmed,
         sourced_from = excluded.sourced_from, sort_order = excluded.sort_order,
         updated_at = now()
       returning id`,
      [
        agent.id, agent.name, agent.role, agent.rank, agent.based ?? null, agent.bio ?? null,
        agent.phone ?? null, agent.email ?? null, agent.qualifications ?? [],
        agent.credentialsConfirmed, agent.sourcedFrom, index,
      ],
    );
    agentIds.set(agent.id, rows[0].id);

    await db.query('delete from agent_registrations where agent_id = $1', [rows[0].id]);
    for (const [i, reg] of (agent.registrations ?? []).entries()) {
      await db.query(
        `insert into agent_registrations
           (agent_id, authority, authority_full, jurisdiction, post_nominals, number,
            confirmed, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          rows[0].id, reg.authority, reg.authorityFull, reg.jurisdiction,
          reg.postNominals ?? null,
          // Never store an unconfirmed registration number. It is not ours to publish.
          reg.confirmed ? (reg.number ?? null) : null,
          reg.confirmed, i,
        ],
      );
    }
  }
  count.agents = agents.length;

  // ── listings ───────────────────────────────────────────────────────────────────────────
  for (const listing of listings) {
    const { rows } = await db.query(
      `insert into listings (slug, reference, title, category, listing_type, price, rent_period,
                             city, area, lat, lng, beds, baths, size, size_label, tenure,
                             summary, description, features, agent_id, featured, valued_on,
                             status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
               'published')
       on conflict (slug) do update set
         reference = excluded.reference, title = excluded.title, category = excluded.category,
         listing_type = excluded.listing_type, price = excluded.price,
         rent_period = excluded.rent_period, city = excluded.city, area = excluded.area,
         lat = excluded.lat, lng = excluded.lng, beds = excluded.beds, baths = excluded.baths,
         size = excluded.size, size_label = excluded.size_label, tenure = excluded.tenure,
         summary = excluded.summary, description = excluded.description,
         features = excluded.features, agent_id = excluded.agent_id,
         featured = excluded.featured, valued_on = excluded.valued_on, updated_at = now()
       returning id`,
      [
        listing.slug, listing.reference, listing.title, listing.category, listing.listingType,
        listing.price, listing.rentPeriod ?? null, listing.city, listing.area,
        listing.coords[0], listing.coords[1], listing.beds ?? null, listing.baths ?? null,
        listing.size, listing.sizeLabel, listing.tenure, listing.summary, listing.description,
        listing.features, agentIds.get(listing.agentId) ?? null, listing.featured ?? false,
        listing.valuedOn ?? null,
      ],
    );

    /*
     * Images are only reseeded while they still point at public/.
     *
     * Once scripts/upload-images.mjs has moved them into the bucket the rows hold bucket keys,
     * and blindly replacing them from src/data would quietly undo that upload and leave the site
     * pointing at files it no longer serves. So: if any image for this listing is already a
     * bucket key, leave the whole set alone.
     */
    const { rows: existing } = await db.query(
      'select path from listing_images where listing_id = $1',
      [rows[0].id],
    );
    const alreadyInBucket = existing.some((row) => !row.path.startsWith('/'));

    if (!alreadyInBucket) {
      await db.query('delete from listing_images where listing_id = $1', [rows[0].id]);
      for (const [i, image] of listing.images.entries()) {
        await db.query(
          'insert into listing_images (listing_id, path, alt, sort_order) values ($1,$2,$3,$4)',
          [rows[0].id, image.src, image.alt, i],
        );
      }
    } else {
      keptImages += listing.images.length;
    }
  }
  count.listings = listings.length;
  count.images = listings.reduce((total, l) => total + l.images.length, 0);

  // ── partners ───────────────────────────────────────────────────────────────────────────
  let partnerTotal = 0;
  for (const [gi, group] of partnerGroups.entries()) {
    const { rows } = await db.query(
      `insert into partner_groups (slug, title, description, sort_order)
       values ($1,$2,$3,$4)
       on conflict (slug) do update set
         title = excluded.title, description = excluded.description,
         sort_order = excluded.sort_order
       returning id`,
      [group.id, group.title, group.description, gi],
    );
    // Read the existing logos before the wipe, so a bucket key survives the reinsert below.
    const { rows: priorLogos } = await db.query(
      'select name, logo_path from partners where group_id = $1',
      [rows[0].id],
    );
    const priorByName = new Map(priorLogos.map((row) => [row.name, row.logo_path]));
    await db.query('delete from partners where group_id = $1', [rows[0].id]);
    for (const [pi, partner] of group.partners.entries()) {
      // Same rule as images: never replace a bucket key with a public/ path.
      const priorPath = priorByName.get(partner.name);
      const keptLogo = priorPath && !priorPath.startsWith('/') ? priorPath : null;

      await db.query(
        `insert into partners (group_id, name, short_name, logo_path, verified, sort_order)
         values ($1,$2,$3,$4,true,$5)`,
        [rows[0].id, partner.name, partner.shortName ?? null, keptLogo ?? partner.logo ?? null, pi],
      );
      if (keptLogo) keptLogos += 1;
      partnerTotal += 1;
    }
  }
  count.partnerGroups = partnerGroups.length;
  count.partners = partnerTotal;

  // ── testimonials and blog: both deliberately empty, and the loops prove it ─────────────
  for (const [i, t] of testimonials.entries()) {
    await db.query(
      `insert into testimonials (quote, name, organisation, role_title, published, sort_order)
       values ($1,$2,$3,$4,true,$5)`,
      [t.quote, t.name, t.organisation, t.role ?? null, i],
    );
  }
  count.testimonials = testimonials.length;

  for (const post of posts) {
    await db.query(
      `insert into blog_posts (slug, title, finding, excerpt, body, pull_figure, pull_caption,
                               key_figures, author_id, tags, status, published_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published',$11)
       on conflict (slug) do nothing`,
      [
        post.slug, post.title, post.finding, post.excerpt, post.body,
        post.pullFigure ?? null, post.pullCaption ?? null,
        JSON.stringify(post.keyFigures ?? []),
        agentIds.get(post.authorId) ?? null, post.tags ?? [], post.publishedAt,
      ],
    );
  }
  count.posts = posts.length;

  // ── settings: one row, every field the public site reads ──────────────────────────────
  await db.query(
    `insert into site_settings (id, name, short_name, tagline, description, url,
                                phone_display, phone_href, email, whatsapp, address,
                                address_lat, address_lng, nairobi_address, cities, regulator,
                                region_confirmed, hours, hours_confirmed, years_in_business,
                                stats)
     values (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
     on conflict (id) do update set
       name = excluded.name, short_name = excluded.short_name, tagline = excluded.tagline,
       description = excluded.description, url = excluded.url,
       phone_display = excluded.phone_display, phone_href = excluded.phone_href,
       email = excluded.email, whatsapp = excluded.whatsapp, address = excluded.address,
       address_lat = excluded.address_lat, address_lng = excluded.address_lng,
       nairobi_address = excluded.nairobi_address, cities = excluded.cities,
       regulator = excluded.regulator, region_confirmed = excluded.region_confirmed,
       hours = excluded.hours, hours_confirmed = excluded.hours_confirmed,
       years_in_business = excluded.years_in_business, stats = excluded.stats,
       updated_at = now()`,
    [
      site.name, site.shortName, site.tagline, site.description, site.url,
      site.phone.display, site.phone.href, site.email, site.whatsapp,
      JSON.stringify({
        building: site.address.building, line1: site.address.line1,
        street: site.address.street, city: site.address.city, country: site.address.country,
      }),
      site.address.coords[0], site.address.coords[1],
      offices.find((o) => o.city === 'Nairobi')?.address ?? null,
      [...site.cities], site.regulator, site.regionConfirmed,
      JSON.stringify(site.hours.map((h) => ({ days: h.days, time: h.time }))),
      site.hoursConfirmed, site.yearsInBusiness, JSON.stringify([]),
    ],
  );
  count.settings = 1;

  console.log('\nseeded');
  for (const [key, value] of Object.entries(count)) {
    console.log(`  ${String(value).padStart(4)}  ${key}`);
  }

  const { rows: check } = await db.query(`
    select (select count(*) from listings where status='published') published_listings,
           (select count(*) from listings where agent_id is null) orphan_listings,
           (select count(*) from listing_images) images,
           (select count(*) from agent_registrations where confirmed = false and number is not null) leaked_numbers
  `);
  if (keptImages || keptLogos) {
    console.log(`\n  kept in the bucket: ${keptImages} images, ${keptLogos} logos ` +
                '(not reset to public/ paths)');
  }

  console.log('\nchecks');
  console.log(`  published listings   ${check[0].published_listings}`);
  console.log(`  listings with no agent ${check[0].orphan_listings}`);
  console.log(`  images               ${check[0].images}`);
  console.log(`  unconfirmed numbers stored ${check[0].leaked_numbers}  (must be 0)`);

  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
