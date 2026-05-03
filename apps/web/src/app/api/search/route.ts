import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const rawQuery = req.nextUrl.searchParams.get("q")?.trim();
  if (!rawQuery || rawQuery.length < 2) {
    return NextResponse.json({ results: [] });
  }
  if (rawQuery.length > 200) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }
  const query = rawQuery.replace(/[^\w\s\-'.,:;()]/g, " ").trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("search_content", {
    search_query: query,
    searching_user_id: user?.id ?? null,
  });

  if (error) {
    console.error("[search]", error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
