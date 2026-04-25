-- 013: Security hardening — RLS role escalation fix + missing indexes

-- ═══════════════════════════════════════════════════════════════════
-- FIX: Prevent users from escalating their own role or plan via RLS
-- The old "Users can update their own profile" policy allowed users
-- to SET role='admin' or plan='enterprise' on their own row.
-- Replace it with a column-restricted policy.
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update their own profile (safe columns only)"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    -- role and plan must remain unchanged (prevent self-escalation)
    role = (select role from public.user_profiles where id = auth.uid())
    and plan = (select plan from public.user_profiles where id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════════
-- PERFORMANCE: Add missing indexes on foreign key columns
-- ═══════════════════════════════════════════════════════════════════

-- rate_limit_attempts: key lookups
create index if not exists idx_rate_limit_attempts_key
  on public.rate_limit_attempts (key);

-- billing_events: user lookups and time-range queries
create index if not exists idx_billing_events_user_id
  on public.billing_events (user_id);
create index if not exists idx_billing_events_received_at
  on public.billing_events (received_at);

-- acrp_sessions: user lookups
create index if not exists idx_acrp_sessions_user_id
  on public.acrp_sessions (user_id);

-- acrp_messages: session lookups (ordered by created_at for transcript)
create index if not exists idx_acrp_messages_session_id_created_at
  on public.acrp_messages (session_id, created_at);

-- acrp_cases: blueprint + difficulty lookups for cache reuse
create index if not exists idx_acrp_cases_blueprint_difficulty
  on public.acrp_cases (blueprint_id, difficulty);
