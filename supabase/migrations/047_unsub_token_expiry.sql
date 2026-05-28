-- Ensure email_unsub_tokens has a created_at column (already exists from
-- migration 030, but be defensive). The web route enforces a 30-day TTL
-- in application code; this migration is here for documentation and in
-- case the column was somehow dropped.
alter table public.email_unsub_tokens
  add column if not exists created_at timestamptz not null default now();
