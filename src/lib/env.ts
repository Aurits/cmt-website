import 'server-only';

/**
 * Environment, read once and checked when it is actually needed.
 *
 * Two rules shape this file.
 *
 * LAZY, NOT EAGER. Validating at import time would mean `next build` fails on a machine with no
 * database, which is every CI runner and every fresh clone. The site is fully static today and
 * has to stay buildable that way, so each group below is only checked at the moment something
 * asks for it. A missing variable then fails where it is used, with a message naming the
 * variable, rather than as a stack trace inside a driver.
 *
 * SERVER ONLY. `import 'server-only'` makes importing this from a client component a build error
 * rather than a leaked secret. There is deliberately no browser-facing database or storage key in
 * this project (docs/PORTABILITY.md), so nothing here should ever reach a bundle, and this is
 * what enforces it rather than hoping.
 */

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

function require_(name: string, why: string): string {
  const value = read(name);
  if (!value) {
    throw new Error(
      `Missing ${name}. ${why} Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/**
 * Is there a database to talk to?
 *
 * This is the switch the repository uses to choose its adapter, which is what lets the migration
 * happen a table at a time: unset, the app reads the static content in src/data as it always has;
 * set, it reads Postgres. Nothing in between breaks.
 */
export function hasDatabase(): boolean {
  return Boolean(read('DATABASE_URL'));
}

export function databaseUrl(): string {
  // The pooled string where the host gives one, because serverless opens a connection per
  // invocation and the direct limit is not generous.
  return (
    read('DATABASE_POOL_URL') ??
    require_('DATABASE_URL', 'The repository needs a Postgres connection.')
  );
}

/** The unpooled connection. Migrations want a real session, not a transaction-mode pool. */
export function migrationUrl(): string {
  return require_('DATABASE_URL', 'Migrations need a direct Postgres connection.');
}

export function hasStorage(): boolean {
  return Boolean(read('S3_BUCKET') && read('S3_ENDPOINT'));
}

export function storage() {
  return {
    endpoint: require_('S3_ENDPOINT', 'Uploads need an S3-compatible endpoint.'),
    region: read('S3_REGION') ?? 'auto',
    bucket: require_('S3_BUCKET', 'Uploads need a bucket name.'),
    accessKeyId: require_('S3_ACCESS_KEY_ID', 'Uploads need credentials.'),
    secretAccessKey: require_('S3_SECRET_ACCESS_KEY', 'Uploads need credentials.'),
    publicUrl: require_('S3_PUBLIC_URL', 'Stored files need a public origin to be served from.'),
  };
}

export function auth() {
  const secret = require_('AUTH_SECRET', 'Sessions are signed with it.');
  if (secret.length < 32) {
    throw new Error('AUTH_SECRET is too short. Use at least 32 bytes: openssl rand -base64 32');
  }
  return { secret, url: read('AUTH_URL') ?? siteUrl() };
}

export function hasMail(): boolean {
  return Boolean(read('SMTP_HOST') && read('MAIL_TO'));
}

export function mail() {
  return {
    host: require_('SMTP_HOST', 'Enquiry notifications are sent over SMTP.'),
    port: Number(read('SMTP_PORT') ?? 587),
    user: read('SMTP_USER'),
    password: read('SMTP_PASSWORD'),
    from: read('MAIL_FROM') ?? 'CMT Realtors <noreply@cmtrealtors.com>',
    to: require_('MAIL_TO', 'Enquiries have to arrive somewhere.'),
  };
}

/** Canonical origin. Safe to call anywhere; falls back to localhost in development. */
export function siteUrl(): string {
  return read('NEXT_PUBLIC_SITE_URL') ?? 'http://localhost:3000';
}

/**
 * What is wired up, for the admin to report rather than for the app to branch on.
 * A prototype that says which half of itself is real is easier to hand over than one that
 * looks finished and is not.
 */
export function capabilities() {
  return { database: hasDatabase(), storage: hasStorage(), mail: hasMail() };
}
