import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const scenarios = [
  { id: 1, title: "Chest Pain", category: "Cardiovascular", difficulty: "Medium" },
  { id: 2, title: "Shortness of Breath", category: "Respiratory", difficulty: "Hard" },
  { id: 3, title: "Abdominal Pain", category: "Gastroenterology", difficulty: "Medium" },
  { id: 4, title: "Headache", category: "Neurology", difficulty: "Easy" },
  { id: 5, title: "Diabetes Follow-up", category: "Endocrinology", difficulty: "Easy" },
  { id: 6, title: "Postnatal Depression", category: "Psychiatry", difficulty: "Hard" },
];

const difficultyStyle: Record<string, { bg: string; text: string }> = {
  Easy: { bg: "#dcfce7", text: "#15803d" },
  Medium: { bg: "#fef9c3", text: "#a16207" },
  Hard: { bg: "#fee2e2", text: "#b91c1c" },
};

export default function CAT2Screen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold text-gray-900 mb-1">AMC CAT 2 — Clinical Role-Play</Text>
      <Text className="text-sm text-gray-500 mb-5">
        AI plays the patient. Receive examiner feedback based on AMC marking criteria.
      </Text>

      {scenarios.map((s) => (
        <TouchableOpacity
          key={s.id}
          onPress={() => router.push(`/roleplay/${s.id}` as any)}
          className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xl">🩺</Text>
            <View
              style={{
                backgroundColor: difficultyStyle[s.difficulty].bg,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: difficultyStyle[s.difficulty].text, fontSize: 11, fontWeight: "600" }}>
                {s.difficulty}
              </Text>
            </View>
          </View>
          <Text className="font-bold text-gray-900">{s.title}</Text>
          <Text className="text-sm text-gray-500">{s.category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
