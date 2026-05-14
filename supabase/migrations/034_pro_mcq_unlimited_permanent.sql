-- Pro and Enterprise users get unlimited MCQ attempts per day.
--
-- Re-asserts the original 012_align_module_permissions.sql intent after a
-- production incident where pro/mcq.daily_limit had been flipped to 200
-- (likely via the admin UI), capping paying users at 200 MCQ attempts per
-- UTC day with a 429 + upgrade modal. This migration nails the state so
-- future restores / db pushes can't silently re-introduce the cap.

update public.module_permissions
   set daily_limit = null,
       enabled     = true,
       updated_at  = now()
 where module = 'mcq'
   and plan in ('pro', 'enterprise');

-- Defensive insert — in case the rows were ever deleted by hand.
insert into public.module_permissions (plan, module, enabled, daily_limit)
select v.plan, 'mcq', true, null
  from (values ('pro'), ('enterprise')) as v(plan)
 where not exists (
   select 1
     from public.module_permissions m
    where m.plan = v.plan and m.module = 'mcq'
 );
