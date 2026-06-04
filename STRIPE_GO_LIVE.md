# Stripe Go-Live Checklist

Follow these steps in order to flip Mostly Medicine from Stripe **test** to **live** mode.
The codebase fails fast on mismatched keys — see `assertStripeConfig()` in
`apps/web/src/lib/stripe.ts`.

> **Status as of 2026-06-04**
> - Founder promo: **98/100 slots used, all 30-day windows expired (latest expiry 2026-05-31)**.
>   That means no existing user will feel cheated by the paid flip — the promo has effectively
>   completed its run. Verified via `is_user_effectively_pro()` against `user_profiles`.
> - Active paying subscribers: **1** (test-mode), period_end 2026-06-14. Two other "enterprise"
>   rows are manual grants with no Stripe IDs (family / internal).
> - Founders Chetan + Amandeep received **Australian PR on 2026-06-01** — payouts can now be
>   routed to Amandeep's AU bank account without visa restrictions.

---

## 1. Stripe Dashboard (live mode)

1. Toggle the dashboard from **Test mode** to **Live mode** (top-right switch).
2. Recreate (or **unarchive** — Chetan unarchived the existing catalog on 2026-06-04) the
   products under **Products → Add product**:
   - **Pro**
     - Monthly recurring price (AUD — see "Pricing" section below)
     - Yearly recurring price
   - **Enterprise**
     - Monthly recurring price
     - Yearly recurring price
3. Open each price and copy its **price id** (`price_...`). You need four ids total.

   > **Shortcut:** `scripts/stripe-setup.ts` will create/find the products + prices + webhook
   > and print the env block ready to paste. Run with the locked AUD launch prices:
   > ```bash
   > STRIPE_SECRET_KEY=sk_live_... \
   >   npx ts-node --project scripts/tsconfig.json --transpile-only \
   >   scripts/stripe-setup.ts \
   >   --currency aud \
   >   --pro-monthly 29 --pro-yearly 290 \
   >   --enterprise-monthly 49 --enterprise-yearly 490 \
   >   --webhook-url https://www.mostlymedicine.com/api/billing/webhook
   > ```
   > Note: existing test-mode products were already unarchived on 2026-06-04. The script will
   > **find-or-create** — it'll reuse anything that already matches (same name + amount +
   > interval + currency) and only create what's missing.

