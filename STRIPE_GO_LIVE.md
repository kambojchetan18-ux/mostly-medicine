# Stripe Go-Live Checklist

Follow these steps in order to flip Mostly Medicine from Stripe **test** to **live** mode.
The codebase fails fast on mismatched keys — see `assertStripeConfig()` in
`apps/web/src/lib/stripe.ts`.

---

## 1. Stripe Dashboard (live mode)

1. Toggle the dashboard from **Test mode** to **Live mode** (top-right switch).
2. Recreate the products under **Products → Add product**:
   - **Pro**
     - Monthly recurring price (e.g. AUD 19.00)
     - Yearly recurring price (e.g. AUD 190.00)
   - **Enterprise**
     - Monthly recurring price (e.g. AUD 49.00)
     - Yearly recurring price (e.g. AUD 490.00)
3. Open each price and copy its **price id** (`price_...`). You need four ids total.
4. Go to **Developers → Webhooks → Add endpoint**.
   - URL: `https://mostlymedicine.com/api/billing/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Save, then click **Reveal signing secret** and copy `whsec_...`.

---

## 2. Vercel Environment Variables (Production)

Go to **Vercel → Project → Settings → Environment Variables → Production**.
Update or add the following. All must be set on the **Production** environment.

| Variable | New value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` from Stripe → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` from the same page |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the live webhook endpoint (step 1.4) |
| `STRIPE_PRICE_PRO_MONTHLY` | live price id for Pro monthly |
| `STRIPE_PRICE_PRO_YEARLY` | live price id for Pro yearly |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | live price id for Enterprise monthly |
| `STRIPE_PRICE_ENTERPRISE_YEARLY` | live price id for Enterprise yearly |
| `CRON_SECRET` | any random 32+ char string (for the daily resync cron) |

After saving, redeploy production so the new env vars take effect.

---

## 3. Smoke Test with a Real Card

Use a real card with a small price (drop the Pro monthly price to AUD 0.50 for
the test if you want, then bump it back).

1. Sign in to `https://mostlymedicine.com` as a real user.
2. Go to `/dashboard/billing`.
3. Confirm the **TEST mode banner is gone** (it only appears when `pk_test_...` is configured).
4. Click **Upgrade to Pro**. Pay with a real card.
5. After redirect, confirm:
   - Banner shows `Subscription activated`.
   - In Supabase, `user_profiles.plan` for that user is `pro`.
   - `user_profiles.stripe_customer_id` and `stripe_subscription_id` are populated.
6. Click **Open Billing Portal**. Confirm it opens.
7. From the portal, cancel the subscription. Confirm:
   - Webhook fires (Stripe dashboard → Developers → Webhooks → live endpoint shows 200).
   - `user_profiles.subscription_cancel_at_period_end` flips to `true`.
   - The billing page shows the amber "scheduled to end" banner.

---

## 4. Backfill Existing Users

Some users may have test-mode subscriptions that won't carry over. Run the
resync cron once manually after the env switch:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://mostlymedicine.com/api/cron/billing-resync
```

Then spot-check a few rows in `user_profiles` to confirm `plan` matches what
Stripe says.

---

## 5. Rollback

If anything looks wrong, in Vercel revert each env var to the previous test
value and redeploy. The codebase will switch back to test mode automatically —
no code change required. The TEST-mode banner will reappear on the billing
page as confirmation.
