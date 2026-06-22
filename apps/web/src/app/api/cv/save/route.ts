import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ALLOWED_FIELDS = [
    "full_name", "email", "phone", "nationality", "current_country",
    "medical_degree", "graduation_year", "university", "specialization",
    "amc_cat1_status", "amc_cat2_status", "english_test", "english_score",
    "visa_status", "work_experience_years", "clinical_experience",
    "research_publications", "professional_memberships", "skills",
    "references", "additional_info",
  ] as const;

  try {
    const raw = await req.json();
    const profile: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in raw) profile[key] = raw[key];
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
