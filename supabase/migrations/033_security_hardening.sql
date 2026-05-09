-- 033_security_hardening.sql — Fixes critical privilege-escalation vectors
-- identified during security audit (2026-05-08).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CRITICAL: Restrict user_profiles self-UPDATE to safe columns only.
--    Without a WITH CHECK or column-level grants, any authenticated user could
--    SET role='admin', plan='enterprise' on their own row via the Supabase
--    client. Replace the blanket "Users can update their own profile" policy
--    with one that only allows updating display fields.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update own display fields"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    -- Block self-modification of privileged columns by ensuring they haven't
    -- changed from their current DB values. The WITH CHECK fires on the NEW
    -- row; comparing against a subselect on the OLD row catches any mutation.
    role = (select role from public.user_profiles where id = auth.uid())
    and plan = (select plan from public.user_profiles where id = auth.uid())
    and total_xp = (select total_xp from public.user_profiles where id = auth.uid())
    and current_streak = (select current_streak from public.user_profiles where id = auth.uid())
    and longest_streak = (select longest_streak from public.user_profiles where id = auth.uid())
    and last_active_date = (select last_active_date from public.user_profiles where id = auth.uid())
      or last_active_date is null and (select last_active_date from public.user_profiles where id = auth.uid()) is null
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CRITICAL: award_xp must verify caller identity.
--    Any authenticated user could call award_xp(<other_user_id>, ...) to
--    inflate another user's XP. Add the same auth.uid() guard that
--    bump_streak already has.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_count int;
begin
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  select count(*) into v_recent_count
  from public.xp_events
  where user_id = p_user_id
    and source = p_source
    and created_at > now() - interval '60 seconds';

  if v_recent_count > 0 then
    return;
  end if;

  insert into public.xp_events (user_id, source, points)
  values (p_user_id, p_source, p_points);

  update public.user_profiles
  set total_xp = coalesce(total_xp, 0) + p_points,
      updated_at = now()
  where id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. HIGH: Pin search_path on legacy handle_new_user() function.
-- ─────────────────────────────────────────────────────────────────────────────

alter function public.handle_new_user() set search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. HIGH: Leaderboard view — use SECURITY DEFINER function instead of
--    security_invoker view, so non-admin users can see the full leaderboard.
-- ─────────────────────────────────────────────────────────────────────────────

drop view if exists public.leaderboard_weekly;

create or replace function public.get_leaderboard_weekly()
returns table (
  user_id    uuid,
  full_name  text,
  avatar_url text,
  plan       text,
  weekly_xp  int,
  event_count int
)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.id              as user_id,
    p.full_name,
    p.avatar_url,
    p.plan,
    coalesce(sum(e.points), 0)::int as weekly_xp,
    count(e.id)::int                as event_count
  from public.user_profiles p
  join public.xp_events e
    on e.user_id = p.id
   and e.created_at >= now() - interval '7 days'
  where p.role <> 'admin'
  group by p.id, p.full_name, p.avatar_url, p.plan
  having coalesce(sum(e.points), 0) > 0
  order by weekly_xp desc
  limit 100;
$$;

revoke all on function public.get_leaderboard_weekly() from public;
grant execute on function public.get_leaderboard_weekly() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. LOW: Pin search_path consistently on bump_streak and award_xp
-- ─────────────────────────────────────────────────────────────────────────────

alter function public.bump_streak(uuid) set search_path = public, pg_temp;
alter function public.award_xp(uuid, text, int) set search_path = public, pg_temp;
