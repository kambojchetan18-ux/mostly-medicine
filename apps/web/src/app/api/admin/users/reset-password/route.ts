import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const svc = service();
  const { data: target, error: lookupErr } = await svc.auth.admin.getUserById(userId);
  if (lookupErr || !target?.user) {
    return NextResponse.json({ error: lookupErr?.message ?? "User not found" }, { status: 404 });
  }
  const email = target.user.email;
  if (!email) return NextResponse.json({ error: "Target user has no email" }, { status: 400 });

  const redirectTo = "https://mostlymedicine.com/auth/reset-password";

  // generateLink with type=recovery triggers Supabase's recovery email template
  // (when SMTP is configured) and also returns the link itself.
  const { error: linkErr } = await svc.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (linkErr) {
    // Fallback: resetPasswordForEmail always sends the email via Supabase auth.
    const fallback = await svc.auth.resetPasswordForEmail(email, { redirectTo });
    if (fallback.error) {
      return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
