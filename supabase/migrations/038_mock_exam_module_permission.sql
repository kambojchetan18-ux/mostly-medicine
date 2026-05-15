-- Add 'mock_exam' as a controllable module so admins can toggle the Mock
-- Exam button visibility per plan from /dashboard/admin without a code
-- deploy. Defaults reflect current product: every plan can take Mock by
-- default; daily_limit is null because the per-paper question count is
-- hard-coded in the client (Free = 20 sample, Pro/Ent = 150).

insert into public.module_permissions (plan, module, enabled, daily_limit)
select v.plan, 'mock_exam', true, null
  from (values ('free'), ('pro'), ('enterprise')) as v(plan)
 where not exists (
   select 1
     from public.module_permissions m
    where m.plan = v.plan and m.module = 'mock_exam'
 );
