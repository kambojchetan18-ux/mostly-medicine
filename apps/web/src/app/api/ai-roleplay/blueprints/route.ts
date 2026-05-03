import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  let query = supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, candidate_tasks")
    .order("category")
    .order("family_name");

  if (category) query = query.eq("category", category);
  if (difficulty) query = query.eq("difficulty", difficulty);

  const { data, error } = await query;
  if (error) {
    console.error("[blueprints]", error.message);
    return NextResponse.json({ error: "Failed to load blueprints" }, { status: 500 });
  }

  return NextResponse.json({ blueprints: data ?? [] });
}
