import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/callback",
  "/api/search",
  // Stripe webhook is signed (verified via STRIPE_WEBHOOK_SECRET); no user session.
  "/api/billing/webhook",
  // Diagnostic — returns env-var presence flags only (never values). Safe to
  // expose so support can confirm Vercel env-var bake without admin login.
  "/api/health",
];

export async function middleware(request: NextRequest) {
  // Force www subdomain so auth cookies are always set against the same
  // origin. Without this, logging in at www.* and then navigating to the
  // bare domain (or vice versa) drops the session and redirects to login.
  //
  // Exempt the Stripe webhook route — Stripe does NOT follow 3xx redirects
  // on webhook deliveries, so an apex→www redirect makes every event fail
  // with a 307 and the DB never syncs. Webhooks are server-to-server and
  // don't care about cookie origins, so handle the apex hit directly.
  const host = request.headers.get("host");
  const { pathname: earlyPath } = request.nextUrl;
  if (host === "mostlymedicine.com" && earlyPath !== "/api/billing/webhook") {
    const url = request.nextUrl.clone();
    url.host = "www.mostlymedicine.com";
    return NextResponse.redirect(url, 308);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Not logged in → redirect to login, preserving the original URL so the
  // login flow can return the user there (e.g. WhatsApp invite link → login → back to /live/[code]).
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname + (request.nextUrl.search ?? ""));
    return NextResponse.redirect(url);
  }

  // Not logged in → 401 for protected API routes
  if (!user && pathname.startsWith("/api/")) {
    const isPublic = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
    if (!isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Logged in but email not confirmed → redirect to verify-email (blocks all dashboard + API)
  if (user && !user.email_confirmed_at) {
    if (pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/verify-email";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/api/")) {
      const isPublic = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
      if (!isPublic) {
        return NextResponse.json({ error: "Email not confirmed" }, { status: 403 });
      }
    }
  }

  // Logged-in user landing on /auth/login or /auth/signup → bounce to
  // dashboard. They're already in. Hitting these pages again is almost
  // always a stray click on a marketing CTA the page didn't gate.
  // Reset-password and verify-email stay accessible (real use cases).
  if (
    user &&
    user.email_confirmed_at &&
    (pathname === "/auth/login" || pathname === "/auth/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/auth/callback",
    "/auth/login",
    "/auth/signup",
  ],
};
