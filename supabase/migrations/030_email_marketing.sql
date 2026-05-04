-- Email-marketing flags on user_profiles. Two timestamps for idempotency
-- (so welcome and brain-teaser sends never duplicate even if a cron retries
-- or a webhook fires twice), plus a single opt-out flag the unsubscribe
-- link flips to false.
alter table public.user_profiles
  add column if not exists email_marketing_opt_in boolean not null default true,
  add column if not exists welcome_email_sent_at  timestamptz,
  add column if not exists brain_teaser_last_sent_at timestamptz;

-- Tiny lookup to back the unsubscribe link without exposing the user's
-- email in the URL. Token is opaque, single-use-per-link rebound on each
-- send. We don't bother with rotation — losing one token only de-subs
-- the user, which is the goal anyway.
create table if not exists public.email_unsub_tokens (
  token       text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists email_unsub_tokens_user_idx
  on public.email_unsub_tokens (user_id);

alter table public.email_unsub_tokens enable row level security;

-- Inserts and reads happen via service-role only (server-side from cron
-- and the unsubscribe route). No user-facing policy needed.
