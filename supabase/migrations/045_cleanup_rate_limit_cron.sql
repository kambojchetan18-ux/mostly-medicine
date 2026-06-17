-- Scheduled cleanup for rate_limit_attempts rows older than 24 hours.
-- Requires pg_cron extension (enabled by default on Supabase).

create extension if not exists pg_cron with schema extensions;

create or replace function public.cleanup_rate_limit_attempts()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limit_attempts
  where updated_at < now() - interval '24 hours';
$$;

select cron.schedule(
  'cleanup-rate-limit-attempts',
  '0 0 * * *',
  $$select public.cleanup_rate_limit_attempts()$$
);
