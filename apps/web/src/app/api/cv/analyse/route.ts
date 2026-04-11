import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic();

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
  "location_preference": string[]
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
- Return null for fields that cannot be determined`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    let cvText = formData.get("text") as string | null;

    // Handle PDF/file upload
    const file = formData.get("file") as File | null;
    if (file && !cvText) {
      if (file.type === "application/pdf") {
        // Dynamically import pdf-parse to avoid webpack issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParse = (await import("pdf-parse")) as any;
        const fn = pdfParse.default ?? pdfParse;
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = await fn(buffer);
        cvText = parsed.text;
      } else {
        // Plain text / Word doc — read as text
        cvText = await file.text();
      }
    }

    if (!cvText?.trim()) {
      return NextResponse.json({ error: "No CV content provided" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: `CV TEXT:\n\n${cvText.slice(0, 8000)}` }],
    });

    const raw = response.content[0];
    if (!raw || raw.type !== "text") throw new Error("Unexpected AI response");

    // Strip any accidental markdown fences
    const jsonStr = raw.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const extracted = JSON.parse(jsonStr);

    // Upsert into Supabase
    const { error: dbError } = await supabase
      .from("img_profiles")
      .upsert({
        id: user.id,
        ...extracted,
        cv_text: cvText.slice(0, 20000),
        updated_at: new Date().toISOString(),
      });

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ profile: extracted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[cv/analyse]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
