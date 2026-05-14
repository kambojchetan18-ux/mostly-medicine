import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const profile: Record<string, unknown> = {};
    const SAFE_FIELDS = [
      "full_name",
      "date_of_birth",
      "nationality",
      "medical_school",
      "graduation_year",
      "amc_cat1_status",
      "amc_cat2_status",
      "visa_status",
      "current_location",
      "preferred_locations",
      "specialties_of_interest",
      "experience_summary",
    ];
    for (const key of SAFE_FIELDS) {
      if (key in body) profile[key] = body[key];
    }
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...profile, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
