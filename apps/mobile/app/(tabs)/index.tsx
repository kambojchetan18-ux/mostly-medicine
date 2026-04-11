import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const modules = [
  {
    route: "/(tabs)/cat1" as const,
    title: "AMC CAT 1",
    subtitle: "MCQ Practice",
    desc: "Practice questions with spaced repetition",
    icon: "🧠",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    route: "/(tabs)/cat2" as const,
    title: "AMC CAT 2",
    subtitle: "AI Clinical Role-Play",
    desc: "OSCE simulation with AI patient and examiner feedback",
    icon: "🩺",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    route: "/(tabs)/reference" as const,
    title: "Reference",
    subtitle: "Murtagh · Red Book · AMC",
    desc: "Clinical guidelines and exam blueprints",
    icon: "📖",
    bg: "#faf5ff",
    border: "#e9d5ff",
  },
  {
    route: "/(tabs)/jobs" as const,
    title: "AU Jobs",
    subtitle: "RMO & GP Pathways",
    desc: "Australian medical job picks and readiness tracker",
    icon: "💼",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Mostly Medicine</Text>
        <Text style={styles.subtitle}>AMC Exam Prep for IMGs</Text>
      </View>

      {modules.map((m) => (
        <TouchableOpacity
          key={m.route}
          onPress={() => router.push(m.route)}
          style={[styles.card, { backgroundColor: m.bg, borderColor: m.border }]}
        >
          <Text style={styles.cardIcon}>{m.icon}</Text>
          <Text style={styles.cardTitle}>{m.title}</Text>
          <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
          <Text style={styles.cardDesc}>{m.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1 },
  cardIcon: { fontSize: 30, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  cardSubtitle: { fontSize: 14, color: "#6b7280" },
  cardDesc: { fontSize: 14, color: "#4b5563", marginTop: 4 },
});
