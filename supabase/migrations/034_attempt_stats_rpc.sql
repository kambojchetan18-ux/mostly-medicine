-- RPC for aggregated attempt stats — replaces unbounded SELECT * queries
-- Returns total attempts and correct count for a user in a single row.

create or replace function public.get_attempt_stats(p_user_id uuid)
returns table(total bigint, correct bigint)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    count(*)::bigint as total,
    count(*) filter (where is_correct)::bigint as correct
  from public.attempts
  where user_id = p_user_id;
$$;

grant execute on function public.get_attempt_stats(uuid) to authenticated;

-- Atomic topic_progress increment — replaces read-modify-write pattern
create or replace function public.increment_topic_progress(
  p_user_id uuid,
  p_topic text,
  p_is_correct boolean
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.topic_progress (user_id, topic, total_attempted, total_correct)
  values (p_user_id, p_topic, 1, case when p_is_correct then 1 else 0 end)
  on conflict (user_id, topic)
  do update set
    total_attempted = topic_progress.total_attempted + 1,
    total_correct = topic_progress.total_correct + (case when p_is_correct then 1 else 0 end),
    updated_at = now();
end;
$$;

grant execute on function public.increment_topic_progress(uuid, text, boolean) to authenticated;
