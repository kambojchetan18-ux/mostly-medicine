-- 042: Define is_user_admin() function + fix award_xp() negative-points gap
--
-- is_user_admin() is referenced by RLS policies in migrations 040 and 041
-- but was never formally defined in a migration. Without it, those policies
-- fail at evaluation time.
--
-- award_xp() accepted negative points, allowing XP manipulation.

-- 1. Create the is_user_admin() helper
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_user_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_user_admin() TO authenticated, service_role;

-- 2. Fix award_xp() to reject non-positive points
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id uuid,
  p_source text,
  p_points integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_recent boolean;
BEGIN
  IF p_points IS NULL OR p_points <= 0 THEN RETURN; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.xp_ledger
    WHERE user_id = p_user_id
      AND source = p_source
      AND created_at > now() - interval '60 seconds'
  ) INTO v_recent;

  IF v_recent THEN RETURN; END IF;

  INSERT INTO public.xp_ledger (user_id, source, points)
  VALUES (p_user_id, p_source, p_points);

  INSERT INTO public.user_profiles (id, xp_total)
  VALUES (p_user_id, p_points)
  ON CONFLICT (id) DO UPDATE
  SET xp_total = COALESCE(user_profiles.xp_total, 0) + p_points,
      updated_at = now();
END;
$$;

-- 3. Fix search_content() to validate searching_user_id matches caller
CREATE OR REPLACE FUNCTION public.search_content(
  search_query text,
  searching_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  type text,
  id text,
  title text,
  snippet text,
  url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  safe_query text;
BEGIN
  -- Enforce caller can only search their own notes
  IF searching_user_id IS NOT NULL AND searching_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- Escape LIKE wildcards in the search query
  safe_query := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');

  RETURN QUERY
  -- Library topics
  SELECT 'topic'::text AS type,
         lt.id::text,
         lt.title,
         left(lt.content, 160) AS snippet,
         '/dashboard/library/' || lt.id AS url
  FROM public.library_topics lt
  WHERE lt.title ILIKE '%' || safe_query || '%'
     OR lt.content ILIKE '%' || safe_query || '%'
  LIMIT 10;

  IF searching_user_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 'note'::text AS type,
           un.id::text,
           un.filename AS title,
           left(COALESCE(un.ai_summary, un.extracted_text, ''), 160) AS snippet,
           '/dashboard/library/notes/' || un.id AS url
    FROM public.user_notes un
    WHERE un.user_id = searching_user_id
      AND (un.filename ILIKE '%' || safe_query || '%'
           OR un.ai_summary ILIKE '%' || safe_query || '%'
           OR un.extracted_text ILIKE '%' || safe_query || '%')
    LIMIT 10;
  END IF;

  RETURN;
END;
$$;
