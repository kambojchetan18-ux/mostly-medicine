-- 014_xp_leaderboard.sql — XP + Leaderboard system
-- Adds total_xp to user_profiles, xp_events log, an atomic award_xp() RPC,
-- and a leaderboard_weekly view (top users in last 7 days, non-admin only).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add total_xp to user_profiles
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.user_profiles
  add column if not exists total_xp int not null default 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. xp_events table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  source      text not null,
  points      int  not null,
  created_at  timestamptz not null default now()
);

create index if not exists xp_events_user_created_idx
  on public.xp_events (user_id, created_at desc);

create index if not exists xp_events_created_idx
  on public.xp_events (created_at desc);

alter table public.xp_events enable row level security;

drop policy if exists "Users can view own xp events" on public.xp_events;
create policy "Users can view own xp events"
  on public.xp_events for select
  using (auth.uid() = user_id);

-- Inserts only happen via the SECURITY DEFINER award_xp() RPC, so no insert policy needed.

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. award_xp(user_id, source, points)
--    Atomically logs xp_events row + increments user_profiles.total_xp.
--    Idempotent within a 60-second window: skips if same (user, source) was
--    already awarded in the previous minute (so accidental double-clicks
--    don't double-award).
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

  -- Idempotency window: skip if same (user, source) hit in the last 60s.
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

revoke all on function public.award_xp(uuid, text, int) from public;
grant execute on function public.award_xp(uuid, text, int) to authenticated, service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. leaderboard_weekly view
--    Sum of points awarded in the past 7 days per user, joined with profile.
--    Excludes admin users for privacy / fairness.
-- ─────────────────────────────────────────────────────────────────────────────
drop view if exists public.leaderboard_weekly;
create view public.leaderboard_weekly
with (security_invoker = true)
as
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
order by weekly_xp desc;

grant select on public.leaderboard_weekly to anon, authenticated;
