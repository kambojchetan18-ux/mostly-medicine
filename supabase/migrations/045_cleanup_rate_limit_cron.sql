-- Cleanup stale rate_limit_attempts rows and schedule via pg_cron.
-- Rows older than 25 hours (covers the 24h email-daily window + buffer)
-- are no longer useful for enforcement and waste storage.

create extension if not exists pg_cron with schema extensions;

create or replace function public.cleanup_rate_limit_attempts()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.rate_limit_attempts
  where updated_at < now() - interval '25 hours';
end;
$$;

select cron.schedule(
  'cleanup-rate-limit-attempts',
  '0 0 * * *',
  $$select public.cleanup_rate_limit_attempts()$$
);
