-- Free-tier conversion caps (activate when NEXT_PUBLIC_PAID_TIERS_ENABLED=true).
--
-- Tightens free-plan daily limits post-beta to drive Pro conversion:
--   mcq:       20/day  → 5/day   (was loose; matches OSCELab/rehearseMD funnel)
--   acrp_solo: disabled → 1/day  (gives a taste of voice OSCE so the upgrade
--                                  pitch lands with proof-of-value)
--
-- These rows are read by lib/permissions.ts checkModulePermission(). While
-- features.betaMode === true, BETA_DAILY_LIMITS in config/features.ts wins —
-- this migration only takes effect after the betaMode kill-switch flips.
--
-- Admins can still tune these via /dashboard/admin → module_permissions.
-- The 5 / 1 values here are the conversion-funnel defaults — restore from
-- this migration if admin edits ever drift.

-- mcq: tighten the existing row if present.
update public.module_permissions
   set enabled = true, daily_limit = 5, updated_at = now()
 where plan = 'free' and module = 'mcq';

-- mcq: insert if missing (idempotent on re-run).
insert into public.module_permissions (plan, module, enabled, daily_limit)
select 'free', 'mcq', true, 5
 where not exists (
   select 1 from public.module_permissions
    where plan = 'free' and module = 'mcq'
 );

-- acrp_solo: flip on + cap at 1/day for existing row.
update public.module_permissions
   set enabled = true, daily_limit = 1, updated_at = now()
 where plan = 'free' and module = 'acrp_solo';

-- acrp_solo: insert if missing.
insert into public.module_permissions (plan, module, enabled, daily_limit)
select 'free', 'acrp_solo', true, 1
 where not exists (
   select 1 from public.module_permissions
    where plan = 'free' and module = 'acrp_solo'
 );
