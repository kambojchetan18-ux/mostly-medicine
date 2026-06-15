import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";

export async function GET(req: NextRequest) {
  const requestId = getRequestId();

  // Per-IP rolling-window throttle — 30 requests / 60s.
  const rl = await aiRateLimit(clientKey(req, "search"), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.retryAfterMs ?? 60_000) / 1000);
    console.warn(`[search] rid=${requestId} rate limit hit`);
    return NextResponse.json(
      { error: "Too many search requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-Request-Id": requestId } }
    );
  }

  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { "X-Request-Id": requestId } });
  }
  // Cap query length so the RPC can't be DoSed with a 1MB string.
  if (query.length > 200) {
    return NextResponse.json({ error: "Query too long" }, { status: 400, headers: { "X-Request-Id": requestId } });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("search_content", {
    search_query: query,
    searching_user_id: user?.id ?? null,
  });

  if (error) {
    console.error(`[search] rid=${requestId} rpc error`, error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500, headers: { "X-Request-Id": requestId } });
  }

  return NextResponse.json({ results: data ?? [] }, { headers: { "X-Request-Id": requestId } });
}
