-- Automatic cleanup for rate_limit_attempts to prevent unbounded table growth.
-- Deletes expired entries (older than 2 hours with no active lock) on a schedule.
-- If pg_cron is not available, this function can be called manually or via
-- an edge function cron trigger.

create or replace function public.cleanup_rate_limit_attempts()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_count integer;
begin
  delete from public.rate_limit_attempts
  where first_attempt_at < now() - interval '2 hours'
    and (locked_until is null or locked_until < now());
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- Grant execute to service_role only (called by cron or edge function, not users)
revoke execute on function public.cleanup_rate_limit_attempts() from public;
revoke execute on function public.cleanup_rate_limit_attempts() from anon;
revoke execute on function public.cleanup_rate_limit_attempts() from authenticated;
grant execute on function public.cleanup_rate_limit_attempts() to service_role;

-- Add index to speed up cleanup queries
create index if not exists rate_limit_attempts_first_attempt_at_idx
  on public.rate_limit_attempts (first_attempt_at);
