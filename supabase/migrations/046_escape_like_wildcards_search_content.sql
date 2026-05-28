-- Escape LIKE wildcards in search_content to prevent pattern injection.
-- The original function (002) used raw search_query inside ILIKE patterns,
-- allowing callers to inject % or _ wildcards. This re-creates the function
-- with the same logic but sanitises the input before ILIKE matching.

create or replace function public.search_content(
  search_query text,
  searching_user_id uuid default null
)
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
  safe_query text;
begin
  -- Escape backslash first, then the two LIKE meta-characters.
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
$$;
