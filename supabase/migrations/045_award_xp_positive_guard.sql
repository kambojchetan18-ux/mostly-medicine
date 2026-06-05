-- Guard award_xp() against negative/zero point values.
-- Without this, a user could call award_xp(auth.uid(), 'mcq_correct', -99999)
-- to game the leaderboard.

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
  v_caller_uid   uuid := auth.uid();
begin
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Reject negative or zero points to prevent leaderboard manipulation.
  if p_points <= 0 then
    return;
  end if;

  -- Authenticated callers may only award XP to themselves.
  if v_caller_uid is not null and v_caller_uid <> p_user_id then
    raise exception 'award_xp: caller % is not the target user %', v_caller_uid, p_user_id
      using errcode = '42501';
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
