import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>AMC CAT 2 — Clinical Role-Play</Text>
      <Text style={styles.subtitle}>
        AI plays the patient. Receive examiner feedback based on AMC marking criteria.
      </Text>

      {scenarios.map((s) => (
        <TouchableOpacity
          key={s.id}
          onPress={() => router.push(`/roleplay/${s.id}` as any)}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🩺</Text>
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
          <Text style={styles.cardTitle}>{s.title}</Text>
          <Text style={styles.cardCategory}>{s.category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#111827",
  },
  cardCategory: {
    fontSize: 14,
    color: "#6b7280",
  },
});
