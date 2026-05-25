import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ALLOWED_FIELDS = new Set([
    "full_name", "degree_country", "degree_name", "graduation_year",
    "amc_mcq_status", "amc_clinical_status", "english_test", "english_score",
    "visa_status", "visa_subclass", "ahpra_status", "ahpra_pathway",
    "speciality_interest", "state_preference", "work_experience_years",
    "bio", "phone", "linkedin_url", "cv_url",
  ]);

  try {
    const raw = await req.json();
    const filtered: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (ALLOWED_FIELDS.has(k)) filtered[k] = v;
    }
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...filtered, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
