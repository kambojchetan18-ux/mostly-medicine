import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ALLOWED_FIELDS = new Set([
    "full_name", "email", "phone", "date_of_birth", "nationality",
    "country_of_training", "medical_school", "graduation_year",
    "primary_degree", "postgrad_qualifications", "registration_status",
    "ahpra_number", "specialty_interest", "english_test", "english_score",
    "visa_status",
  ]);

  try {
    const raw = await req.json();
    const profile: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (ALLOWED_FIELDS.has(key)) profile[key] = value;
    }
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...profile, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
