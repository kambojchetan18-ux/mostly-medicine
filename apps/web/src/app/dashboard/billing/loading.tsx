import FunLoading from "@/components/FunLoading";

export default function BillingLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "💳 Polishing the invoice…",
          "🧾 Counting your subscriptions…",
          "🏦 Pinging Stripe…",
          "💰 Adding up the perks…",
        ]}
      />
    </div>
  );
}
