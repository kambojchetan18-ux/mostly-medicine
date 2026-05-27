import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = [
  "full_name",
  "date_of_birth",
  "nationality",
  "phone",
  "address",
  "degree_name",
  "degree_country",
  "university",
  "graduation_year",
  "medical_council_registration",
  "amc_mcq_status",
  "amc_clinical_status",
  "oet_score",
  "ielts_score",
  "plab_status",
  "visa_status",
  "visa_subclass",
  "specialty_interest",
  "work_experience_years",
  "australian_experience",
  "rural_willingness",
  "notes",
];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const filtered = Object.fromEntries(
      Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k))
    );
    const { error } = await supabase
      .from("img_profiles")
      .upsert({ ...filtered, id: user.id, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
