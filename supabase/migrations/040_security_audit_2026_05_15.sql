-- Security hardening from 2026-05-15 code review:
--
-- 1. billing_events — add explicit deny-all policy for non-service-role access.
--    RLS is enabled but no policies existed, relying on implicit deny. Adding
--    an explicit policy documents the intent and prevents accidental grants.
--
-- 2. social_posts — same treatment (service-role only by design).
--
-- 3. pwa_installs — same treatment (service-role only by design).
--
-- 4. email_unsub_tokens — same treatment (service-role only by design).
--
-- 5. search_content() — escape LIKE metacharacters (%, _) in user input to
--    prevent wildcard abuse in the ilike fallback path.

-- 1. billing_events: explicit deny for authenticated/anon
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'billing_events' and policyname = 'service_role_only'
  ) then
    create policy "service_role_only" on public.billing_events
      for all using (false);
  end if;
end $$;

-- 2. social_posts: explicit deny for authenticated/anon
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'social_posts' and policyname = 'service_role_only'
  ) then
    create policy "service_role_only" on public.social_posts
      for all using (false);
  end if;
end $$;

-- 3. pwa_installs: explicit deny for authenticated/anon
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'pwa_installs' and policyname = 'service_role_only'
  ) then
    create policy "service_role_only" on public.pwa_installs
      for all using (false);
  end if;
end $$;

-- 4. email_unsub_tokens: explicit deny for authenticated/anon
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'email_unsub_tokens' and policyname = 'service_role_only'
  ) then
    create policy "service_role_only" on public.email_unsub_tokens
      for all using (false);
  end if;
end $$;

-- 5. search_content() — escape LIKE metacharacters in user input
create or replace function search_content(search_query text, searching_user_id uuid default null)
returns table(
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
  -- Escape LIKE metacharacters so user input like '%' or '_' is treated literally.
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
   set search_path = public, pg_temp;
