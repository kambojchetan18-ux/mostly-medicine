import Link from "next/link";

const topics = [
  "Cardiovascular", "Respiratory", "Gastroenterology", "Neurology",
  "Endocrinology", "Musculoskeletal", "Psychiatry", "Obstetrics & Gynaecology",
  "Paediatrics", "Infectious Disease", "Renal", "Haematology",
];

export default function CAT1Page() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC CAT 1 — MCQ Practice</h2>
      <p className="text-gray-500 text-sm mb-6">
        Select a topic or start a timed mock exam. Questions follow AMC exam blueprint.
      </p>

      <div className="flex gap-3 mb-8">
        <button className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition">
          Start Mock Exam (180 min)
        </button>
        <button className="border border-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
          Quick Quiz (20 questions)
        </button>
      </div>

      <h3 className="font-semibold text-gray-700 mb-3">Practice by Topic</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {topics.map((topic) => (
          <button
            key={topic}
            className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-brand-400 hover:bg-brand-50 transition"
          >
            <p className="font-medium text-gray-800 text-sm">{topic}</p>
            <p className="text-xs text-gray-400 mt-1">0 / 50 done</p>
          </button>
        ))}
      </div>
    </div>
  );
}
