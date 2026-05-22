import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendBranded, newUnsubToken } from "@/lib/email";
import { buildWelcomeEmail } from "@/lib/email-templates";

// One-shot backfill — sends the warm welcome email to every existing user
// who never got one. Idempotent: filters on welcome_email_sent_at IS NULL,
// honours email_marketing_opt_in = false, stamps welcome_email_sent_at on
// success so a re-run doesn't double-send.
//
// Auth: bearer CRON_SECRET if env is set, otherwise open. Matches the
// keepalive + brain-teaser pattern.
//
// 120 ms pacing keeps under Resend's 10/sec free-tier limit. maxDuration
// scoped to 60s — at 120 ms/send that covers ~500 backfills per run; if
// the table is bigger, just hit the route again, the filter naturally
// excludes anyone already stamped.
export const maxDuration = 60;

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
}

export async function GET(req: NextRequest) {
  // Auth gate
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limitParam = url.searchParams.get("limit");
  const batchLimit = Math.max(
    1,
    Math.min(500, limitParam ? Number.parseInt(limitParam, 10) || 500 : 500)
  );

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profiles, error: queryErr } = await service
    .from("user_profiles")
    .select("id, email, full_name")
    .is("welcome_email_sent_at", null)
    .eq("email_marketing_opt_in", true)
    .not("email", "is", null)
    .order("created_at", { ascending: true })
    .limit(batchLimit);

  if (queryErr) {
    console.error("[welcome-backfill] query failed", queryErr);
    return NextResponse.json({ ok: false, error: queryErr.message }, { status: 500 });
  }

  const recipients = (profiles ?? []) as unknown as ProfileRow[];

  if (recipients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, message: "no_pending_recipients" });
  }

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      pending: recipients.length,
      previewEmails: recipients.slice(0, 10).map((r) => r.email),
    });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  let sent = 0;
  let failed = 0;
  const errors: { email: string | null; error: string }[] = [];

  for (const profile of recipients) {
    const toEmail = profile.email;
    if (!toEmail) {
      failed += 1;
      continue;
    }

    const firstName = (() => {
      const full = profile.full_name?.trim();
      if (!full) return "doctor";
      const first = full.split(/\s+/)[0];
      return first || "doctor";
    })();

    try {
      const token = newUnsubToken();
      const { error: tokenErr } = await service
        .from("email_unsub_tokens")
        .insert({ token, user_id: profile.id });
      if (tokenErr) throw new Error(`token insert: ${tokenErr.message}`);

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
        throw new Error(sendResult.error ?? "send_failed");
      }

      const { error: stampErr } = await service
        .from("user_profiles")
        .update({ welcome_email_sent_at: new Date().toISOString() })
        .eq("id", profile.id);
      if (stampErr) throw new Error(`stamp: ${stampErr.message}`);

      sent += 1;
    } catch (err) {
      failed += 1;
      const message = err instanceof Error ? err.message : "unknown";
      console.error("[welcome-backfill] failed for", toEmail, message);
      errors.push({ email: toEmail, error: message });
    }

    // Pace under Resend's 10/sec ceiling.
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    pendingAfterRun: Math.max(0, recipients.length - sent),
    errors: errors.slice(0, 10),
  });
}
