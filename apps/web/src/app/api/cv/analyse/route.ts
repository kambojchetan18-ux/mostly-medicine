import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

let _client: Anthropic | null = null;
function client() {
  if (!_client) _client = new Anthropic();
  return _client;
}

const SYSTEM = `You are an expert at parsing International Medical Graduate (IMG) CVs for Australian medical registration purposes.

Extract the following fields and return ONLY valid JSON — no explanation, no markdown:

{
  "name": string | null,
  "degree_country": string | null,
  "graduation_year": number | null,
  "years_experience": number | null,
  "specialties": string[],
  "amc_cat1": "passed" | "scheduled" | "not_done",
  "amc_cat2": "passed" | "scheduled" | "not_done",
  "ahpra_status": "registered" | "pending" | "not_started",
  "visa_type": "482" | "485" | "189" | "190" | "491" | "pr" | "citizen" | "other" | "unknown",
  "english_test": "oet" | "ielts" | "exempt" | "not_done",
  "certifications": string[],
  "location_preference": string[],
  "doctor_type": "rmo" | "gp" | "specialist" | "non_doctor" | null,
  "specialist_qualification": string | null
}

Rules:
- Only extract information explicitly stated in the CV text
- amc_cat1/cat2: "passed" only if clearly stated as passed/cleared/completed; "scheduled" if exam date mentioned
- ahpra_status: "registered" if AHPRA number present or registration explicitly confirmed
- visa_type: use the subclass number (e.g. "482") if stated; "pr" for permanent resident; "citizen" for Australian citizen
- english_test: "oet" if OET result mentioned; "ielts" if IELTS academic result mentioned; "exempt" if country of origin exempts them (UK, Ireland, USA, Canada, NZ, South Africa); "not_done" otherwise
- specialties: clinical departments/rotations/disciplines worked in (e.g. "Emergency Medicine", "General Surgery")
- certifications: only include verifiable cert abbreviations like ALS, PALS, ATLS, BLS, ACLS
- location_preference: Australian states/territories explicitly mentioned as preferred (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
- doctor_type: classify the person as:
  * "non_doctor" — no MBBS, MD, BDS, or equivalent medical/dental degree found; could be a nurse, allied health, admin, or non-medical person
  * "specialist" — has a specialist postgraduate qualification beyond MBBS (e.g. FRCS, FRCP, DM, DNB specialist, MCh, MS, MD specialty, MRCP, MRCS, Fellowship of a college)
  * "rmo" — MBBS/MD general with <5 years experience or explicitly seeking hospital RMO/internship roles
  * "gp" — MBBS/MD seeking GP/primary care practice, or has GP training/FRACGP/FACRRM
  * null — cannot determine
- specialist_qualification: the specific specialist degree/fellowship if doctor_type is "specialist" (e.g. "FRCS Orthopaedics", "MD Cardiology", "DNB Psychiatry")
- Return null for fields that cannot be determined`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    let cvText = formData.get("text") as string | null;

    const file = formData.get("file") as File | null;
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    let response;

    if (file && !cvText && file.type === "application/pdf") {
      // Send PDF directly to Claude — avoids pdfjs-dist browser-global issues entirely
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response = await (client().messages.create as any)({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
            { type: "text", text: "Extract the IMG profile fields from this CV document." },
          ],
        }],
      });
    } else {
      // Text paste or non-PDF file
      if (file && !cvText) cvText = await file.text();
      if (!cvText?.trim()) {
        return NextResponse.json({ error: "No CV content provided" }, { status: 400 });
      }
      const text: string = cvText;
      response = await client().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{ role: "user", content: `CV TEXT:\n\n${text.slice(0, 8000)}` }],
      });
    }

    const raw = response.content[0];
    if (!raw || raw.type !== "text") throw new Error("Unexpected AI response");

    // Strip any accidental markdown fences
    const jsonStr = raw.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const raw_extracted = JSON.parse(jsonStr);
    const ALLOWED_FIELDS = [
      "name", "degree_country", "graduation_year", "years_experience",
      "specialties", "amc_cat1", "amc_cat2", "ahpra_status", "visa_type",
      "english_test", "certifications", "location_preference", "doctor_type",
      "specialist_qualification",
    ] as const;
    const extracted: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in raw_extracted) extracted[key] = raw_extracted[key];
    }

    const { error: dbError } = await supabase
      .from("img_profiles")
      .upsert({
        id: user.id,
        ...extracted,
        cv_text: cvText ? cvText.slice(0, 20000) : null,
        updated_at: new Date().toISOString(),
      });

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ profile: extracted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[cv/analyse]", message);
    return NextResponse.json({ error: "Failed to analyse CV. Please try again." }, { status: 500 });
  }
}
