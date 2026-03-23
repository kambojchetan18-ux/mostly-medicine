import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const modules = [
  {
    route: "/(tabs)/cat1",
    title: "AMC CAT 1",
    subtitle: "MCQ Practice",
    desc: "Practice questions with spaced repetition",
    icon: "🧠",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    route: "/(tabs)/cat2",
    title: "AMC CAT 2",
    subtitle: "AI Clinical Role-Play",
    desc: "OSCE simulation with AI patient and examiner feedback",
    icon: "🩺",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    route: "/(tabs)/reference",
    title: "Reference",
    subtitle: "Murtagh · Red Book · AMC",
    desc: "Clinical guidelines and exam blueprints",
    icon: "📖",
    bg: "#faf5ff",
    border: "#e9d5ff",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Mostly Medicine</Text>
        <Text className="text-sm text-gray-500 mt-1">AMC Exam Prep for IMGs</Text>
      </View>

      {modules.map((m) => (
        <TouchableOpacity
          key={m.route}
          onPress={() => router.push(m.route as any)}
          style={{ backgroundColor: m.bg, borderColor: m.border, borderWidth: 1 }}
          className="rounded-2xl p-5 mb-4"
        >
          <Text className="text-3xl mb-2">{m.icon}</Text>
          <Text className="text-lg font-bold text-gray-900">{m.title}</Text>
          <Text className="text-sm text-gray-500">{m.subtitle}</Text>
          <Text className="text-sm text-gray-600 mt-1">{m.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
