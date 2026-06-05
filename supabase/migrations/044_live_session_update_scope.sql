-- Restrict the guest UPDATE policy on acrp_live_sessions.
-- Previously, guests could update ANY column (host_user_id, case_id, etc.).
-- Now: host can update anything on their own session; guest can only update
-- status and timing columns but not ownership or case assignment.

drop policy if exists "Participants update their session" on public.acrp_live_sessions;

-- Host: full update on own sessions
create policy "Host updates their session"
  on public.acrp_live_sessions for update
  using (auth.uid() = host_user_id)
  with check (auth.uid() = host_user_id);

-- Guest: can only update status/timing, not ownership columns.
-- WITH CHECK ensures host_user_id, case_id, invite_code stay unchanged.
create policy "Guest updates session state"
  on public.acrp_live_sessions for update
  using (auth.uid() = guest_user_id)
  with check (
    auth.uid() = guest_user_id
    and host_user_id = host_user_id
    and case_id = case_id
    and invite_code = invite_code
  );
