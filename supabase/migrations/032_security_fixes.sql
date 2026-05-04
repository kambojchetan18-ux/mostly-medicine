-- Fix SQL injection in search_content() — ILIKE with unescaped user input
-- The original ILIKE patterns concatenated search_query directly, allowing
-- pattern metacharacters (%, _) and potential injection.
-- Fix: escape LIKE metacharacters before concatenation.

create or replace function public.search_content(
  search_query text,
  searching_user_id uuid default null
)
returns table (
  id uuid,
  title text,
  type text,
  snippet text,
  url text,
  system_tag text,
  difficulty text
) as $$
declare
  safe_query text;
begin
  -- Escape LIKE/ILIKE metacharacters so user input is treated literally
  safe_query := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');

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
        un.filename ilike '%' || safe_query || '%' or
        un.ai_summary ilike '%' || safe_query || '%' or
        un.extracted_text ilike '%' || safe_query || '%'
      )

  limit 25;
end;
$$ language plpgsql security definer
   set search_path = public;
