import FunLoading from "@/components/FunLoading";

export default function Cat2Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunLoading
        pool={[
          "🩺 Setting up the consult room…",
          "📋 Loading the handbook station…",
          "🧐 Calibrating the examiner…",
          "📞 Calling the patient in…",
        ]}
      />
    </div>
  );
}
