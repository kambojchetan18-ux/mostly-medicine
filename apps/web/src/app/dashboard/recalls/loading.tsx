import FunLoading from "@/components/FunLoading";

export default function RecallsLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🧠 Strengthening memory traces…",
          "⏳ Spaced-repetition is doing its thing…",
          "📝 Pulling cards due today…",
          "🔁 Shuffling the SR queue…",
        ]}
      />
    </div>
  );
}
