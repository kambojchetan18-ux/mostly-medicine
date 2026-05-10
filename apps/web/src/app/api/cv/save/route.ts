import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const raw = await req.json();
    const ALLOWED_FIELDS = [
      "name", "degree_country", "graduation_year", "years_experience",
      "specialties", "amc_cat1", "amc_cat2", "ahpra_status", "visa_type",
      "english_test", "certifications", "location_preference", "doctor_type",
      "specialist_qualification", "cv_text",
    ];
    const profile = Object.fromEntries(
      Object.entries(raw).filter(([k]) => ALLOWED_FIELDS.includes(k))
    );
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
