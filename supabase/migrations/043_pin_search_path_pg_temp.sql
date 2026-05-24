-- Pin search_path to include pg_temp on functions that only use public schema.
-- Prevents a malicious temp object from shadowing a public one.
-- (handle_new_user was already fixed in 037; award_xp and bump_streak were not.)

-- 1. award_xp — identical to 037 version but with pg_temp added to search_path
create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  int
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_recent_count int;
  v_caller_uid   uuid := auth.uid();
begin
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Authenticated callers may only award XP to themselves. Service-role
  -- (auth.uid() IS NULL) keeps its existing bypass so cron / admin paths
  -- can backfill.
  if v_caller_uid is not null and v_caller_uid <> p_user_id then
    raise exception 'award_xp: caller % is not the target user %', v_caller_uid, p_user_id
      using errcode = '42501';
  end if;

  -- Idempotency window: skip if same (user, source) hit in the last 60s.
  select count(*) into v_recent_count
  from public.xp_events
  where user_id = p_user_id
    and source  = p_source
    and created_at >= now() - interval '60 seconds';
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

-- 2. bump_streak — identical to 013 version but with pg_temp added to search_path
create or replace function public.bump_streak(p_user_id uuid)
returns table (current_streak int, longest_streak int, last_active_date date)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_today  date := (now() at time zone 'utc')::date;
  v_last   date;
  v_cur    int;
  v_long   int;
  v_new    int;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  select up.last_active_date, up.current_streak, up.longest_streak
    into v_last, v_cur, v_long
  from public.user_profiles up
  where up.id = p_user_id
  for update;

  if not found then
    raise exception 'user_profiles row missing for %', p_user_id;
  end if;

  if v_last = v_today then
    -- Already counted today. No-op.
    return query select v_cur, v_long, v_last;
    return;
  end if;

  if v_last = v_today - 1 then
    v_new := coalesce(v_cur, 0) + 1;
  else
    v_new := 1;
  end if;

  update public.user_profiles
     set current_streak  = v_new,
         longest_streak  = greatest(coalesce(v_long, 0), v_new),
         last_active_date = v_today,
         updated_at      = now()
   where id = p_user_id;

  return query
    select v_new, greatest(coalesce(v_long, 0), v_new), v_today;
end;
$$;

grant execute on function public.bump_streak(uuid) to authenticated;
