-- Fix missing WITH CHECK clauses on UPDATE RLS policies and add missing DELETE policies.
-- Without WITH CHECK, UPDATE policies only restrict WHICH rows can be selected,
-- not WHAT values can be written — allowing users to theoretically overwrite
-- ownership columns on their own rows.

-- 1. profiles (migration 001)
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. user_case_progress (migration 002) — UPDATE + missing DELETE
drop policy if exists "Users can update their own progress" on public.user_case_progress;
create policy "Users can update their own progress"
  on public.user_case_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_case_progress for delete
  using (auth.uid() = user_id);

-- 3. user_profiles (migration 007)
drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. acrp_sessions (migration 009)
drop policy if exists "Users update own sessions" on public.acrp_sessions;
create policy "Users update own sessions"
  on public.acrp_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. acrp_live_sessions (migration 010)
drop policy if exists "Participants update their session" on public.acrp_live_sessions;
create policy "Participants update their session"
  on public.acrp_live_sessions for update
  using (auth.uid() = host_user_id or auth.uid() = guest_user_id)
  with check (auth.uid() = host_user_id or auth.uid() = guest_user_id);
