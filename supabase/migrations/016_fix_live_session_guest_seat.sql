-- Allow a logged-in user to claim an empty guest seat on an acrp_live_sessions
-- row. The original "Participants update their session" policy required the
-- user to already BE the host or guest, which made it impossible for a new
-- guest to claim a null seat.

drop policy if exists "Guest can claim empty seat" on public.acrp_live_sessions;
create policy "Guest can claim empty seat"
  on public.acrp_live_sessions for update
  using (
    guest_user_id is null
    and auth.uid() is not null
    and auth.uid() != host_user_id
  )
  with check (
    auth.uid() = guest_user_id
  );
