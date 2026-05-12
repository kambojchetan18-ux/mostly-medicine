-- 034_atomic_upserts_and_aggregates.sql — Server-side aggregate RPCs + email token expiry
--
-- Changes:
--   1. get_attempt_stats(p_user_id) — returns total_attempted, total_correct
--      in a single query instead of fetching all attempt rows client-side.
--   2. upsert_topic_progress(p_user_id, p_topic, p_is_correct) — atomic
--      INSERT ... ON CONFLICT upsert so concurrent answers can't race.
--   3. email_unsub_tokens.expires_at — tokens auto-expire after 30 days.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. get_attempt_stats — aggregate attempt counts server-side
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_attempt_stats(p_user_id uuid)
returns table (total_attempted int, total_correct int)
language sql
stable
set search_path = public, pg_temp
as $$
  SELECT
    COUNT(*)::int AS total_attempted,
    COUNT(*) FILTER (WHERE is_correct)::int AS total_correct
  FROM public.attempts
  WHERE user_id = p_user_id;
$$;

grant execute on function public.get_attempt_stats(uuid) to authenticated;
grant execute on function public.get_attempt_stats(uuid) to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. upsert_topic_progress — atomic insert-or-increment
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.upsert_topic_progress(
  p_user_id uuid,
  p_topic text,
  p_is_correct boolean
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Only the owning user may call this
  if auth.uid() is distinct from p_user_id then
    raise exception 'auth.uid() does not match p_user_id';
  end if;

  INSERT INTO public.topic_progress (user_id, topic, total_attempted, total_correct)
  VALUES (p_user_id, p_topic, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, topic) DO UPDATE SET
    total_attempted = topic_progress.total_attempted + 1,
    total_correct   = topic_progress.total_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END;
end;
$$;

grant execute on function public.upsert_topic_progress(uuid, text, boolean) to authenticated;
grant execute on function public.upsert_topic_progress(uuid, text, boolean) to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. email_unsub_tokens — add expires_at with 30-day default
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.email_unsub_tokens
  add column if not exists expires_at timestamptz not null default now() + interval '30 days';
