import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Whitelist redirect targets to in-app paths only — prevents open-redirect
// abuse if an attacker crafts ?next=https://evil.com or ?next=//evil.com
// (protocol-relative). Mirrors apps/web/src/app/auth/login/page.tsx safeNext.
const ALLOWED_AUTH_PATHS = new Set(["/auth/reset-password"]);
function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/dashboard";
}

// Fire-and-forget welcome email kick-off. The /api/email/welcome route is
// idempotent (checks welcome_email_sent_at) so re-callbacks are safe. We
// forward the user's cookie header so the welcome route can resolve the
// Supabase session. Never await — user redirect must not wait on email send.
function kickWelcomeEmail(req: NextRequest, origin: string): void {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    void fetch(`${origin}/api/email/welcome`, {
      method: "POST",
      headers: { cookie: cookieHeader },
    }).catch(() => {});
  } catch {
    // Swallow — welcome email failure must never block auth redirect.
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const rawNext = searchParams.get("next");
  const next = safeNext(rawNext);

  // Password recovery overrides any default /dashboard redirect — the user
  // must land on /auth/reset-password with the live session in cookies so
  // updateUser({ password }) succeeds.
  const isRecovery =
    type === "recovery" ||
    (rawNext != null && ALLOWED_AUTH_PATHS.has(rawNext));
  const codeRedirectPath = isRecovery ? "/auth/reset-password" : next;

  // OAuth code exchange (Google SSO) and PKCE recovery flow
  // Cookies must be set directly on the redirect response — not on cookieStore —
  // otherwise the session is lost when the browser follows the redirect.
  if (code) {
    const redirectTo = NextResponse.redirect(`${origin}${codeRedirectPath}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options?: Parameters<typeof redirectTo.cookies.set>[2] }[]) =>
            cookiesToSet.forEach(({ name, value, options }) => redirectTo.cookies.set(name, value, options ?? {})),
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (!isRecovery) kickWelcomeEmail(request, origin);
      return redirectTo;
    }
  }

  // Email confirmation (signup / email change) and recovery OTP
  if (token_hash && type) {
    const cookieStore = await cookies();
    const otpRedirectPath = type === "recovery" ? "/auth/reset-password" : "/dashboard";
    const redirectTo = NextResponse.redirect(`${origin}${otpRedirectPath}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options?: Parameters<typeof redirectTo.cookies.set>[2] }[]) =>
            cookiesToSet.forEach(({ name, value, options }) => redirectTo.cookies.set(name, value, options ?? {})),
        },
      }
    );
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "signup" | "email" | "recovery" });
    if (!error) {
      if (type !== "recovery") kickWelcomeEmail(request, origin);
      return redirectTo;
    }
    return NextResponse.redirect(`${origin}/auth/login?error=email_confirmation_failed`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
