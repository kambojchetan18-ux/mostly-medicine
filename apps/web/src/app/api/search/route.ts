import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }
  if (query.length > 200) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }
  // Strip characters that have special meaning in PostgreSQL full-text search
  // syntax. The RPC uses parameterised queries so this isn't SQL injection,
  // but malformed tsquery operators (&, |, !, <->) would cause a Postgres
  // syntax error inside to_tsquery(). Allow only word chars, spaces, hyphens.
  const sanitised = query.replace(/[^\w\s\-]/g, " ").replace(/\s+/g, " ").trim();
  if (!sanitised) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("search_content", {
    search_query: sanitised,
    searching_user_id: user?.id ?? null,
  });

  if (error) {
    console.error("[search] rpc failed", error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
