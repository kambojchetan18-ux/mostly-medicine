import FunLoading from "@/components/FunLoading";

export default function AiRoleplayLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🎙️ Tuning the AI patient…",
          "🩺 Polishing the stethoscope…",
          "🎲 Sorting the case deck…",
          "🤖 Loading bedside manner…",
        ]}
      />
    </div>
  );
}
