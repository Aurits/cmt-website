# Staying portable

How to use hosted infrastructure without being married to it. Amends `SCHEMA.md` sections 5 and 6,
which assumed the Supabase SDK throughout.

---

## 1. What is actually locked in

Not the data. This is the part worth being clear about before choosing anything.

| | Portable? |
|---|---|
| **Postgres itself** | Yes. It is standard Postgres. `pg_dump` and restore anywhere |
| **The tables and policies** | Yes. Ordinary DDL |
| **The bytes in the bucket** | Yes. Supabase Storage speaks the S3 API, same as R2, B2 and MinIO |
| **`supabase.from('listings').select()`** | **No.** This is the lock-in |
| **`supabase.auth.*`** | **No.** Users live in a schema the vendor owns |
| **`auth.uid()` inside a policy** | **No.** A Supabase function reading a Supabase JWT |

So the lock-in is the **SDK surface**, not the infrastructure. Which means the answer is not "avoid
Supabase". It is **use the infrastructure, refuse the SDK**.

Do that and Supabase becomes a hosting choice rather than an architecture. Moving to Neon plus
Cloudflare R2 later is a connection string and an endpoint, done in an afternoon, instead of a
rewrite.

---

## 2. The portable stack

| Concern | Choice | Why it travels |
|---|---|---|
| Database | Any Postgres, reached with **Kysely** | Typed SQL, no codegen, no proprietary anything. Runs on Supabase, Neon, RDS, a container |
| Storage | **S3 API** via `@aws-sdk/client-s3` | One client, any S3-compatible bucket. Swapping vendors is an endpoint and a key |
| Auth | **A library in the repo**, sessions in our own Postgres | No vendor owns the user table |
| Email | An SMTP-capable provider, used over SMTP | Every provider speaks it. Nothing to rewrite |

None of this is more expensive than the SDK path. It is a different set of imports.

### The seam already exists

`src/lib/admin/store.tsx` is already an adapter. Every admin screen calls `upsertListing`, never a
database. The public site imports from `src/data/*.ts`, never a database.

So the shape to grow into is the one the code already has:

```
src/lib/data/
  repository.ts        the interface every caller uses
  adapters/
    static.ts          src/data/*.ts, which is what runs today
    postgres.ts        Kysely against any Postgres
src/lib/storage/
  index.ts             put(), remove(), publicUrl()
  s3.ts                one implementation, any S3-compatible bucket
src/lib/auth/
  index.ts             session(), signIn(), signOut(), requireStaff()
```

Swapping a vendor means writing one file in `adapters/`. Swapping the whole backend means writing
one directory. Nothing above that line changes, which is the entire point.

---

## 3. Custom auth: yes, with one qualification

**Yes**, and for this project it is a reasonable call. The scope is unusually small:

- A handful of CMT staff, created by invitation
- No public signup, ever
- No social login
- One trust boundary: staff or not

That is the easy end of authentication. It is not a consumer product with a million accounts.

**The qualification: use a library, do not hand-roll the primitives.** "Custom auth" should mean
*our own user table and our own session handling, built on a library that gets the cryptography
right*. It should not mean writing password hashing and session rotation from scratch, which is
where this goes wrong and where the failure is silent until it is public.

What a credible version of this needs, none of which is exotic and all of which a library gives
you:

- **argon2id** password hashing, not SHA anything
- HTTP-only, `Secure`, `SameSite=Lax` session cookies, with rotation on privilege change
- Server-side session records, so revoking a session actually revokes it
- Rate limiting and lockout on the login route
- Single-use, expiring password reset tokens
- Timing-safe comparison on tokens

**Reasonable choices**, both of which live in the repo rather than in a vendor:

- **Auth.js (NextAuth)** with a credentials provider and database sessions. Large ecosystem, works
  with any Postgres through an adapter.
- **better-auth**, newer, database-agnostic, and less ceremony for exactly this shape of problem.

Either way the users live in **our** `profiles` table, in **our** Postgres. Changing database host
does not touch authentication, which is the property being bought here.

---

## 4. What this changes about row level security

This is the real consequence and it should not be waved past.

`SCHEMA.md` section 3 leans on `auth.uid()`, which exists because Supabase Auth issues a JWT that
PostgREST hands to Postgres. **With our own auth and a direct Postgres connection, that function
does not exist**, and the policies as written would evaluate against nobody.

Two ways forward.

### The one to take now: enforce in the repository

Drop RLS as the primary control and enforce access in `src/lib/data/`, which becomes the only path
to the database.

This is safe **because the threat model changes**. RLS earns its keep when a key ships to browsers
and the client talks to the database directly, which is exactly the Supabase SDK arrangement: the
anon key is public, so the database must defend itself. With a server-only connection there is no
browser-facing key, the database is not reachable from outside the server, and the repository is
the boundary.

That is how most Node applications are built, and it is not a downgrade so long as one rule holds:

> **Nothing outside `src/lib/data/` opens a database connection.** No page, no component, no route
> handler. One directory is the boundary, and it is small enough to review in an afternoon.

The `inquiries` protection still holds, for a different reason than before: the table is only
reachable through a repository that offers `create()` to the public forms and `list()` only behind
`requireStaff()`.

### The one to keep in reserve: RLS with our own claim

Connect as a restricted role rather than `postgres`, and set the caller on each transaction:

```sql
-- the app role, not a superuser
set local app.user_id = '<uuid>';
```

Policies then read `current_setting('app.user_id', true)::uuid` wherever they currently read
`auth.uid()`. Everything else in section 3 stands unchanged.

It is real defence in depth and it costs a wrapper around every transaction. Worth doing once the
launch is behind us; not worth adding to the eight days that are left.

---

## 5. The honest cost

| | |
|---|---|
| **Extra work now** | Roughly a day and a half against the SDK path. Auth wiring is most of it |
| **Given up** | Supabase's auth UI, storage image transforms, realtime, and the convenience of one dashboard |
| **Bought** | A backend that can move hosts in an afternoon, and no user table owned by a vendor |

In an eight-day window that day and a half is real. It is the right trade only because this is a
client's business platform that will outlive the sprint, and because the alternative rewrite is
paid at the worst possible moment, which is when the vendor's pricing or terms change.

---

## 6. What to run on today

Nothing about this forces a host. Two sensible starts:

- **Supabase**, used only as hosted Postgres plus an S3-compatible bucket. One dashboard, one
  bill, and the SDK left in the box.
- **Neon plus Cloudflare R2.** Neon for Postgres, R2 for storage with no egress charges, which is
  the cheaper way to serve photographs to a market on metered data.

They are equivalent under this architecture, which is the proof that it worked. Pick on price and
on whose dashboard you would rather hand to CMT.

---

## 7. What changes in the other documents

- `SCHEMA.md` section 3 keeps every policy, with `auth.uid()` becoming
  `current_setting('app.user_id')` if and when RLS is turned on
- `SCHEMA.md` section 5 is superseded by section 3 above
- `SCHEMA.md` section 6 is superseded by section 2 above
- `BUILD-PLAN.md` day three gains the auth wiring and loses "Supabase Auth replaces the
  localStorage gate"
