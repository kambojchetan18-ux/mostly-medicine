import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const allowed = {
      name: body.name,
      degree_country: body.degree_country,
      graduation_year: body.graduation_year,
      years_experience: body.years_experience,
      specialties: body.specialties,
      amc_cat1: body.amc_cat1,
      amc_cat2: body.amc_cat2,
      ahpra_status: body.ahpra_status,
      visa_type: body.visa_type,
      english_test: body.english_test,
      certifications: body.certifications,
      location_preference: body.location_preference,
      doctor_type: body.doctor_type,
      specialist_qualification: body.specialist_qualification,
    };
    // Remove undefined values so we don't overwrite existing data with null
    const profile = Object.fromEntries(
      Object.entries(allowed).filter(([, v]) => v !== undefined)
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
