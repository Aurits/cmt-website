'use server';

import { randomUUID } from 'node:crypto';
import { requireStaff } from '@/lib/auth';
import { getStorage, publicUrl } from '@/lib/storage';

/**
 * Uploading a file from the CMS.
 *
 * Same two rules as every other mutation: requireStaff() first, and nothing about what gets
 * written is taken from the client except the bytes. The key is minted here, so a caller cannot
 * choose where a file lands, and the content type is read from the file rather than from whatever
 * the browser claimed.
 *
 * The gallery used to call URL.createObjectURL and hand back a blob: URL, which looked like an
 * upload and lasted until the tab closed. This replaces that.
 */

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Sniffed from the first bytes rather than trusted from the Content-Type header, which is
 * attacker-controlled. An upload whose magic number does not match a real image is rejected
 * outright rather than stored and served back to visitors.
 */
const SIGNATURES: { type: string; ext: string; test: (bytes: Uint8Array) => boolean }[] = [
  {
    type: 'image/jpeg',
    ext: 'jpg',
    test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    type: 'image/png',
    ext: 'png',
    test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    type: 'image/webp',
    ext: 'webp',
    test: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
];

export type UploadFolder = 'listings' | 'agents' | 'partners' | 'blog';

export interface UploadResult {
  /** A full URL, ready to render. The database stores the key; see storage.toStoredPath. */
  url?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireStaff();

  const file = formData.get('file');
  const folder = String(formData.get('folder') ?? 'listings') as UploadFolder;

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'No file was received.' };
  }
  if (file.size > MAX_BYTES) {
    return {
      error: `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${
        MAX_BYTES / 1024 / 1024
      }MB — resize it and try again.`,
    };
  }
  if (!['listings', 'agents', 'partners', 'blog'].includes(folder)) {
    return { error: 'Unknown destination.' };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const match = SIGNATURES.find((signature) => signature.test(bytes));
  if (!match) {
    return { error: 'That does not look like a JPEG, PNG or WebP image.' };
  }

  try {
    // The name is ours, not the visitor's: no path traversal, no collisions, no surprises from
    // a filename with a quote in it. The original name is not worth keeping.
    const key = `${folder}/${randomUUID()}.${match.ext}`;
    await getStorage().put(key, bytes, match.type);
    return { url: publicUrl(key) };
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : 'The upload failed. Check the storage settings and try again.',
    };
  }
}
