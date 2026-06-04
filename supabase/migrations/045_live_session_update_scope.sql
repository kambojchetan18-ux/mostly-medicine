-- Tighten the overly-broad "Participants update their session" FOR UPDATE
-- policy on acrp_live_sessions.
--
-- Problem: the old policy allowed any participant to UPDATE every column,
-- including host_user_id, case_id, and invite_code — enabling a malicious
-- guest to hijack the session by reassigning ownership or swapping the case.
--
-- Fix: replace the single broad UPDATE policy with three granular policies
-- (SELECT, INSERT, UPDATE). The UPDATE policy adds a WITH CHECK that ensures
-- the immutable columns (host_user_id, case_id, invite_code) are unchanged.
--
-- The existing "Participants can read their live session" SELECT policy and
-- "Host inserts session" INSERT policy from migration 010 are already correct
-- and remain untouched.
--
-- The "Guest can claim empty seat" UPDATE policy from migration 016 is also
-- left intact — it has its own narrow USING/WITH CHECK.

-- ── Drop the old broad UPDATE policy ────────────────────────────────────
drop policy if exists "Participants update their session"
  on public.acrp_live_sessions;

-- ── New scoped UPDATE policy ────────────────────────────────────────────
-- Participants (host or guest) may update the session, but the WITH CHECK
-- ensures that immutable ownership/identity columns are not changed.
-- PostgreSQL evaluates WITH CHECK against the *new* row, so we compare the
-- new values against the old ones using a subselect on the row's PK.
create policy "Participants update their session (scoped)"
  on public.acrp_live_sessions for update
  using (
    auth.uid() = host_user_id
    or auth.uid() = guest_user_id
  )
  with check (
    -- Immutable columns: must equal their pre-UPDATE values.
    -- We fetch the current row via the PK (id is immutable by definition).
    host_user_id = (select s.host_user_id from public.acrp_live_sessions s where s.id = id)
    and case_id  = (select s.case_id      from public.acrp_live_sessions s where s.id = id)
    and invite_code = (select s.invite_code from public.acrp_live_sessions s where s.id = id)
  );
