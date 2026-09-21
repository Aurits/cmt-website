import 'server-only';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { hasStorage, storage as storageEnv } from '@/lib/env';

/**
 * Files, behind an interface, for the same reason the database is.
 *
 * The S3 API is the portable part of object storage: Supabase Storage, Cloudflare R2, Backblaze
 * B2, MinIO and S3 itself all speak it, so swapping vendors is an endpoint and a key rather than
 * a rewrite. That is the whole reason this project uses the S3 client and not a vendor SDK. See
 * docs/PORTABILITY.md.
 *
 * WHAT A PATH MEANS. The database stores a path, never a full URL, so putting a CDN in front of
 * the bucket later is a config change rather than a data migration. Two kinds of path coexist,
 * and the leading slash tells them apart:
 *
 *   /images/listings/x.jpg     a file in public/, served by the app. Site furniture, and the
 *                              stock photography that shipped with the prototype.
 *   seed/listings/x.jpg        a key in the bucket.
 *
 * Both are valid at once, on purpose. It means real photography can arrive one property at a
 * time without a flag day where every image has to move at once.
 */

export interface Storage {
  readonly kind: 'local' | 's3';
  /** Stores bytes and returns the path to persist. */
  put(key: string, body: Uint8Array, contentType: string): Promise<string>;
  remove(key: string): Promise<void>;
}

/** True when a path points at a file in public/ rather than at the bucket. */
export function isLocalPath(path: string): boolean {
  return path.startsWith('/');
}

/**
 * The public base for bucket files.
 *
 * Derived from the endpoint when S3_PUBLIC_URL is unset, because Supabase's S3 endpoint and its
 * public object URL differ only by a subdomain and it is an easy thing to leave blank. Set it
 * explicitly once a CDN is in front.
 */
export function publicBase(): string {
  const env = storageEnv();
  if (env.publicUrlOptional) return env.publicUrlOptional.replace(/\/$/, '');
  const ref = new URL(env.endpoint).hostname.split('.')[0];
  return `https://${ref}.supabase.co/storage/v1/object/public/${env.bucket}`;
}

/** Turns a stored path into something an <img> or next/image can fetch. */
export function publicUrl(path: string): string {
  if (isLocalPath(path)) return path;
  if (!hasStorage()) return path;
  return `${publicBase()}/${path.replace(/^\/+/, '')}`;
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  const env = storageEnv();
  client = new S3Client({
    endpoint: env.endpoint,
    region: env.region,
    // Supabase, R2 and MinIO all want path style. Virtual-host style is an AWS-ism.
    forcePathStyle: true,
    credentials: { accessKeyId: env.accessKeyId, secretAccessKey: env.secretAccessKey },
  });
  return client;
}

const s3Storage: Storage = {
  kind: 's3',
  async put(key, body, contentType) {
    const env = storageEnv();
    await getClient().send(
      new PutObjectCommand({
        Bucket: env.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        // A year, immutable. Keys carry a uuid, so a changed image is a new key rather than a
        // changed one, which is what makes caching this hard safe.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    return key;
  },
  async remove(key) {
    const env = storageEnv();
    await getClient().send(new DeleteObjectCommand({ Bucket: env.bucket, Key: key }));
  },
};

/**
 * Read-only, for when no bucket is configured. Uploading is refused loudly rather than silently
 * dropping the file, which is the same posture the static data adapter takes about writes.
 */
const localStorage: Storage = {
  kind: 'local',
  async put() {
    throw new Error(
      'No object storage configured. Set S3_ENDPOINT, S3_BUCKET and the keys in .env.local.',
    );
  },
  async remove() {
    throw new Error('No object storage configured.');
  },
};

export function getStorage(): Storage {
  return hasStorage() ? s3Storage : localStorage;
}

/** Where a file belongs, so the convention lives in one place rather than at each call site. */
export const keys = {
  listingImage: (listingId: string, filename: string) => `listings/${listingId}/${filename}`,
  partnerLogo: (partnerId: string, filename: string) => `partners/${partnerId}/${filename}`,
  agentPhoto: (agentId: string, filename: string) => `agents/${agentId}/${filename}`,
  postCover: (postId: string, filename: string) => `blog/${postId}/${filename}`,
  /**
   * Stock photography that shipped with the prototype. Shared between listings rather than owned
   * by one, which is why it is not under listings/<id>/: these are illustrative, the property
   * pages say so, and real photographs replace them one property at a time.
   */
  seedListingImage: (filename: string) => `seed/listings/${filename}`,
};
