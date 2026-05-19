-- Schema improvements from code review action items (2026-05-15):
--
-- 1. user_profiles.email unique constraint — prevents duplicate accounts.
-- 2. acrp_sessions composite index on (user_id, case_id) for per-case lookups.
-- 3. email_unsub_tokens.expires_at — tokens expire after 90 days.

-- 1. Unique constraint on user_profiles.email
-- Drop-safe: IF NOT EXISTS is not available for constraints, so use DO block.
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'user_profiles_email_unique'
  ) then
    alter table public.user_profiles
      add constraint user_profiles_email_unique unique (email);
  end if;
end $$;

-- 2. Composite index for acrp_sessions(user_id, case_id) — speeds up
-- "has this user attempted this case?" lookups in the session start flow.
create index if not exists acrp_sessions_user_case_idx
  on public.acrp_sessions (user_id, case_id);

-- 3. Add expires_at to email_unsub_tokens with 90-day default.
alter table public.email_unsub_tokens
  add column if not exists expires_at timestamptz
    not null default (now() + interval '90 days');
