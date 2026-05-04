import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendBranded, newUnsubToken } from "@/lib/email";

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

    const subject = "Welcome to Mostly Medicine — your AMC prep, free to start";

    const cardStyle =
      "display:block;padding:14px 16px;margin:8px 0;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc;color:#0f172a;text-decoration:none;font-weight:600;font-size:14px;";

    const bodyHtml = `
      <p style="margin:0 0 14px;font-size:16px;font-weight:600;">G&apos;day ${firstName},</p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
        Welcome aboard. You&apos;re now set up to prep for AMC with us.
      </p>
      <div style="margin:18px 0;">
        <a href="https://mostlymedicine.com/amc-fee-calculator" style="${cardStyle}">
          Try the AMC Fee Calculator &rarr;
        </a>
        <a href="https://mostlymedicine.com/dashboard/cat1" style="${cardStyle}">
          Start AMC MCQs (20/day free) &rarr;
        </a>
        <a href="https://mostlymedicine.com/dashboard/ask-ai" style="${cardStyle}">
          Try Ask AI in your dashboard &rarr;
        </a>
      </div>
      <div style="margin:22px 0;padding:14px 16px;border-radius:10px;background:#ecfdf5;border:1px solid #a7f3d0;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#065f46;">What&apos;s free for you</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:#065f46;">
          <li>20 MCQs/day</li>
          <li>1 Solo Clinical RolePlay/day</li>
          <li>1 AMC Handbook RolePlay/day</li>
          <li>Unlimited Ask AI inside the library</li>
          <li>Always-free fee calculator and eligibility checker</li>
        </ul>
      </div>
      <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">
        Reply to this email if you hit a wall — it lands in my inbox.
      </p>
      <p style="margin:6px 0 0;font-size:14px;color:#0f172a;font-weight:600;">— Chetan, founder</p>
    `;

    const sendResult = await sendBranded({
      to: toEmail,
      subject,
      bodyHtml,
      unsubscribeUrl,
      preheader: "Your AMC prep, free to start.",
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
