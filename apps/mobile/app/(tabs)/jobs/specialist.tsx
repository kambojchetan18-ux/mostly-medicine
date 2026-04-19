import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLLEGES = [
  { name: 'RACP', full: 'Royal Australasian College of Physicians', url: 'https://www.racp.edu.au', specialties: 'Internal Medicine, Paediatrics, Neurology, Cardiology...' },
  { name: 'RACS', full: 'Royal Australasian College of Surgeons', url: 'https://www.surgeons.org', specialties: 'General, Cardiothoracic, Vascular, Orthopaedic...' },
  { name: 'RANZCOG', full: 'Royal Australian & NZ College of Obs & Gyn', url: 'https://ranzcog.edu.au', specialties: 'Obstetrics, Gynaecology, Maternal-Fetal Medicine' },
  { name: 'RANZCP', full: 'Royal Australian & NZ College of Psychiatrists', url: 'https://www.ranzcp.org', specialties: 'General Psychiatry, Child, Forensic, Old Age' },
  { name: 'ACEM', full: 'Australasian College for Emergency Medicine', url: 'https://acem.org.au', specialties: 'Emergency Medicine' },
  { name: 'RANZCR', full: 'Royal Australian & NZ College of Radiologists', url: 'https://www.ranzcr.com', specialties: 'Radiology, Radiation Oncology' },
  { name: 'RCPA', full: 'Royal College of Pathologists Australasia', url: 'https://www.rcpa.edu.au', specialties: 'Anatomical Pathology, Haematology, Microbiology...' },
  { name: 'ANZCA', full: 'Australian & NZ College of Anaesthetists', url: 'https://www.anzca.edu.au', specialties: 'Anaesthesia, Pain Medicine' },
];

const STEPS = [
  { title: 'AMC & AHPRA', body: 'Complete AMC exams and obtain general registration.' },
  { title: 'RMO Experience', body: 'Work as RMO for 1–3 years in your chosen specialty.' },
  { title: 'OTS Application', body: 'Apply for Overseas Trained Specialist (OTS) assessment with the relevant college. Timelines vary: 3–12 months.' },
  { title: 'Assessment Pathway', body: 'May include interview, supervised practice period (6–24 months), or direct fellowship by recognition.' },
  { title: 'Fellowship', body: 'Fellowship granted. Can work as specialist with Medicare provider number.' },
];

export default function SpecialistScreen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={s.title}>Specialist Pathway</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          <View style={s.infoCard}>
            <Text style={s.infoTitle}>Overseas Trained Specialists (OTS)</Text>
            <Text style={s.infoBody}>If you hold a specialist qualification overseas (FRCS, DNB, DM, etc.), you can apply for assessment directly with the relevant Australian college rather than going through RMO → training program from scratch.</Text>
          </View>

          <Text style={s.sectionLabel}>OTS Assessment Steps</Text>
          {STEPS.map((st, i) => (
            <View key={i} style={s.stepCard}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.stepTitle}>{st.title}</Text>
                <Text style={s.stepBody}>{st.body}</Text>
              </View>
            </View>
          ))}

          <Text style={s.sectionLabel}>College Directory</Text>
          {COLLEGES.map((c) => (
            <TouchableOpacity key={c.name} style={s.collegeCard} onPress={() => Linking.openURL(c.url)}>
              <View style={s.collegeBadge}>
                <Text style={s.collegeBadgeText}>{c.name}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.collegeFull}>{c.full}</Text>
                <Text style={s.collegeSpec}>{c.specialties}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#64748b" />
            </TouchableOpacity>
          ))}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 12 },
  back: { padding: 4 },
  title: { fontSize: 22, fontWeight: '800', color: '#f1f5f9' },
  infoCard: { marginHorizontal: 16, marginBottom: 20, backgroundColor: '#1e1b4b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#4c1d95' },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#e9d5ff', marginBottom: 8 },
  infoBody: { fontSize: 13, color: '#a78bfa', lineHeight: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  stepCard: { flexDirection: 'row', gap: 14, marginHorizontal: 16, marginBottom: 12, backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155' },
  stepNum: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2e1065', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 15, fontWeight: '800', color: '#a78bfa' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  stepBody: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
  collegeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 10, backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155' },
  collegeBadge: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, minWidth: 56, alignItems: 'center' },
  collegeBadgeText: { fontSize: 11, fontWeight: '800', color: '#a78bfa' },
  collegeFull: { fontSize: 13, fontWeight: '600', color: '#f1f5f9', marginBottom: 2 },
  collegeSpec: { fontSize: 11, color: '#64748b', lineHeight: 15 },
});
