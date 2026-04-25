import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/callback",
  "/api/search",
  // Stripe webhook is signed (verified via STRIPE_WEBHOOK_SECRET); no user session.
  "/api/billing/webhook",
];

export async function middleware(request: NextRequest) {
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

  // Not logged in → redirect to login
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
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

  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  supabaseResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/auth/callback"],
};
