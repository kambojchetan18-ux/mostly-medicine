import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const topics = [
  "Cardiovascular", "Respiratory", "Gastroenterology", "Neurology",
  "Endocrinology", "Musculoskeletal", "Psychiatry", "Obstetrics & Gynaecology",
  "Paediatrics", "Infectious Disease", "Renal", "Haematology",
];

export default function CAT1Screen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>AMC CAT 1 — MCQ Practice</Text>
      <Text style={styles.subtitle}>Select a topic or start a mock exam</Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Start Mock Exam (180 min)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Quick Quiz (20 questions)</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Practice by Topic</Text>
      <View style={styles.topicGrid}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            style={[styles.topicCard, { minWidth: "45%" }]}
          >
            <Text style={styles.topicName}>{topic}</Text>
            <Text style={styles.topicProgress}>0 / 50 done</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 12,
  },
  topicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  topicCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topicName: {
    fontWeight: "500",
    color: "#1f2937",
    fontSize: 14,
  },
  topicProgress: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});
