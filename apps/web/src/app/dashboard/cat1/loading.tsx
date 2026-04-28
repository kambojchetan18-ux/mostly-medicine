import FunLoading from "@/components/FunLoading";

export default function Cat1Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🧠 Picking a fresh question…",
          "🃏 Reshuffling the deck…",
          "🔍 Hunting in the bank…",
          "📚 Skimming the syllabus…",
        ]}
      />
    </div>
  );
}