4. Go to **Developers → Webhooks → Add endpoint** (the setup script does this automatically).
   - URL: `https://www.mostlymedicine.com/api/billing/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Save, then click **Reveal signing secret** and copy `whsec_...`.

5. **Payouts → Amandeep's AU bank account** (PR confirmed 2026-06-01):
   - Stripe Dashboard → **Settings → Payouts → Bank accounts and scheduling**.
   - Add Amandeep's Australian bank account (BSB + account number). Stripe accepts AU bank
     details directly for AUD payouts; no Wise/intermediate hop needed now that AU PR is in
     place.
   - Set the **business representative** to Amandeep on **Settings → Business**
     if she should be the legal owner of payouts. Otherwise leave Chetan as representative
     and just add her bank as the destination account.
   - Choose payout schedule: **weekly** is a sensible default (daily creates noise, monthly
     hides churn signals).
   - Verify Tax → AU GST registration status. If MRR crosses A$75k/yr you must register; for
     launch it's fine to leave unregistered until that threshold approaches.

---

## 2. Pricing (locked 2026-06-04)

Decision context: competitor research (June 2026) showed Mostly Medicine was significantly
underpriced for the AI-voice OSCE category. Direct AU comp **OSCELab** charges A$199/yr for
text-heavy AI OSCE; **rehearseMD Elite** (voice + examiner) A$383/yr; **AMBOSS** clinician
~A$397/yr. Old A$19/mo Pro put us in plain-text Qbank zone (Pulsenotes territory) despite
the AI voice + examiner moat.

**Locked launch tier:**

| Plan | Monthly | Yearly | Notes |
|---|---|---|---|
| **Pro** | A$29 | A$290 | Unlimited MCQs + AMC Handbook AI RolePlay + Solo Clinical AI. Yearly = ~17% off vs 12× monthly. **Bumped from A$19** — first raise since beta. |
| **Enterprise** | A$49 | A$490 | Everything in Pro + Peer Live Video RolePlay + priority support. **Unchanged** — keeps the Pro→Enterprise upgrade gap accessible for live-video users. |

The codebase reads these as 4 env vars (`STRIPE_PRICE_*`). Changing prices later = create new
Stripe price IDs + update the env vars + redeploy. The old price IDs can stay attached to
existing subscribers (Stripe never auto-migrates).

### 2.1 Tactical levers — status (decided 2026-06-04)

Originally three levers were on the table; final scope after review:

| Lever | Status | Notes |
|---|---|---|
| **1. Free-tier conversion caps** (5 MCQ + 1 RolePlay/day) | **✅ Shipped** | Migration `042_free_tier_conversion_caps.sql` + `BillingClient.tsx` copy. Activates automatically when `NEXT_PUBLIC_PAID_TIERS_ENABLED=true`. While `betaMode=true`, `BETA_DAILY_LIMITS` in `features.ts` still wins. |
| **2. AMC Pass Pack A$390 one-time** | **❌ Skipped** | Adds webhook one-time-payment branching complexity. Validate the subscription funnel first; revisit only if cost-anxious IMG segment shows demand. |
| **3. Founder yearly A$199 (second cohort)** | **❌ Skipped** | Founder cohort 1 already burned the urgency narrative (98/100, all 30-day windows ended 2026-05-31). A second discounted cohort would dilute brand. Launch at standard A$29/mo + A$290/yr. |

So the launch sequence is now simply:
1. Stripe dashboard + Vercel env-var setup (sections 1 + 3 of this doc)
2. Smoke test (section 4)
3. Backfill (section 5)

No deferred follow-up code work. Free-tier cap behaviour is already in `main` and ready to
activate the moment paid tiers flip on.

### 2.2 Gurminder (current paying customer) — re-subscribe email

`dr.gurmindersingh.inbox@gmail.com` has an active test-mode subscription that ends
2026-06-14. After the env flip, his test sub will be invisible to live-mode Stripe and the
daily resync cron will downgrade him to free.

Plan: **send a re-subscribe email before 2026-06-13** offering re-subscription at the
launch-standard A$29/mo (or A$290/yr). Founder-discount option was considered and dropped
along with lever 3 — see the table above.

Email mechanics:
- Send via Resend; template lives under `apps/web/src/lib/emails/`.
- Personalise with first name + beta thank-you + one-click checkout link.
- Do NOT auto-grant comp Pro — the email is the agreed approach, not silent extension.

---

## 3. Vercel Environment Variables (Production)

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
| `NEXT_PUBLIC_PAID_TIERS_ENABLED` | `true` ← **the billing UI kill-switch** |
| `NEXT_PUBLIC_BETA_MODE` | `false` ← **stops treating every user as Pro** |

After saving, redeploy production so the new env vars take effect.

---

## 4. Smoke Test with a Real Card

Use a real card with a small price (drop the Pro monthly price to AUD 0.50 for
the test if you want, then bump it back).

1. Sign in to `https://www.mostlymedicine.com` as a real user.
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

## 5. Backfill Existing Users

Two options — pick whichever is convenient:

**Option A — cron endpoint (production):**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.mostlymedicine.com/api/cron/billing-resync
```

**Option B — local script (more verbose, easier to debug):**

```bash
STRIPE_SECRET_KEY=sk_live_... \
  NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  STRIPE_PRICE_PRO_MONTHLY=price_... STRIPE_PRICE_PRO_YEARLY=price_... \
  STRIPE_PRICE_ENTERPRISE_MONTHLY=price_... STRIPE_PRICE_ENTERPRISE_YEARLY=price_... \
  npx ts-node --project scripts/tsconfig.json --transpile-only \
  scripts/stripe-resync-subscription.ts
```

Then spot-check a few rows in `user_profiles` to confirm `plan` matches what Stripe says.

**Special case — existing test-mode subscriber (`dr.gurmindersingh.inbox@gmail.com`):**
- Test-mode subscription won't carry over to live. Either keep them on a comp Pro via
  `pro_until = now() + interval '1 year'` (admin SQL), or message them to re-subscribe via
  the new live checkout. Period ends 2026-06-14 — decide before then.

---

## 6. Rollback

If anything looks wrong, in Vercel revert each env var to the previous test
value (and set `NEXT_PUBLIC_PAID_TIERS_ENABLED=false`, `NEXT_PUBLIC_BETA_MODE=true`) and
redeploy. The codebase will switch back to beta automatically — no code change required.
The TEST-mode banner will reappear on the billing page as confirmation.

Webhook events that fire during a rollback are still recorded into `billing_events` for
idempotency, but `user_profiles` mutations are skipped while `betaMode = true`. So flipping
back and forth is safe.
