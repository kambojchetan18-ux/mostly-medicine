import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";

const readinessItems = [
  { label: "AMC CAT1 (Aug 2024)", done: true },
  { label: "AMC CAT2 (Dec 2025)", done: true },
  { label: "482 Visa — Full Work Rights", done: true },
  { label: "Westmead Observership 2025", done: true },
  { label: "ALS + PALS (Jul 2025)", done: true },
  { label: "AHPRA Registration", done: false },
];

const topPicks = [
  {
    title: "Western Sydney LHD",
    subtitle: "Westmead, Blacktown, Auburn — Priority #1",
    url: "https://www.wslhd.health.nsw.gov.au/",
    badge: "NSW",
    badgeBg: "#dbeafe",
    badgeText: "#1d4ed8",
    demand: "9/10",
  },
  {
    title: "NT Health — Year-round",
    subtitle: "Royal Darwin, Alice Springs — fastest hire",
    url: "https://nt.gov.au/employ/jobs-in-the-nt/health-and-medical-jobs",
    badge: "NT",
    badgeBg: "#fee2e2",
    badgeText: "#b91c1c",
    demand: "10/10",
  },
  {
    title: "WA Country Health (WACHS)",
    subtitle: "Kimberley, Pilbara — IMG priority",
    url: "https://wacountry.health.wa.gov.au/",
    badge: "WA",
    badgeBg: "#fef9c3",
    badgeText: "#a16207",
    demand: "10/10",
  },
  {
    title: "GP Rural — NT (No PESCI)",
    subtitle: "AUD $200K–$350K+ — DWS area, start immediately",
    url: "https://jobs.nt.gov.au/",
    badge: "GP",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    demand: "10/10",
  },
];

const agencies = [
  { name: "Medrecruit", url: "https://www.medrecruit.com.au/" },
  { name: "AHPRA", url: "https://www.ahpra.gov.au/Registration/New-Registrants.aspx" },
  { name: "Wavelength", url: "https://www.wavelength.com.au/" },
  { name: "Rural Health West", url: "https://www.ruralhealthwest.com.au/" },
];

export default function JobsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Australian Medical Jobs</Text>
      <Text style={styles.subtitle}>Dr Amandeep Kamboj — RMO & GP pathways</Text>

      {/* Readiness */}
      <View style={styles.card}>
        <View style={styles.readinessHeader}>
          <Text style={styles.sectionTitle}>Profile Readiness</Text>
          <Text style={styles.readinessScore}>80%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "80%" }]} />
        </View>
        <View style={styles.blockerBox}>
          <Text style={styles.blockerText}>⏳ Only blocker: AHPRA Registration</Text>
        </View>
        <View style={styles.pillRow}>
          {readinessItems.map((item) => (
            <View key={item.label} style={[styles.pill, item.done ? styles.pillDone : styles.pillPending]}>
              <Text style={[styles.pillText, item.done ? styles.pillTextDone : styles.pillTextPending]}>
                {item.done ? "✓" : "⏳"} {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Probability */}
      <View style={styles.probRow}>
        {[
          { label: "Westmead", prob: "90–95%", bg: "#f0fdf4", border: "#86efac", text: "#166534" },
          { label: "NT / WA Rural", prob: "80–90%", bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8" },
          { label: "NSW Metro", prob: "65–75%", bg: "#fefce8", border: "#fde047", text: "#854d0e" },
        ].map((p) => (
          <View key={p.label} style={[styles.probCard, { backgroundColor: p.bg, borderColor: p.border }]}>
            <Text style={[styles.probLabel, { color: p.text }]}>{p.label}</Text>
            <Text style={[styles.probValue, { color: p.text }]}>{p.prob}</Text>
          </View>
        ))}
      </View>

      {/* Top Picks */}
      <Text style={styles.sectionTitle}>Top Job Picks</Text>
      {topPicks.map((job) => (
        <TouchableOpacity
          key={job.title}
          style={styles.jobCard}
          onPress={() => Linking.openURL(job.url)}
        >
          <View style={styles.jobHeader}>
            <View style={[styles.badge, { backgroundColor: job.badgeBg }]}>
              <Text style={[styles.badgeText, { color: job.badgeText }]}>{job.badge}</Text>
            </View>
            <Text style={styles.demandText}>Demand {job.demand}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobSubtitle}>{job.subtitle}</Text>
          <Text style={styles.linkText}>Tap to open →</Text>
        </TouchableOpacity>
      ))}

      {/* Agencies */}
      <Text style={styles.sectionTitle}>Recruitment Agencies</Text>
      <View style={styles.agencyGrid}>
        {agencies.map((a) => (
          <TouchableOpacity
            key={a.name}
            style={styles.agencyCard}
            onPress={() => Linking.openURL(a.url)}
          >
            <Text style={styles.agencyName}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Always verify requirements directly with AHPRA, hospitals, and employers.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  title: { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  readinessHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 10 },
  readinessScore: { fontSize: 24, fontWeight: "bold", color: "#0369a1" },
  progressBar: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 999, marginBottom: 10 },
  progressFill: { height: 8, backgroundColor: "#0369a1", borderRadius: 999 },
  blockerBox: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fcd34d", borderRadius: 10, padding: 10, marginBottom: 10 },
  blockerText: { fontSize: 13, color: "#92400e", fontWeight: "600" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  pillDone: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  pillPending: { backgroundColor: "#fffbeb", borderColor: "#fcd34d" },
  pillText: { fontSize: 11, fontWeight: "600" },
  pillTextDone: { color: "#166534" },
  pillTextPending: { color: "#92400e" },
  probRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  probCard: { flex: 1, borderRadius: 12, padding: 10, borderWidth: 1, alignItems: "center" },
  probLabel: { fontSize: 10, fontWeight: "600", marginBottom: 2, textAlign: "center" },
  probValue: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  jobCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  demandText: { fontSize: 12, color: "#6b7280" },
  jobTitle: { fontWeight: "bold", color: "#111827", fontSize: 15 },
  jobSubtitle: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  linkText: { fontSize: 12, color: "#0369a1", marginTop: 8, fontWeight: "600" },
  agencyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  agencyCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  agencyName: { fontSize: 13, fontWeight: "600", color: "#0369a1" },
  disclaimer: { fontSize: 11, color: "#9ca3af", textAlign: "center", paddingBottom: 24 },
});
