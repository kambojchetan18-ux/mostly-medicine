import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Whitelist allowed img_profiles columns to prevent mass assignment.
    const ALLOWED_FIELDS = [
      "name",
      "email",
      "phone",
      "degree_country",
      "graduation_year",
      "medical_school",
      "amc_mcq_status",
      "amc_clinical_status",
      "ahpra_status",
      "visa_type",
      "visa_expiry",
      "preferred_state",
      "preferred_specialty",
      "summary",
      "experience",
      "education",
      "skills",
      "publications",
      "references",
      "specialties",
      "certifications",
      "location_preference",
      "years_experience",
      "english_test",
      "doctor_type",
      "specialist_qualification",
      "amc_cat1",
      "amc_cat2",
      "cv_text",
      "full_name",
    ] as const;

    const profile: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        profile[key] = body[key];
      }
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
