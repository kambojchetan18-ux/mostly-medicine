// Server-side Stripe client. Singleton, no key on the client.
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
    // Pin to a stable API version. Cast through unknown because the SDK's
    // type union only includes the latest dahlia version, but the runtime
    // accepts any valid Stripe API version string.
    _stripe = new Stripe(key, {
      apiVersion: "2024-09-30.acacia",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
  return _stripe;
}

// Map Stripe price IDs (set in env vars) to internal plan names that the rest
// of the app already understands (free / pro / enterprise). Configured this way
// so we can swap test-mode and live-mode prices without code changes.
export interface PriceConfig {
  id: string;
  plan: "pro" | "enterprise";
  cadence: "monthly" | "yearly";
}

export function priceCatalog(): PriceConfig[] {
  const list: PriceConfig[] = [];
  const m = (key: string, plan: PriceConfig["plan"], cadence: PriceConfig["cadence"]) => {
    const id = process.env[key];
    if (id) list.push({ id, plan, cadence });
  };
  m("STRIPE_PRICE_PRO_MONTHLY", "pro", "monthly");
  m("STRIPE_PRICE_PRO_YEARLY", "pro", "yearly");
  m("STRIPE_PRICE_ENTERPRISE_MONTHLY", "enterprise", "monthly");
  m("STRIPE_PRICE_ENTERPRISE_YEARLY", "enterprise", "yearly");
  return list;
}

export function planForPriceId(priceId: string): "free" | "pro" | "enterprise" {
  const hit = priceCatalog().find((p) => p.id === priceId);
  return hit?.plan ?? "free";
}

// Detect whether the configured Stripe secret key targets test or live mode.
// Returns null when STRIPE_SECRET_KEY is missing.
export function stripeMode(): "test" | "live" | null {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) return null;
  if (k.startsWith("sk_live_")) return "live";
  if (k.startsWith("sk_test_")) return "test";
  return null;
}

// Read the publishable key prefix without leaking the key value itself.
// Used for the test/live banner on the billing UI.
export function publishableKeyMode(): "test" | "live" | null {
  const k = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!k) return null;
  if (k.startsWith("pk_live_")) return "live";
  if (k.startsWith("pk_test_")) return "test";
  return null;
}

/**
 * Startup-time consistency guard. Throws when env vars look mismatched
 * (e.g. live secret + test publishable key) so we fail fast rather than
 * charging real cards in test mode or vice versa.
 *
 * Call at the top of every billing API route. Errors get logged via
 * console.error so Vercel surfaces them in production logs.
 */
export function assertStripeConfig(): void {
  const errors: string[] = [];

  const secret = process.env.STRIPE_SECRET_KEY;
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const webhook = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    errors.push("STRIPE_SECRET_KEY is not set");
  } else if (!secret.startsWith("sk_test_") && !secret.startsWith("sk_live_")) {
    errors.push("STRIPE_SECRET_KEY must start with sk_test_ or sk_live_");
  }

  // Publishable key should match the secret key mode.
  if (secret && publishable) {
    if (secret.startsWith("sk_live_") && !publishable.startsWith("pk_live_")) {
      errors.push(
        "Mode mismatch: STRIPE_SECRET_KEY is live (sk_live_) but NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not pk_live_"
      );
    }
    if (secret.startsWith("sk_test_") && !publishable.startsWith("pk_test_")) {
      errors.push(
        "Mode mismatch: STRIPE_SECRET_KEY is test (sk_test_) but NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not pk_test_"
      );
    }
  }

  // Webhook secret heuristic — Stripe dashboards label test webhooks
  // with a whsec_test_ prefix in newer accounts. If the secret is
  // explicitly test-prefixed, it must not be paired with a live key.
  if (secret && webhook) {
    if (secret.startsWith("sk_live_") && webhook.startsWith("whsec_test_")) {
      errors.push(
        "Mode mismatch: STRIPE_SECRET_KEY is live but STRIPE_WEBHOOK_SECRET is a test webhook (whsec_test_)"
      );
    }
  }

  // Price IDs are opaque strings — Stripe gives them no sk-style prefix.
  // We can only sanity-check that they look like price ids at all.
  const priceVars = [
    "STRIPE_PRICE_PRO_MONTHLY",
    "STRIPE_PRICE_PRO_YEARLY",
    "STRIPE_PRICE_ENTERPRISE_MONTHLY",
    "STRIPE_PRICE_ENTERPRISE_YEARLY",
  ];
  for (const v of priceVars) {
    const val = process.env[v];
    if (val && !val.startsWith("price_")) {
      errors.push(`${v} does not look like a Stripe price id (expected price_...)`);
    }
  }

  if (errors.length > 0) {
    const message = `Stripe configuration invalid:\n  - ${errors.join("\n  - ")}`;
    // Always log so Vercel surfaces it, even when callers swallow the throw.
    console.error("[stripe-config]", message);
    throw new Error(message);
  }
}
