import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const want = [
    "CLOUDFLARE_TURN_KEY_ID",
    "CLOUDFLARE_TURN_API_TOKEN",
    "GROQ_API_KEY",
    "STRIPE_SECRET_KEY",
    "ANTHROPIC_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
  ];
  const status: Record<string, boolean> = {};
  for (const k of want) status[k] = Boolean(process.env[k]);

  const v = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const lastCode = v.length > 0 ? v.charCodeAt(v.length - 1) : null;
  const supabaseUrlHealth = {
    length: v.length,
    lastCharCode: lastCode,
    trailingWhitespace: lastCode !== null && (lastCode <= 32 || lastCode === 0x7f),
    looksValid: /^https?:\/\/[a-z0-9-]+\.supabase\.co$/.test(v),
  };
  return NextResponse.json({
    runtime: "ok",
    env: status,
    supabaseUrlHealth,
  });
}
