import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = new Set([
  "name",
  "degree_country",
  "graduation_year",
  "years_experience",
  "specialties",
  "amc_cat1",
  "amc_cat2",
  "ahpra_status",
  "visa_type",
  "english_test",
  "certifications",
  "location_preference",
  "doctor_type",
  "specialist_qualification",
  "cv_text",
]);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const raw = await req.json();
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(raw)) {
      if (ALLOWED_FIELDS.has(key)) sanitized[key] = raw[key];
    }

    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...sanitized, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
