import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";

  // OAuth code exchange (Google SSO)
  // Cookies must be set directly on the redirect response — not on cookieStore —
  // otherwise the session is lost when the browser follows the redirect.
  if (code) {
    const redirectTo = NextResponse.redirect(`${origin}${next}`);
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
    if (!error) return redirectTo;
  }

  // Email confirmation (signup / email change)
  if (token_hash && type) {
    const cookieStore = await cookies();
    const redirectTo = NextResponse.redirect(`${origin}/dashboard`);
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
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "signup" | "email" });
    if (!error) return redirectTo;
    return NextResponse.redirect(`${origin}/auth/login?error=email_confirmation_failed`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
