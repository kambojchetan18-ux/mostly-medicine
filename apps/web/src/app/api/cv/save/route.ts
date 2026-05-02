import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = [
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
] as const;

function pickAllowed(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await req.json();
    const safe = pickAllowed(profile);
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...safe, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cv/save]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
