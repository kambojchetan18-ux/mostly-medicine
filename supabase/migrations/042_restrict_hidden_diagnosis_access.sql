-- Restrict access to hidden diagnoses in acrp_cases and acrp_blueprints.
-- Previously, any authenticated user could read hidden_diagnosis directly
-- via the Supabase client, defeating the clinical reasoning exercise.

-- Drop the overly permissive policies
drop policy if exists "Cases readable by authenticated users" on public.acrp_cases;
drop policy if exists "Blueprints readable by authenticated users" on public.acrp_blueprints;

-- Revoke direct SELECT on sensitive columns from authenticated role.
-- This ensures even if a new permissive policy is added, these columns
-- are not readable by the authenticated role.
revoke select (hidden_diagnosis) on public.acrp_cases from authenticated;
revoke select (hidden_diagnoses, distractor_diagnoses) on public.acrp_blueprints from authenticated;

-- Re-create policies that allow reading non-sensitive columns only.
-- Authenticated users can still browse cases/blueprints for the UI,
-- but cannot read the hidden diagnosis fields.
create policy "Cases readable by authenticated (non-sensitive)"
  on public.acrp_cases for select
  using (auth.uid() is not null);

create policy "Blueprints readable by authenticated (non-sensitive)"
  on public.acrp_blueprints for select
  using (auth.uid() is not null);

-- Grant SELECT back on all non-sensitive columns for acrp_cases
grant select (
  id, blueprint_id, seed, difficulty, station_stem, patient_profile,
  clue_pool, red_flags, candidate_task, setting, emotional_tone, created_at
) on public.acrp_cases to authenticated;

-- Grant SELECT back on all non-sensitive columns for acrp_blueprints
grant select (
  id, slug, family_name, category, difficulty, presentation_cluster,
  red_flags, candidate_tasks, setting_options, age_bands, source_ids,
  blueprint, created_at
) on public.acrp_blueprints to authenticated;
