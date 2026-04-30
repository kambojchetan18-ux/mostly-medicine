import { createBrowserClient } from "@supabase/ssr";

// Defensive trim — Vercel env-var copy/paste sometimes pastes a trailing
// '\n' into NEXT_PUBLIC_SUPABASE_URL (we hit this twice already, the
// symptom each time was wss://...supabase.co\n/realtime → WebSocket failed
// → Realtime channel dead → Live Peer RolePlay ICE stuck at 'idle' →
// black partner video. Strip whitespace so the app stays immune even if
// the env-var corruption recurs.
const SUPA_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const SUPA_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export function createClient() {
  return createBrowserClient(SUPA_URL, SUPA_KEY);
}
