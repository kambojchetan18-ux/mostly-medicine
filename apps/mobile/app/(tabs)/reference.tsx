import { View, Text, ScrollView } from "react-native";

const references = [
  {
    title: "RACGP Red Book",
    subtitle: "Preventive Activities in General Practice",
    topics: ["Cancer screening", "Cardiovascular risk", "Immunisation", "Mental health"],
    icon: "📕",
    bg: "#fff1f2",
    border: "#fecdd3",
  },
  {
    title: "John Murtagh's General Practice",
    subtitle: "Diagnostic approach & clinical summaries",
    topics: ["Chest pain", "Headache", "Back pain", "Abdominal pain"],
    icon: "📗",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    title: "AMC Exam Guidelines",
    subtitle: "CAT 1 & CAT 2 blueprints and marking criteria",
    topics: ["Exam format", "Competencies", "Marking rubric", "Topic weighting"],
    icon: "📘",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
];

export default function ReferenceScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold text-gray-900 mb-1">Reference Library</Text>
      <Text className="text-sm text-gray-500 mb-5">
        Clinical guidelines grounding your AMC preparation.
      </Text>

      {references.map((ref) => (
        <View
          key={ref.title}
          style={{ backgroundColor: ref.bg, borderColor: ref.border, borderWidth: 1 }}
          className="rounded-2xl p-5 mb-4"
        >
          <Text className="text-3xl mb-2">{ref.icon}</Text>
          <Text className="font-bold text-gray-900 text-base">{ref.title}</Text>
          <Text className="text-sm text-gray-500 mb-3">{ref.subtitle}</Text>
          <View className="flex-row flex-wrap gap-2">
            {ref.topics.map((t) => (
              <View key={t} className="bg-white border border-gray-200 rounded-full px-3 py-1">
                <Text className="text-xs text-gray-600">{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
