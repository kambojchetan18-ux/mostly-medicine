-- Migration 043: add WITH CHECK to UPDATE/INSERT policies that were
-- missing it.  Without WITH CHECK on an UPDATE policy, a malicious
-- client could mutate user_id to another user's ID on their own row.

-- acrp_sessions (migration 009)
drop policy if exists "acrp_sessions_user" on public.acrp_sessions;
create policy acrp_sessions_user on public.acrp_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- acrp_live_sessions (migration 010)
drop policy if exists "acrp_live_sessions_own" on public.acrp_live_sessions;
create policy acrp_live_sessions_own on public.acrp_live_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- mcq_sessions (migration 027)
drop policy if exists "mcq_sessions_own" on public.mcq_sessions;
create policy mcq_sessions_own on public.mcq_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cat2_sessions (migration 029)
drop policy if exists "cat2_sessions_own" on public.cat2_sessions;
create policy cat2_sessions_own on public.cat2_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
