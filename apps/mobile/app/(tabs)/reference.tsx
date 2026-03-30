import { View, Text, ScrollView, StyleSheet } from "react-native";

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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Reference Library</Text>
      <Text style={styles.subtitle}>
        Clinical guidelines grounding your AMC preparation.
      </Text>

      {references.map((ref) => (
        <View
          key={ref.title}
          style={[styles.card, { backgroundColor: ref.bg, borderColor: ref.border }]}
        >
          <Text style={styles.cardIcon}>{ref.icon}</Text>
          <Text style={styles.cardTitle}>{ref.title}</Text>
          <Text style={styles.cardSubtitle}>{ref.subtitle}</Text>
          <View style={styles.tagRow}>
            {ref.topics.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#4b5563",
  },
});
