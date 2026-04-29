import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/callback",
  "/api/auth/verify-turnstile",
  "/api/search",
  // Stripe webhook is signed (verified via STRIPE_WEBHOOK_SECRET); no user session.
  "/api/billing/webhook",
  // Diagnostic — returns env-var presence flags only (never values). Safe to
  // expose so support can confirm Vercel env-var bake without admin login.
  "/api/health",
];

// ─────────────────────────────────────────────────────────────────────────────
// Bot / abuse defense
// ─────────────────────────────────────────────────────────────────────────────
//
// CIDRs from major cloud providers (AWS, Azure, GCP, DigitalOcean) — block
// these from auth-sensitive paths only. Most legitimate signups happen from
// residential IPs; bots disproportionately come from datacenter IPs. Has a
// false-positive risk for users on cloud-VPN providers (some providers route
// through AWS). If support starts seeing complaints, set the env flag
// DISABLE_DATACENTER_CIDR_BLOCK=1 to turn this off without a code deploy.
const DATACENTER_CIDRS: string[] = [
  // AWS
  "3.0.0.0/8",
  "13.0.0.0/8",
  "15.0.0.0/8",
  "18.0.0.0/8",
  "34.0.0.0/8",
  "35.0.0.0/8",
  "52.0.0.0/8",
  "54.0.0.0/8",
  // Azure
  "20.0.0.0/8",
  "40.0.0.0/8",
  "104.40.0.0/13",
  // GCP
  "34.64.0.0/10",
  "35.184.0.0/13",
  // DigitalOcean
  "64.225.0.0/16",
  "157.230.0.0/16",
  "167.99.0.0/16",
];

const AUTH_SENSITIVE_PREFIXES = ["/api/auth", "/signup", "/login", "/auth"];

const SUSPICIOUS_UA =
  /(curl|wget|python-requests|node|axios|go-http|libwww|httpclient|okhttp|scrapy)/i;

// ─────────────────────────────────────────────────────────────────────────────
// CSRF / Origin validation for state-changing API requests
// ─────────────────────────────────────────────────────────────────────────────
// Browsers always attach `Origin` to non-GET fetches. By rejecting mutation
// requests whose Origin isn't ours we close the textbook CSRF vector against
// /api/cat1/attempt, /api/notes/upload, /api/admin/*, /api/billing/checkout
// etc. Carve-outs for routes that legitimately receive cross-origin or
// no-Origin traffic.
const CSRF_EXEMPT_PREFIXES = [
  "/api/billing/webhook",      // signed by Stripe; comes from api.stripe.com
  "/api/cron/",                // Vercel Cron uses Authorization, not Origin
  "/api/stt/transcribe",       // mobile fetch on Android sometimes drops Origin
  "/api/ai/roleplay",          // mobile fetch
  "/api/turn-credentials",     // mobile fetch
  "/api/auth/login",           // some native flows post without Origin
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/auth/callback",
  "/api/auth/verify-turnstile",
  "/api/health",
];

const ALLOWED_ORIGINS = new Set<string>([
  "https://www.mostlymedicine.com",
  "https://mostlymedicine.com",
]);

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isOriginAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Vercel previews + dev: allow when Origin host == request host.
  // This is what Next.js Server Actions does internally.
  try {
    const o = new URL(origin);
    return host !== null && o.host === host;
  } catch {
    return false;
  }
}

function isCsrfExempt(pathname: string): boolean {
  return CSRF_EXEMPT_PREFIXES.some((p) => pathname.startsWith(p));
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = (n << 8) + v;
  }
  // Force unsigned 32-bit.
  return n >>> 0;
}

function inCidr(ip: string, cidr: string): boolean {
  const [base, bitsRaw] = cidr.split("/");
  const bits = Number(bitsRaw);
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt === null || baseInt === null) return false;
  if (bits === 0) return true;
  const mask = (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

function clientIp(request: NextRequest): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return null;
}

function isAuthSensitive(pathname: string): boolean {
  return AUTH_SENSITIVE_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Layer 1: bot-UA block (cheap, covers all paths matched by config)
  const ua = request.headers.get("user-agent") ?? "";
  if (ua && SUSPICIOUS_UA.test(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── Layer 1b: CSRF / Origin check on mutation requests to /api/*
  // Same-origin browser fetches always send Origin (or Sec-Fetch-Site). A
  // cross-site form-POST won't match either, which kills the classic CSRF
  // vector even though our cookies are SameSite=Lax already (defence in
  // depth). Operator kill-switch: DISABLE_CSRF_CHECK=1.
  if (
    process.env.DISABLE_CSRF_CHECK !== "1" &&
    pathname.startsWith("/api/") &&
    MUTATION_METHODS.has(request.method) &&
    !isCsrfExempt(pathname)
  ) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    // Modern browsers send Sec-Fetch-Site; trust same-origin/none without
    // requiring an Origin header (Safari 16+ sometimes omits Origin on
    // navigations triggered by JS).
    const isSafeSite = fetchSite === "same-origin" || fetchSite === "none";
    if (!isSafeSite && !isOriginAllowed(origin, request.headers.get("host"))) {
      return NextResponse.json({ error: "Forbidden (origin)" }, { status: 403 });
    }
  }

  // ── Layer 2: datacenter-CIDR block on auth-sensitive paths only.
  // Operator kill-switch: set DISABLE_DATACENTER_CIDR_BLOCK=1 in Vercel env.
  if (
    process.env.DISABLE_DATACENTER_CIDR_BLOCK !== "1" &&
    isAuthSensitive(pathname)
  ) {
    const ip = clientIp(request);
    if (ip && DATACENTER_CIDRS.some((cidr) => inCidr(ip, cidr))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ── Layer 3 (existing): force www subdomain so auth cookies are always set
  // against the same origin. Without this, logging in at www.* and then
  // navigating to the bare domain (or vice versa) drops the session and
  // redirects to login.
  const host = request.headers.get("host");
  if (host === "mostlymedicine.com") {
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

  // Profile-required gate: a logged-in, email-confirmed user with no
  // user_profiles row gets redirected to /onboarding. The auth trigger
  // creates this row on signup, so this fires only as a fallback (e.g.
  // legacy users, trigger failure). Guarded carefully to avoid loops.
  if (user && user.email_confirmed_at) {
    const skipProfileCheck =
      pathname === "/onboarding" ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next") ||
      pathname === "/" ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".");

    if (!skipProfileCheck && pathname.startsWith("/dashboard")) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        url.searchParams.set("next", pathname + (request.nextUrl.search ?? ""));
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/auth/:path*",
    "/signup",
    "/login",
    "/onboarding",
  ],
};
