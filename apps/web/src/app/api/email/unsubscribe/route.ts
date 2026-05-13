import { NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

interface TokenRow {
  user_id: string;
}

const SHELL_HEAD = `
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mostly Medicine</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:48px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <tr><td style="background:linear-gradient(135deg,#0f766e 0%,#7c3aed 100%);padding:24px 28px;color:#ffffff;">
          <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:-0.01em;">Mostly Medicine</h1>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.9;">AMC prep for International Medical Graduates</p>
        </td></tr>
        <tr><td style="padding:28px;">
`;

const SHELL_FOOT = `
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

function htmlResponse(inner: string): Response {
  return new Response(SHELL_HEAD + inner + SHELL_FOOT, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: NextRequest) {
  const rl = await aiRateLimit(clientKey(req, "unsub"), { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return htmlResponse(`
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;">Too many requests</h2>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">Please try again in a minute.</p>
    `);
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const expiredHtml = `
    <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;">This link has expired</h2>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
      The unsubscribe link is no longer valid. You can manage email preferences from your account.
    </p>
    <a href="https://mostlymedicine.com/dashboard/profile" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
      Go to profile
    </a>
  `;

  if (!token) {
    return htmlResponse(expiredHtml);
  }

  try {
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tokenRaw } = await service
      .from("email_unsub_tokens")
      .select("user_id")
      .eq("token", token)
      .maybeSingle();

    const tokenRow = tokenRaw as unknown as TokenRow | null;

    if (!tokenRow?.user_id) {
      return htmlResponse(expiredHtml);
    }

    const userId = tokenRow.user_id;

    await service
      .from("user_profiles")
      .update({ email_marketing_opt_in: false })
      .eq("id", userId);

    await service.from("email_unsub_tokens").delete().eq("user_id", userId);

    const successHtml = `
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;">You&apos;ve been unsubscribed</h2>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
        We won&apos;t send marketing emails anymore. You&apos;ll still receive transactional account emails (sign-in, billing, security).
      </p>
      <a href="https://mostlymedicine.com" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
        Back to Mostly Medicine
      </a>
    `;

    return htmlResponse(successHtml);
  } catch (err) {
    console.error("[email/unsubscribe] threw", err instanceof Error ? err.message : err);
    return htmlResponse(expiredHtml);
  }
}
