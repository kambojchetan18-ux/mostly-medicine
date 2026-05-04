import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendBranded, newUnsubToken } from "@/lib/email";
import { buildWelcomeEmail } from "@/lib/email-templates";

interface ProfileRow {
  email: string | null;
  full_name: string | null;
  welcome_email_sent_at: string | null;
  email_marketing_opt_in: boolean | null;
}

export async function POST(req: NextRequest) {
  try {
    const cookieClient = await createClient();
    const { data: userData } = await cookieClient.auth.getUser();
    const user = userData.user;
    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profileRaw, error: profileErr } = await cookieClient
      .from("user_profiles")
      .select("email, full_name, welcome_email_sent_at, email_marketing_opt_in")
      .eq("id", user.id)
      .single();

    if (profileErr || !profileRaw) {
      return NextResponse.json(
        { ok: false, error: profileErr?.message ?? "profile_not_found" },
        { status: 500 }
      );
    }

    const profile = profileRaw as unknown as ProfileRow;

    if (profile.welcome_email_sent_at) {
      return NextResponse.json({ ok: true, skipped: "already_sent" });
    }
    if (profile.email_marketing_opt_in === false) {
      return NextResponse.json({ ok: true, skipped: "opted_out" });
    }

    const toEmail = profile.email ?? user.email;
    if (!toEmail) {
      return NextResponse.json({ ok: false, error: "no_email_on_profile" }, { status: 500 });
    }

    const firstName = (() => {
      const full = profile.full_name?.trim();
      if (!full) return "doctor";
      const first = full.split(/\s+/)[0];
      return first || "doctor";
    })();

    // Service-role client for unsub token insert + welcome stamp (bypasses RLS).
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const token = newUnsubToken();
    const { error: tokenErr } = await service
      .from("email_unsub_tokens")
      .insert({ token, user_id: user.id });
    if (tokenErr) {
      return NextResponse.json({ ok: false, error: tokenErr.message }, { status: 500 });
    }

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const unsubscribeUrl = `${origin}/api/email/unsubscribe?token=${token}`;

    const { subject, bodyHtml, preheader } = buildWelcomeEmail(firstName);

    const sendResult = await sendBranded({
      to: toEmail,
      subject,
      bodyHtml,
      unsubscribeUrl,
      preheader,
    });

    if (!sendResult.ok && !sendResult.skipped) {
      return NextResponse.json(
        { ok: false, error: sendResult.error ?? "send_failed" },
        { status: 500 }
      );
    }

    const { error: stampErr } = await service
      .from("user_profiles")
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq("id", user.id);
    if (stampErr) {
      return NextResponse.json({ ok: false, error: stampErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    console.error("[email/welcome] threw", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
