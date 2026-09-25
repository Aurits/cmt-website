import 'server-only';
import { hasDatabase } from '@/lib/env';
import { staticRepository } from '@/lib/data/adapters/static';
import type { Repository } from '@/lib/data/repository';

/**
 * Which adapter is in play.
 *
 * The switch is `DATABASE_URL`, nothing cleverer. Unset, the site reads the static content it has
 * always read and needs no backend to build or serve. Set, it reads Postgres. That is what lets
 * the migration land a table at a time without a window where the site is broken, and it is why
 * CI never needs a database.
 *
 * The Postgres adapter is imported lazily so `pg` never loads on a machine that has no database
 * configured, which keeps the static build exactly as light as it is today.
 */
let cached: Repository | null = null;

export async function getRepository(): Promise<Repository> {
  if (cached) return cached;

  if (hasDatabase()) {
    const { postgresRepository } = await import('@/lib/data/adapters/postgres');
    cached = postgresRepository();
  } else {
    cached = staticRepository;
  }

  return cached;
}

export type { Repository } from '@/lib/data/repository';
export { UnsupportedOperation } from '@/lib/data/repository';
