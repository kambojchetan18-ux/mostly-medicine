-- Migration 042: Create missing is_user_admin() function + fix search_content() IDOR
--
-- is_user_admin() is referenced by RLS policies in migrations 040 and 041
-- but was never defined, which breaks admin operations on fresh deploys.
--
-- search_content() is SECURITY DEFINER and accepts an arbitrary user ID
-- without verifying it matches auth.uid(), allowing cross-user note search.

-- 1) Create is_user_admin() function
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_user_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_user_admin() TO authenticated;

-- 2) Fix search_content() to enforce auth.uid() check on searching_user_id
CREATE OR REPLACE FUNCTION public.search_content(
  search_query text,
  searching_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  source text,
  id text,
  title text,
  snippet text,
  relevance real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Prevent cross-user note search: the searching_user_id must be the caller
  IF searching_user_id IS NOT NULL AND searching_user_id != auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot search another user''s notes';
  END IF;

  RETURN QUERY
  -- Library topics (public content)
  SELECT
    'topic'::text AS source,
    lt.id::text,
    lt.title,
    LEFT(lt.summary, 200) AS snippet,
    ts_rank(
      to_tsvector('english', COALESCE(lt.title, '') || ' ' || COALESCE(lt.summary, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance
  FROM library_topics lt
  WHERE to_tsvector('english', COALESCE(lt.title, '') || ' ' || COALESCE(lt.summary, ''))
        @@ plainto_tsquery('english', search_query)

  UNION ALL

  -- User notes (private, only the caller's)
  SELECT
    'note'::text AS source,
    un.id::text,
    un.filename AS title,
    LEFT(COALESCE(un.ai_summary, un.extracted_text, ''), 200) AS snippet,
    ts_rank(
      to_tsvector('english', COALESCE(un.filename, '') || ' ' || COALESCE(un.ai_summary, '') || ' ' || COALESCE(un.extracted_text, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance
  FROM user_notes un
  WHERE un.user_id = searching_user_id
    AND to_tsvector('english', COALESCE(un.filename, '') || ' ' || COALESCE(un.ai_summary, '') || ' ' || COALESCE(un.extracted_text, ''))
        @@ plainto_tsquery('english', search_query)

  ORDER BY relevance DESC
  LIMIT 20;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.search_content(text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.search_content(text, uuid) TO authenticated;
