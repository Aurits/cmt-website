import 'server-only';
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import type { ScryptOptions } from 'node:crypto';

// Hand-wrapped rather than promisify'd: promisify resolves to scrypt's three-argument overload
// and drops the options parameter, which is where the cost factors live.
function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (error, key) =>
      error ? reject(error) : resolve(key as Buffer),
    );
  });
}

/**
 * Password hashing, with Node's own scrypt.
 *
 * Argon2id is the first choice in OWASP's guidance and scrypt is the named acceptable
 * alternative. Argon2 in Node means a native module, and this project is built from WSL against
 * a Windows filesystem with a Windows node binary, which is exactly the arrangement where a
 * prebuilt binding installs for the wrong platform and fails at runtime rather than at install.
 * A correct scrypt beats a broken argon2, so scrypt it is, with OWASP's minimum parameters.
 *
 * N = 2^17, r = 8, p = 1. That needs roughly 128 * N * r bytes, about 134MB, which is well past
 * Node's 32MB default, so maxmem is raised deliberately rather than the cost being quietly
 * lowered to fit.
 *
 * The stored string names its own algorithm and parameters. That is what makes moving to argon2id
 * later a rehash-on-next-login rather than a forced password reset for everybody: verify reads
 * whatever scheme the stored hash declares, and sign-in can upgrade the record afterwards.
 */
const N = 2 ** 17;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAXMEM = 256 * 1024 * 1024;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(plain.normalize('NFKC'), salt, KEY_LENGTH, {
    N,
    r: R,
    p: P,
    maxmem: MAXMEM,
  });
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, saltB64, keyB64] = parts;
  const salt = Buffer.from(saltB64, 'base64url');
  const expected = Buffer.from(keyB64, 'base64url');

  let actual: Buffer;
  try {
    actual = await scrypt(plain.normalize('NFKC'), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: MAXMEM,
    });
  } catch {
    return false;
  }

  // Constant time, and length-checked first because timingSafeEqual throws on a mismatch.
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** True when a stored hash was made with weaker parameters than we now use. */
export function needsRehash(stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return true;
  return Number(parts[1]) < N || Number(parts[2]) < R;
}
