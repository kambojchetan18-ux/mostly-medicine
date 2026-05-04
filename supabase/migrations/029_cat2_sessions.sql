-- Per-session log for AMC Handbook AI RolePlay (cat2). The roleplay
-- module had no usage counter, so daily_limit was unenforceable. Each
-- "first turn" of a scenario inserts one row here; enforceDailyLimit()
-- now counts these rows for free-plan gating.
create table if not exists public.cat2_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  scenario_id text,
  created_at  timestamptz not null default now()
);

create index if not exists cat2_sessions_user_id_created_at_idx
  on public.cat2_sessions (user_id, created_at desc);

alter table public.cat2_sessions enable row level security;

-- Users can read their own session log (used by future analytics, not by
-- the gate which runs server-side via service role).
drop policy if exists cat2_sessions_select_own on public.cat2_sessions;
create policy cat2_sessions_select_own
  on public.cat2_sessions
  for select
  using (auth.uid() = user_id);

-- Inserts come from the API route via service-role client; no user-facing
-- insert policy needed. Service role bypasses RLS.
