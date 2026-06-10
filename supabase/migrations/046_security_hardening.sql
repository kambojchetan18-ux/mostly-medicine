-- Migration 046: Security hardening
-- Explicit deny RLS policies, admin audit log, email token expiry, rate limiter RPC

--------------------------------------------------------------------------------
-- 1. Explicit deny RLS on pwa_installs
--    Table has RLS enabled but no policies (implicit deny). Add explicit policy
--    so intent is documented — only service role can access.
--------------------------------------------------------------------------------

create policy "Service role only"
  on public.pwa_installs for all
  using (false);

--------------------------------------------------------------------------------
-- 2. Explicit deny RLS on email_unsub_tokens
--    Same situation — make the deny explicit for clarity.
--------------------------------------------------------------------------------

create policy "Service role only"
  on public.email_unsub_tokens for all
  using (false);

--------------------------------------------------------------------------------
-- 3. Admin audit log table
--    Records every admin action (user edits, role changes, etc.) for compliance.
--------------------------------------------------------------------------------

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  target_user_id uuid references auth.users(id),
  details jsonb default '{}',
  ip_address text,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

create policy "Admins can read audit log"
  on public.admin_audit_log for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Service role inserts only"
  on public.admin_audit_log for insert
  using (false);

create index idx_admin_audit_log_created_at on public.admin_audit_log(created_at desc);
create index idx_admin_audit_log_admin_user_id on public.admin_audit_log(admin_user_id);

--------------------------------------------------------------------------------
-- 4. Email unsub token expiry
--    Add expires_at so tokens auto-expire after 30 days.
--------------------------------------------------------------------------------

alter table public.email_unsub_tokens
  add column if not exists expires_at timestamptz default now() + interval '30 days';

--------------------------------------------------------------------------------
-- 5. Rate limiter atomic increment RPC
--    Replaces app-level read-then-write with a single atomic DB call.
--    Returns JSON: { allowed, count, max, locked?, retryAfterMs? }
--------------------------------------------------------------------------------

create or replace function public.increment_rate_limit(
  p_key text,
  p_window_ms bigint default 900000,
  p_max_attempts int default 5
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_row rate_limit_attempts%rowtype;
  v_now timestamptz := now();
  v_window_expired boolean;
begin
  -- Lock the row for update (or insert if missing)
  select * into v_row
  from rate_limit_attempts
  where key = p_key
  for update;

  if not found then
    insert into rate_limit_attempts (key, count, first_attempt_at, updated_at)
    values (p_key, 1, v_now, v_now);
    return jsonb_build_object('allowed', true, 'count', 1, 'max', p_max_attempts);
  end if;

  -- Check lockout
  if v_row.locked_until is not null and v_now < v_row.locked_until then
    return jsonb_build_object(
      'allowed', false,
      'retryAfterMs', extract(epoch from (v_row.locked_until - v_now)) * 1000
    );
  end if;

  -- Check window expiry
  v_window_expired := extract(epoch from (v_now - v_row.first_attempt_at)) * 1000 > p_window_ms;
  if v_window_expired or (v_row.locked_until is not null and v_now >= v_row.locked_until) then
    update rate_limit_attempts
    set count = 1, first_attempt_at = v_now, locked_until = null, updated_at = v_now
    where key = p_key;
    return jsonb_build_object('allowed', true, 'count', 1, 'max', p_max_attempts);
  end if;

  -- Increment
  if v_row.count + 1 >= p_max_attempts then
    update rate_limit_attempts
    set count = v_row.count + 1,
        locked_until = v_now + make_interval(secs => p_window_ms / 1000.0),
        updated_at = v_now
    where key = p_key;
    return jsonb_build_object('allowed', false, 'locked', true, 'count', v_row.count + 1, 'max', p_max_attempts);
  else
    update rate_limit_attempts
    set count = v_row.count + 1, updated_at = v_now
    where key = p_key;
    return jsonb_build_object('allowed', true, 'count', v_row.count + 1, 'max', p_max_attempts);
  end if;
end;
$$;
