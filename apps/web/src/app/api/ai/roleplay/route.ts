import { NextRequest, NextResponse } from "next/server";
import { createClinicalRoleplay } from "@mostly-medicine/ai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  let user = null;
  let supabaseForPerm;

  // Check Bearer token (mobile) first, fall back to cookie session (web)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
    supabaseForPerm = supabase;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    supabaseForPerm = supabase;
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const perm = await checkModulePermission(supabaseForPerm, "roleplay");
  if (!perm.allowed) {
    return NextResponse.json({ error: "Upgrade to Pro to access roleplay" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { scenarioId, requestFeedback } = body;
    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
          .slice(-30)
          .map((m: { role: string; content: string }) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content.slice(0, 2000) : "",
          }))
      : [];

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    const reply = await createClinicalRoleplay({ scenarioId, messages, requestFeedback });
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roleplay API error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
