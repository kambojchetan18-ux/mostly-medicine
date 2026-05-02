import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";

// Cloudflare Realtime TURN credential broker.
//
// Why this exists: a static TURN credential in NEXT_PUBLIC_TURN_* leaks the
// password to every visitor of the site (build-time inlined). Cloudflare's
// REST API issues short-lived per-session credentials, so we keep the master
// API token server-side and hand out 24-hour throwaway creds to verified
// users only.
//
// Env vars (Vercel → Settings → Environment Variables):
//   CLOUDFLARE_TURN_KEY_ID      — from dash.cloudflare.com → Realtime → TURN
//   CLOUDFLARE_TURN_API_TOKEN   — Bearer token for that TURN key
//
// Failure mode: if env is missing OR Cloudflare upstream errors, return 503
// — LiveSessionClient falls back to the public Open Relay TURN automatically.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TTL_SECONDS = 24 * 60 * 60;

interface CloudflareIceServers {
  iceServers: {
    urls: string[] | string;
    username?: string;
    credential?: string;
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only paying / authorized users may consume our TURN bandwidth — the
  // module gate already protects /dashboard/ai-roleplay/live but a direct
  // hit on this endpoint by a free user would still let them grab creds.
  const perm = await checkModulePermission(supabase, "acrp_live");
  if (!perm.allowed) {
    return NextResponse.json({ error: "Plan does not include peer roleplay" }, { status: 403 });
  }

  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID;
  const apiToken = process.env.CLOUDFLARE_TURN_API_TOKEN;
  if (!keyId || !apiToken) {
    return NextResponse.json(
      {
        error: "TURN not configured",
        missing: {
          CLOUDFLARE_TURN_KEY_ID: !keyId,
          CLOUDFLARE_TURN_API_TOKEN: !apiToken,
        },
      },
      { status: 503 }
    );
  }

  // Cloudflare's actual endpoint is `generate-ice-servers`, not just
  // `generate` — the older docs called it generate but the live API
  // requires the longer name. Wrong endpoint returns 404 not 200.
  const url = `https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: TTL_SECONDS }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[turn-credentials] cloudflare upstream error", res.status, body);
      // Surface the actual upstream message so the diagnostic pill can show
      // a meaningful hint instead of an opaque 502.
      return NextResponse.json(
        { error: `Cloudflare ${res.status}: ${body.slice(0, 160)}` },
        { status: 502 }
      );
    }
    const payload = (await res.json()) as CloudflareIceServers;
    return NextResponse.json(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    console.error("[turn-credentials] fetch error", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
