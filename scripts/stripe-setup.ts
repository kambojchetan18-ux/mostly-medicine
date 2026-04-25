#!/usr/bin/env npx ts-node
/**
 * Stripe one-time setup — creates products, prices, and webhook in one shot.
 *
 *   STRIPE_SECRET_KEY=sk_test_... npx ts-node --project scripts/tsconfig.json \
 *     --transpile-only scripts/stripe-setup.ts
 *
 * Optional flags:
 *   --webhook-url https://...    override default mostlymedicine.com URL
 *   --pro-monthly 19             monthly price for Pro (USD, default 19)
 *   --pro-yearly 190
 *   --enterprise-monthly 49
 *   --enterprise-yearly 490
 *   --currency usd               default usd
 *
 * After it finishes, copy the printed env vars into Vercel
 * (Settings -> Environment Variables, all 3 envs) and trigger a redeploy.
 */
import Stripe from "stripe";

const args = process.argv.slice(2);
const arg = (n: string, fallback?: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const num = (n: string, fallback: number) => {
  const v = arg(n);
  return v ? parseFloat(v) : fallback;
};

const SECRET = process.env.STRIPE_SECRET_KEY;
if (!SECRET) {
  console.error("Missing STRIPE_SECRET_KEY env var");
  process.exit(1);
}
if (!SECRET.startsWith("sk_test_") && !SECRET.startsWith("sk_live_")) {
  console.error("STRIPE_SECRET_KEY does not look like a Stripe secret key");
  process.exit(1);
}

const WEBHOOK_URL = arg("webhook-url", "https://mostlymedicine.com/api/billing/webhook")!;
const CURRENCY = (arg("currency", "usd") ?? "usd").toLowerCase();
const PRO_MONTHLY = num("pro-monthly", 19);
const PRO_YEARLY = num("pro-yearly", 190);
const ENT_MONTHLY = num("enterprise-monthly", 49);
const ENT_YEARLY = num("enterprise-yearly", 490);

const stripe = new Stripe(SECRET, { apiVersion: "2024-09-30.acacia" } as unknown as Stripe.StripeConfig);

async function findOrCreateProduct(name: string, description: string): Promise<Stripe.Product> {
  const list = await stripe.products.list({ active: true, limit: 100 });
  const hit = list.data.find((p) => p.name === name);
  if (hit) {
    console.log(`✓ Product exists: ${name} (${hit.id})`);
    return hit;
  }
  const created = await stripe.products.create({ name, description });
  console.log(`✓ Created product: ${name} (${created.id})`);
  return created;
}

async function findOrCreatePrice(
  productId: string,
  amountUsd: number,
  interval: "month" | "year",
  nickname: string
): Promise<Stripe.Price> {
  const list = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const hit = list.data.find(
    (p) =>
      p.unit_amount === Math.round(amountUsd * 100) &&
      p.recurring?.interval === interval &&
      p.currency === CURRENCY
  );
  if (hit) {
    console.log(`  ✓ Price exists: ${nickname} ${CURRENCY.toUpperCase()} ${amountUsd}/${interval} (${hit.id})`);
    return hit;
  }
  const created = await stripe.prices.create({
    product: productId,
    unit_amount: Math.round(amountUsd * 100),
    currency: CURRENCY,
    recurring: { interval },
    nickname,
  });
  console.log(`  ✓ Created price: ${nickname} ${CURRENCY.toUpperCase()} ${amountUsd}/${interval} (${created.id})`);
  return created;
}

async function findOrCreateWebhook(url: string): Promise<Stripe.WebhookEndpoint> {
  const list = await stripe.webhookEndpoints.list({ limit: 100 });
  const hit = list.data.find((w) => w.url === url);
  if (hit) {
    console.log(`✓ Webhook exists: ${url} (${hit.id})`);
    console.log("  ⚠️ Existing webhook secret cannot be retrieved — open dashboard or roll the secret.");
    return hit;
  }
  const created = await stripe.webhookEndpoints.create({
    url,
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_failed",
    ],
    description: "Mostly Medicine — billing sync",
  });
  console.log(`✓ Created webhook: ${url} (${created.id})`);
  return created;
}

async function main() {
  console.log(`Using ${SECRET!.startsWith("sk_test_") ? "TEST" : "LIVE"} mode`);
  console.log(`Currency: ${CURRENCY.toUpperCase()}`);
  console.log("");

  const proProduct = await findOrCreateProduct(
    "Mostly Medicine Pro",
    "Clinical practice unlocked: AMC Handbook RolePlay + AI Clinical Solo with examiner feedback"
  );
  const proMonthly = await findOrCreatePrice(proProduct.id, PRO_MONTHLY, "month", "Pro Monthly");
  const proYearly = await findOrCreatePrice(proProduct.id, PRO_YEARLY, "year", "Pro Yearly");

  const entProduct = await findOrCreateProduct(
    "Mostly Medicine Enterprise",
    "Everything in Pro + 2-player live video roleplay with AI examiner feedback"
  );
  const entMonthly = await findOrCreatePrice(entProduct.id, ENT_MONTHLY, "month", "Enterprise Monthly");
  const entYearly = await findOrCreatePrice(entProduct.id, ENT_YEARLY, "year", "Enterprise Yearly");

  console.log("");
  const webhook = await findOrCreateWebhook(WEBHOOK_URL);
  const webhookSecret = (webhook as { secret?: string }).secret;

  console.log("\n══════════════════════════════════════════════════════════");
  console.log(" Add these to Vercel env vars (Production + Preview + Dev):");
  console.log("══════════════════════════════════════════════════════════");
  console.log(`STRIPE_SECRET_KEY=<already set in your environment — do not copy from here>`);
  if (webhookSecret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
  } else {
    console.log(`STRIPE_WEBHOOK_SECRET=<copy from Stripe dashboard webhook page>`);
  }
  console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<copy 'Publishable key' from Stripe dashboard>`);
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proMonthly.id}`);
  console.log(`STRIPE_PRICE_PRO_YEARLY=${proYearly.id}`);
  console.log(`STRIPE_PRICE_ENTERPRISE_MONTHLY=${entMonthly.id}`);
  console.log(`STRIPE_PRICE_ENTERPRISE_YEARLY=${entYearly.id}`);
  console.log("══════════════════════════════════════════════════════════");
  console.log("\nAfter adding to Vercel, redeploy. Then visit /dashboard/billing to test.");
  console.log("Test card: 4242 4242 4242 4242 — any future expiry — any CVC.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
