import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  assertStripeConfig,
  planForPriceId,
  priceCatalog,
  publishableKeyMode,
  stripeMode,
} from "../stripe";

// These helpers read process.env at call time, so each test sets the exact env
// it needs and we restore the original afterward. No network, no Stripe SDK.
const ENV_KEYS = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_PRO_YEARLY",
  "STRIPE_PRICE_ENTERPRISE_MONTHLY",
  "STRIPE_PRICE_ENTERPRISE_YEARLY",
] as const;

let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = {};
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("priceCatalog / planForPriceId", () => {
  it("maps configured price ids to their plan", () => {
    process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_m";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_y";
    process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY = "price_ent_m";

    expect(planForPriceId("price_pro_m")).toBe("pro");
    expect(planForPriceId("price_pro_y")).toBe("pro");
    expect(planForPriceId("price_ent_m")).toBe("enterprise");
  });

  it("falls back to 'free' for an unknown price id", () => {
    process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_m";
    expect(planForPriceId("price_does_not_exist")).toBe("free");
  });

  it("only lists prices that are actually configured", () => {
    process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_m";
    const catalog = priceCatalog();
    expect(catalog).toHaveLength(1);
    expect(catalog[0]).toEqual({ id: "price_pro_m", plan: "pro", cadence: "monthly" });
  });
});

describe("stripeMode / publishableKeyMode", () => {
  it("detects live vs test from the key prefix", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc";
    expect(stripeMode()).toBe("live");
    process.env.STRIPE_SECRET_KEY = "sk_test_abc";
    expect(stripeMode()).toBe("test");
  });

  it("returns null when the key is missing or malformed", () => {
    expect(stripeMode()).toBeNull();
    process.env.STRIPE_SECRET_KEY = "garbage";
    expect(stripeMode()).toBeNull();
  });

  it("reads the publishable key mode without leaking the value", () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_xyz";
    expect(publishableKeyMode()).toBe("live");
  });
});

describe("assertStripeConfig — money-safety guard", () => {
  it("passes when secret + publishable are both test mode", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_abc";
    expect(() => assertStripeConfig()).not.toThrow();
  });

  it("throws when the secret key is missing", () => {
    expect(() => assertStripeConfig()).toThrow(/STRIPE_SECRET_KEY is not set/);
  });

  it("throws on a live secret paired with a test publishable key", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_abc";
    expect(() => assertStripeConfig()).toThrow(/Mode mismatch/);
  });

  it("throws on a test secret paired with a live publishable key", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_abc";
    expect(() => assertStripeConfig()).toThrow(/Mode mismatch/);
  });

  it("throws when a live secret is paired with a test webhook secret", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_abc";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_abc";
    expect(() => assertStripeConfig()).toThrow(/test webhook/);
  });

  it("rejects a price id that does not look like a Stripe price", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_abc";
    process.env.STRIPE_PRICE_PRO_MONTHLY = "prod_not_a_price";
    expect(() => assertStripeConfig()).toThrow(/does not look like a Stripe price id/);
  });
});
