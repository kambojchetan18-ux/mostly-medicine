import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">Mostly Medicine</h1>
        <p className="text-brand-200 text-xl mb-2">
          AMC Exam Preparation for International Medical Graduates
        </p>
        <p className="text-brand-300 text-base mb-10">
          AI-powered clinical role-play · AMC guidelines · RACGP Red Book · John Murtagh
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-white text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition"
          >
            Get Started — Free
          </Link>
          <Link
            href="/auth/login"
            className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Log In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {features.map((f) => (
            <div key={f.title} className="bg-white/10 rounded-2xl p-5 backdrop-blur">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-brand-200 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    icon: "🧠",
    title: "AMC CAT 1 MCQs",
    desc: "Thousands of practice questions with spaced repetition and detailed explanations.",
  },
  {
    icon: "🩺",
    title: "AI Clinical Role-Play",
    desc: "Simulate patient consultations for AMC CAT 2 with AI-powered feedback based on AMC marking criteria.",
  },
  {
    icon: "📖",
    title: "Murtagh & Red Book",
    desc: "Clinical summaries grounded in John Murtagh's General Practice and RACGP Red Book guidelines.",
  },
];
