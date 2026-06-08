import { beforeEach, describe, expect, it, vi } from "vitest";

// syncSubscriptionToProfile() builds a Supabase service client internally via
// @supabase/supabase-js. We mock that module so the test captures the exact
// `update` payload written to user_profiles — the money-critical part — without
// any DB. Shared mutable state goes through vi.hoisted so the mock factory
// (hoisted above imports) can read it.
const h = vi.hoisted(() => ({
  state: {
    capturedUpdate: null as Record<string, unknown> | null,
    existingPlan: undefined as string | undefined,
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      update: (payload: Record<string, unknown>) => {
        h.state.capturedUpdate = payload;
        return { eq: async () => ({ error: null }) };
      },
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: h.state.existingPlan ? { plan: h.state.existingPlan } : null,
          }),
        }),
      }),
    }),
  }),
}));

import { syncSubscriptionToProfile } from "../billing";

const PRO_PRICE = "price_pro_m";
const ENT_PRICE = "price_ent_m";

beforeEach(() => {
  h.state.capturedUpdate = null;
  h.state.existingPlan = undefined;
  // planForPriceId() reads these from env.
  process.env.STRIPE_PRICE_PRO_MONTHLY = PRO_PRICE;
  process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY = ENT_PRICE;
});

describe("syncSubscriptionToProfile — status → plan mapping", () => {
  it("sets plan to pro for an active Pro subscription", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "active",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate?.plan).toBe("pro");
    expect(h.state.capturedUpdate?.subscription_status).toBe("active");
    expect(h.state.capturedUpdate?.subscription_period_end).toBe(
      new Date(1_900_000_000 * 1000).toISOString()
    );
  });

  it("KEEPS pro access while past_due (Stripe grace window)", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "past_due",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate?.plan).toBe("pro");
  });

  it("downgrades to free when the subscription is canceled", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "canceled",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate?.plan).toBe("free");
  });

  it("does NOT demote an active user when priceId is missing (falls back to existing plan)", async () => {
    h.state.existingPlan = "enterprise";
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: null,
      status: "active",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate?.plan).toBe("enterprise");
  });

  it("defaults to free when priceId is missing and no existing plan is found", async () => {
    h.state.existingPlan = undefined;
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: null,
      status: "active",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate?.plan).toBe("free");
  });

  it("stores a null period end when Stripe gives none", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "active",
      periodEnd: null,
    });
    expect(h.state.capturedUpdate?.subscription_period_end).toBeNull();
  });
});

describe("syncSubscriptionToProfile — cancel_at_period_end handling", () => {
  it("omits subscription_cancel_at_period_end when the caller did not supply it", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "active",
      periodEnd: 1_900_000_000,
    });
    expect(h.state.capturedUpdate).not.toHaveProperty("subscription_cancel_at_period_end");
  });

  it("writes subscription_cancel_at_period_end when explicitly provided", async () => {
    await syncSubscriptionToProfile({
      customerId: "cus_1",
      subscriptionId: "sub_1",
      priceId: PRO_PRICE,
      status: "active",
      periodEnd: 1_900_000_000,
      cancelAtPeriodEnd: true,
    });
    expect(h.state.capturedUpdate?.subscription_cancel_at_period_end).toBe(true);
  });
});
