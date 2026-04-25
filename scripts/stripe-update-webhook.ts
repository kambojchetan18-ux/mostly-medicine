#!/usr/bin/env npx ts-node
/**
 * One-shot: update the Mostly Medicine webhook URL to www subdomain.
 *
 *   STRIPE_SECRET_KEY=sk_test_... npx ts-node --project scripts/tsconfig.json \
 *     --transpile-only scripts/stripe-update-webhook.ts
 */
import Stripe from "stripe";

const SECRET = process.env.STRIPE_SECRET_KEY;
if (!SECRET) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const NEW_URL = "https://www.mostlymedicine.com/api/billing/webhook";
const OLD_URL = "https://mostlymedicine.com/api/billing/webhook";

const stripe = new Stripe(SECRET, { apiVersion: "2024-09-30.acacia" } as unknown as Stripe.StripeConfig);

async function main() {
  const list = await stripe.webhookEndpoints.list({ limit: 100 });
  const target = list.data.find((w) => w.url === OLD_URL || w.url === NEW_URL);
  if (!target) {
    console.error("No matching webhook found. Run scripts/stripe-setup.ts first.");
    process.exit(1);
  }
  if (target.url === NEW_URL) {
    console.log(`✓ Webhook already at ${NEW_URL} (${target.id}) — nothing to update`);
    return;
  }
  const updated = await stripe.webhookEndpoints.update(target.id, { url: NEW_URL });
  console.log(`✓ Updated webhook ${updated.id}`);
  console.log(`  Old URL: ${OLD_URL}`);
  console.log(`  New URL: ${updated.url}`);
  console.log("");
  console.log("Webhook signing secret stays the same — no env var change needed.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
