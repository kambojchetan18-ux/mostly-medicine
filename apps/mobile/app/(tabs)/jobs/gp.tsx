import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const STEPS = [
  {
    n: 1, title: 'AMC Part 1 & Part 2',
    body: 'Complete both AMC exams. Part 1 is MCQ (CAT 1); Part 2 is clinical (OSCE). Both required before GP training.',
    color: '#7c3aed',
  },
  {
    n: 2, title: 'AHPRA Registration',
    body: 'Apply for general registration as a medical practitioner. Need AMC pass, English proof, police check, references.',
    color: '#3b82f6',
    url: 'https://www.ahpra.gov.au',
    urlLabel: 'AHPRA Website',
  },
  {
    n: 3, title: 'RMO / PGY1–2 Experience',
    body: 'Work as an RMO for 1–2 years. Builds Australian clinical experience required for GP college application.',
    color: '#10b981',
  },
  {
    n: 4, title: 'Choose Fellowship College',
    body: 'RACGP (Fellowship of RACGP — FRACGP) or ACRRM (Fellowship of ACRRM — FACRRM). Both open to IMGs via specific pathways.',
    color: '#f59e0b',
  },
  {
    n: 5, title: 'PESCI Assessment',
    body: 'Structured clinical interview specific to GP training selection. Tests clinical reasoning and professional attributes.',
    color: '#ec4899',
    url: 'https://www.racgp.org.au/education/img/fellowship-pathways',
    urlLabel: 'RACGP Fellowship Pathways',
  },
  {
    n: 6, title: 'DPA / Bonded Position',
    body: 'Work in a Distribution Priority Area (DPA) to count toward your 10-year moratorium obligation if on a section 19AB exemption.',
    color: '#0ea5e9',
    url: 'https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator',
    urlLabel: 'Health Workforce Locator',
  },
];

const ACRRM_STEPS = [
  'Core Generallist Training (CGT) — 4 years minimum',
  'Advanced Specialised Training (AST) — optional',
  'IMG Pathway available — experience recognition',
  'Rural generalist pathway with full scope',
];

export default function GPScreen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={s.title}>GP Pathway</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          <View style={s.timelineCard}>
            <Text style={s.timelineTitle}>Timeline: 4–6 years from arrival</Text>
            <Text style={s.timelineSub}>AMC → AHPRA → RMO (1–2 yr) → GP Training (3 yr) → Fellowship</Text>
          </View>

          <Text style={s.sectionLabel}>Fellowship Steps</Text>

          {STEPS.map((st) => (
            <View key={st.n} style={s.stepCard}>
              <View style={[s.stepNum, { backgroundColor: st.color + '22' }]}>
                <Text style={[s.stepNumText, { color: st.color }]}>{st.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.stepTitle}>{st.title}</Text>
                <Text style={s.stepBody}>{st.body}</Text>
                {st.url && (
                  <TouchableOpacity style={s.linkBtn} onPress={() => Linking.openURL(st.url!)}>
                    <Ionicons name="open-outline" size={13} color="#a78bfa" />
                    <Text style={s.linkBtnText}>{st.urlLabel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <Text style={s.sectionLabel}>ACRRM (Rural Generalist)</Text>
          <View style={s.acrrm}>
            {ACRRM_STEPS.map((t, i) => (
              <View key={i} style={s.tipRow}>
                <Text style={s.tipDot}>•</Text>
                <Text style={s.tipText}>{t}</Text>
              </View>
            ))}
            <TouchableOpacity style={s.linkBtn} onPress={() => Linking.openURL('https://www.acrrm.org.au/international-graduates/')}>
              <Ionicons name="open-outline" size={13} color="#a78bfa" />
              <Text style={s.linkBtnText}>ACRRM IMG Pathway</Text>
            </TouchableOpacity>
          </View>

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
  timelineCard: { marginHorizontal: 16, marginBottom: 20, backgroundColor: '#1e1b4b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#4c1d95' },
  timelineTitle: { fontSize: 15, fontWeight: '700', color: '#e9d5ff', marginBottom: 6 },
  timelineSub: { fontSize: 12, color: '#a78bfa', lineHeight: 18 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  stepCard: {
    flexDirection: 'row', gap: 14, marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155',
  },
  stepNum: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 16, fontWeight: '800' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  stepBody: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  linkBtnText: { fontSize: 12, color: '#a78bfa', fontWeight: '600' },
  acrrm: { marginHorizontal: 16, backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#334155' },
  tipRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  tipDot: { color: '#7c3aed', fontSize: 14, lineHeight: 19 },
  tipText: { fontSize: 13, color: '#94a3b8', flex: 1, lineHeight: 19 },
});
