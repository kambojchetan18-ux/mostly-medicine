-- Security fixes from 2026-05-29 code review:
--   1. search_content() — pin search_path to prevent schema-shadow attacks
--      (same pattern as migration 022/037 for other SECURITY DEFINER functions).
--   2. search_content() — escape ILIKE wildcards in user-supplied search_query
--      so a crafted query like '%' can't bypass the intended prefix matching.
--   3. Add missing indexes on FK columns used in RLS policies to prevent
--      slow policy enforcement at scale.

-- 1+2. Recreate search_content() with search_path pin + ILIKE escape
create or replace function search_content(search_query text, searching_user_id uuid default null)
returns table(
  id uuid,
  title text,
  type text,
  snippet text,
  url text,
  system_tag text,
  difficulty text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  safe_query text := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');
begin
  return query
    select
      lt.id,
      lt.title,
      'library'::text as type,
      lt.summary as snippet,
      ('/dashboard/library/' || lt.id::text) as url,
      lt.system as system_tag,
      lt.difficulty
    from library_topics lt
    where lt.search_vector @@ plainto_tsquery('english', search_query)

    union all

    select
      c.id,
      c.title,
      'case'::text as type,
      c.category as snippet,
      ('/dashboard/cases/' || c.id::text) as url,
      c.category as system_tag,
      c.difficulty
    from cases c
    where c.search_vector @@ plainto_tsquery('english', search_query)

    union all

    select
      un.id,
      un.filename as title,
      'note'::text as type,
      coalesce(un.ai_summary, 'Personal note') as snippet,
      ('/dashboard/library/notes/' || un.id::text) as url,
      'My Notes'::text as system_tag,
      null::text as difficulty
    from user_notes un
    where
      searching_user_id is not null and
      un.user_id = searching_user_id and
      (
        un.filename ilike '%' || safe_query || '%' escape '\' or
        un.ai_summary ilike '%' || safe_query || '%' escape '\' or
        un.extracted_text ilike '%' || safe_query || '%' escape '\'
      )

  limit 25;
end;
$$;

-- 3. Missing indexes on FK columns used in RLS policy filters
create index if not exists idx_mcq_sessions_user_id on public.mcq_sessions (user_id);
create index if not exists idx_cat2_sessions_user_id on public.cat2_sessions (user_id);
