-- Our own auth. No vendor owns the user table (docs/PORTABILITY.md section 3).
--
-- Sessions are stored rather than being self-describing tokens, so signing someone out actually
-- signs them out. password_hash holds an argon2id digest; nothing in the database ever sees a
-- password.

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  full_name     text,
  password_hash text not null,
  role          text not null default 'editor' check (role in ('admin','editor')),
  -- Set when an invitation is accepted. Null means invited and not yet active, which is how a
  -- new colleague exists before their first login rather than as a half-made account.
  activated_at  timestamptz,
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users on delete cascade,
  -- The cookie carries a random token; only its hash is stored, so a database leak does not
  -- hand over live sessions.
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  user_agent text,
  ip         inet
);

create index if not exists sessions_user_idx on sessions (user_id);
create index if not exists sessions_expiry_idx on sessions (expires_at);
