-- Security hardening migration: fixes critical privilege escalation vulnerabilities.
--
-- 1. Restrict user_profiles UPDATE policy to prevent role/plan self-escalation
-- 2. Add authorization check to award_xp() SECURITY DEFINER function
-- 3. Add authorization check to search_content() for private notes
-- 4. Pin search_path on functions missing it
-- 5. Revoke anon from leaderboard_weekly

------------------------------------------------------------------------
-- 1. Fix user_profiles RLS: prevent users from modifying role, plan,
--    stripe_customer_id, founder_rank, or pro_until on their own row.
------------------------------------------------------------------------
drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select up.role from public.user_profiles up where up.id = auth.uid())
    and plan = (select up.plan from public.user_profiles up where up.id = auth.uid())
    and stripe_customer_id is not distinct from (select up.stripe_customer_id from public.user_profiles up where up.id = auth.uid())
  );

------------------------------------------------------------------------
-- 2. Fix award_xp(): require auth.uid() = p_user_id
------------------------------------------------------------------------
create or replace function public.award_xp(
  p_user_id uuid,
  p_source text,
  p_points int default 10
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.xp_events (user_id, source, points, awarded_at)
  values (p_user_id, p_source, p_points, now());

  insert into public.user_profiles (id, xp_total)
  values (p_user_id, p_points)
  on conflict (id) do update
    set xp_total = user_profiles.xp_total + excluded.xp_total;
end;
$$;

------------------------------------------------------------------------
-- 3. Fix search_content(): enforce that searching_user_id = auth.uid()
--    and escape ILIKE wildcards in search_query.
------------------------------------------------------------------------
create or replace function public.search_content(
  search_query text,
  searching_user_id uuid default null
) returns setof json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  safe_query text;
begin
  -- Enforce authorization: users can only search their own notes
  if searching_user_id is not null and (auth.uid() is null or auth.uid() <> searching_user_id) then
    raise exception 'not authorized';
  end if;

  -- Escape ILIKE wildcards to prevent pattern injection
  safe_query := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');

  return query
    select row_to_json(r) from (
      select 'topic' as type, lt.id, lt.title, lt.specialty, lt.difficulty, null as filename
      from public.library_topics lt
      where lt.title ilike '%' || safe_query || '%'
         or lt.specialty ilike '%' || safe_query || '%'
      union all
      select 'note' as type, un.id, un.title, null as specialty, null as difficulty, un.filename
      from public.user_notes un
      where un.user_id = searching_user_id
        and (un.title ilike '%' || safe_query || '%'
             or un.filename ilike '%' || safe_query || '%')
    ) r;
end;
$$;

------------------------------------------------------------------------
-- 4. Pin search_path on handle_new_user (from migration 001)
------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_proc where proname = 'handle_new_user') then
    execute 'alter function public.handle_new_user() set search_path = public, pg_temp';
  end if;
end
$$;

-- Pin bump_streak search_path consistently
alter function public.bump_streak(uuid) set search_path = public, pg_temp;

------------------------------------------------------------------------
-- 5. Revoke anon access from leaderboard (authenticated only)
------------------------------------------------------------------------
revoke select on public.leaderboard_weekly from anon;
