import FunLoading from "@/components/FunLoading";

export default function CasesLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🏥 Opening the case folder…",
          "📋 Pulling the chart…",
          "🩺 Reviewing the notes…",
          "🧠 Loading clinical reasoning…",
        ]}
      />
    </div>
  );
}
