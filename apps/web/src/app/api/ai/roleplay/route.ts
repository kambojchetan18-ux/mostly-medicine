import { NextRequest, NextResponse } from "next/server";
import { createClinicalRoleplay } from "@mostly-medicine/ai";

export async function POST(req: NextRequest) {
  const { scenarioId, messages } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured. Please add ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }

  const reply = await createClinicalRoleplay({ scenarioId, messages });
  return NextResponse.json({ reply });
}
