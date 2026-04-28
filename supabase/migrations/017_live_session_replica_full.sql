-- Ensure REPLICA IDENTITY FULL so realtime UPDATE events broadcast the
-- complete new row to subscribers (including guest_user_id changes from
-- service-role updates). Without this the "Partner joined" host UI flip
-- sometimes failed to fire.
alter table public.acrp_live_sessions replica identity full;
alter table public.acrp_live_messages replica identity full;
