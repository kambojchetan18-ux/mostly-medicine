import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CARDS = [
  {
    icon: 'briefcase' as const,
    color: '#7c3aed',
    label: 'RMO Pools',
    sub: 'State-by-state pools — NSW, VIC, QLD, WA & more',
    route: '/(tabs)/jobs/rmo',
  },
  {
    icon: 'medical' as const,
    color: '#10b981',
    label: 'GP Pathway',
    sub: 'RACGP/ACRRM fellowship, DPA, bonded positions',
    route: '/(tabs)/jobs/gp',
  },
  {
    icon: 'school' as const,
    color: '#ec4899',
    label: 'Specialist Pathway',
    sub: 'College OTS assessment, fellowship & training',
    route: '/(tabs)/jobs/specialist',
  },
  {
    icon: 'list' as const,
    color: '#f59e0b',
    label: 'My Action Plan',
    sub: 'Personalised step-by-step roadmap',
    route: '/(tabs)/jobs/action-plan',
  },
];

const QUICK_LINKS = [
  { label: 'Health Workforce Online', url: 'https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator' },
  { label: 'AHPRA Registration', url: 'https://www.ahpra.gov.au' },
  { label: 'AMC Website', url: 'https://www.amc.org.au' },
  { label: 'DoctorConnect', url: 'https://www.health.gov.au/topics/health-workforce/health-workforce-programs/doctorconnect' },
];

export default function JobsScreen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          <View style={s.header}>
            <Text style={s.title}>Australian Jobs</Text>
            <Text style={s.sub}>IMG pathways & job boards</Text>
          </View>

          {CARDS.map((c) => (
            <TouchableOpacity key={c.label} style={s.card} onPress={() => router.push(c.route as any)}>
              <View style={[s.iconBox, { backgroundColor: c.color + '22' }]}>
                <Ionicons name={c.icon} size={26} color={c.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardLabel}>{c.label}</Text>
                <Text style={s.cardSub}>{c.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#475569" />
            </TouchableOpacity>
          ))}

          <Text style={s.sectionLabel}>Quick Links</Text>

          {QUICK_LINKS.map((l) => (
            <TouchableOpacity key={l.label} style={s.linkRow} onPress={() => Linking.openURL(l.url)}>
              <Ionicons name="open-outline" size={16} color="#64748b" />
              <Text style={s.linkText}>{l.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Agencies */}
          <Text style={s.sectionLabel}>Recruitment Agencies</Text>
          <View style={s.agencyGrid}>
            {[
              { name: 'Ochre Health', url: 'https://ochrehealth.com.au' },
              { name: 'Avant Mutual', url: 'https://www.avant.org.au' },
              { name: 'Medrecruit', url: 'https://medrecruit.medworld.com' },
              { name: 'Wavelength', url: 'https://www.wavelength.com.au' },
            ].map((a) => (
              <TouchableOpacity key={a.name} style={s.agencyCard} onPress={() => Linking.openURL(a.url)}>
                <Text style={s.agencyName}>{a.name}</Text>
                <Ionicons name="open-outline" size={14} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  card: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', gap: 14,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#f1f5f9', marginBottom: 3 },
  cardSub: { fontSize: 12, color: '#64748b', lineHeight: 17 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginTop: 8, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  linkText: { fontSize: 14, color: '#94a3b8', flex: 1 },
  agencyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  agencyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#334155',
  },
  agencyName: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
});
