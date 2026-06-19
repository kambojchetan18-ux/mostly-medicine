import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const ALLOWED_FIELDS = [
      "full_name", "preferred_name", "phone", "date_of_birth",
      "nationality", "country_of_primary_degree", "primary_degree",
      "year_of_graduation", "registration_status", "ahpra_number",
      "current_visa", "visa_expiry", "australian_state",
      "preferred_specialties", "work_experience_years",
      "english_test_type", "english_test_score",
      "amc_cat1_status", "amc_cat2_status",
      "bio", "linkedin_url", "cv_text",
      "smoking_status", "alcohol_status",
    ];
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) sanitized[key] = body[key];
    }
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...sanitized, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
