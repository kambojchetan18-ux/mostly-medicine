import Link from "next/link";

const modules = [
  {
    href: "/dashboard/cat1",
    title: "AMC CAT 1",
    subtitle: "Multiple Choice Questions",
    desc: "Practice MCQs with spaced repetition. Track weak areas and exam readiness.",
    icon: "🧠",
    color: "bg-blue-50 border-blue-200",
    badge: "AMC Part 1",
  },
  {
    href: "/dashboard/cat2",
    title: "AMC CAT 2 — Clinical",
    subtitle: "AI Patient Role-Play",
    desc: "Simulate OSCE consultations with an AI patient. Receive structured examiner feedback.",
    icon: "🩺",
    color: "bg-green-50 border-green-200",
    badge: "AMC Part 2",
  },
  {
    href: "/dashboard/reference",
    title: "Reference Library",
    subtitle: "Murtagh · RACGP Red Book · AMC",
    desc: "Clinical summaries, preventive care guidelines, and AMC exam blueprints.",
    icon: "📖",
    color: "bg-purple-50 border-purple-200",
    badge: "Resources",
  },
];

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
      <p className="text-gray-500 text-sm mb-8">Choose a module to continue your preparation.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`border rounded-2xl p-6 hover:shadow-md transition ${m.color}`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{m.icon}</span>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border">
                {m.badge}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{m.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{m.subtitle}</p>
            <p className="text-sm text-gray-600">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
