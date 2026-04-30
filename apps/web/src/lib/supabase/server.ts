import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Strip whitespace defensively — see comment in supabase/client.ts. Trailing
// '\n' on NEXT_PUBLIC_SUPABASE_URL has bricked Live Peer RolePlay's
// realtime channel twice. Trim at module load.
const SUPA_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const SUPA_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    SUPA_URL,
    SUPA_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Record<string, unknown>)
            );
          } catch {
            // Called from a Server Component — safe to ignore
          }
        },
      },
    }
  );
}
