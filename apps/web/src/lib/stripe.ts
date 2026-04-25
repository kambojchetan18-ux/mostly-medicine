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
