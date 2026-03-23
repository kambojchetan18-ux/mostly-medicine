const references = [
  {
    title: "RACGP Red Book",
    subtitle: "Guidelines for Preventive Activities in General Practice",
    topics: ["Cancer screening", "Cardiovascular risk", "Immunisation", "Mental health screening"],
    icon: "📕",
    color: "border-red-200 bg-red-50",
  },
  {
    title: "John Murtagh's General Practice",
    subtitle: "Diagnostic approach, symptom-based clinical summaries",
    topics: ["Chest pain", "Headache", "Back pain", "Abdominal pain", "Skin conditions"],
    icon: "📗",
    color: "border-green-200 bg-green-50",
  },
  {
    title: "AMC Exam Guidelines",
    subtitle: "Official AMC CAT 1 & CAT 2 blueprints and marking criteria",
    topics: ["Exam format", "Clinical competencies", "Marking rubric", "Topic weighting"],
    icon: "📘",
    color: "border-blue-200 bg-blue-50",
  },
];

export default function ReferencePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Reference Library</h2>
      <p className="text-gray-500 text-sm mb-6">
        Clinical guidelines and exam resources grounding your preparation.
      </p>

      <div className="space-y-4">
        {references.map((ref) => (
          <div key={ref.title} className={`border rounded-2xl p-6 ${ref.color}`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{ref.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{ref.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{ref.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {ref.topics.map((t) => (
                    <span
                      key={t}
                      className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
