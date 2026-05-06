import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }
  // Cap query length so the RPC can't be DoSed with a 1MB string.
  if (query.length > 200) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("search_content", {
    search_query: query,
    searching_user_id: user.id,
  });

  if (error) {
    console.error("[search] rpc error", error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
