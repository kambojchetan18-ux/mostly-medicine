import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await req.json();

    const allowedFields = [
      "full_name", "email", "phone", "nationality", "current_country",
      "medical_school", "graduation_year", "primary_degree", "postgraduate_qualifications",
      "registration_status", "ahpra_number", "amc_mcq_status", "amc_clinical_status",
      "work_experience", "skills", "languages", "visa_status", "preferred_locations",
      "summary", "references",
    ];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in profile) sanitized[key] = profile[key];
    }

    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...sanitized, id: user.id, updated_at: new Date().toISOString() });

    if (error) {
      console.error("[cv/save]", error.message);
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cv/save]", err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
