import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const allowed = [
      "full_name", "email", "phone", "date_of_birth", "nationality",
      "country_of_primary_degree", "university", "graduation_year",
      "amc_mcq_status", "amc_clinical_status", "ahpra_status",
      "visa_status", "visa_subclass", "english_test_type", "english_test_score",
      "specialty_interest", "work_experience_years", "australian_experience",
      "current_location", "preferred_location", "bio", "linkedin_url",
    ] as const;
    const profile: Record<string, unknown> = {};
    for (const key of allowed) {
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
