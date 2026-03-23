import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const topics = [
  "Cardiovascular", "Respiratory", "Gastroenterology", "Neurology",
  "Endocrinology", "Musculoskeletal", "Psychiatry", "Obstetrics & Gynaecology",
  "Paediatrics", "Infectious Disease", "Renal", "Haematology",
];

export default function CAT1Screen() {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold text-gray-900 mb-1">AMC CAT 1 — MCQ Practice</Text>
      <Text className="text-sm text-gray-500 mb-5">Select a topic or start a mock exam</Text>

      <TouchableOpacity className="bg-brand-600 rounded-xl py-3 mb-3 items-center">
        <Text className="text-white font-bold">Start Mock Exam (180 min)</Text>
      </TouchableOpacity>
      <TouchableOpacity className="border border-gray-300 rounded-xl py-3 mb-6 items-center">
        <Text className="text-gray-700 font-semibold">Quick Quiz (20 questions)</Text>
      </TouchableOpacity>

      <Text className="text-sm font-semibold text-gray-600 mb-3">Practice by Topic</Text>
      <View className="flex-row flex-wrap gap-3">
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3"
            style={{ minWidth: "45%" }}
          >
            <Text className="font-medium text-gray-800 text-sm">{topic}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">0 / 50 done</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
