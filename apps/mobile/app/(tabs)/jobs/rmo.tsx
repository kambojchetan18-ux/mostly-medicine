import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Pool = {
  state: string;
  code: string;
  color: string;
  when: string;
  tips: string[];
  applyUrl: string;
  applyLabel: string;
};

const POOLS: Pool[] = [
  {
    state: 'New South Wales',
    code: 'NSW',
    color: '#3b82f6',
    when: 'Opens ~February each year for Feb intake; rolling for smaller positions',
    tips: [
      'NSW Health Medical Recruitment — largest pool in Australia',
      'Apply early — popular metro hospitals fill fast',
      'You can nominate up to 10 hospital preferences',
    ],
    applyUrl: 'https://www.health.nsw.gov.au/careers/mts',
    applyLabel: 'NSW Medical Training',
  },
  {
    state: 'Victoria',
    code: 'VIC',
    color: '#8b5cf6',
    when: 'Opens March–April for next-year intake; some hospitals recruit independently',
    tips: [
      'Apply via individual hospitals — no central state pool',
      'Alfred, Royal Melbourne, St Vincent\'s most competitive',
      'Check VMET for structured training opportunities',
    ],
    applyUrl: 'https://www.health.vic.gov.au/jobs/find-a-job',
    applyLabel: 'VIC Health Jobs',
  },
  {
    state: 'Queensland',
    code: 'QLD',
    color: '#ec4899',
    when: 'Central pool opens Jan–Feb; rural hospitals recruit year-round',
    tips: [
      'QLD has excellent rural training programs with incentives',
      'Townsville, Cairns, Mackay often have openings mid-year',
      'IMET program for structured IMG training',
    ],
    applyUrl: 'https://smartjobs.qld.gov.au',
    applyLabel: 'Smart Jobs QLD',
  },
  {
    state: 'Western Australia',
    code: 'WA',
    color: '#f59e0b',
    when: 'Central pool Feb–March; rural WA has ongoing vacancies',
    tips: [
      'WA Country Health Service has strong IMG support',
      'WACHS rural positions come with generous packages',
      'Perth metro is competitive — rural WA easier to enter',
    ],
    applyUrl: 'https://www.jobs.health.wa.gov.au',
    applyLabel: 'WA Health Jobs',
  },
  {
    state: 'South Australia',
    code: 'SA',
    color: '#10b981',
    when: 'Central pool opens Feb; SA Health also recruits directly',
    tips: [
      'SA has dedicated IMG recruitment support officers',
      'Regional SA roles at Whyalla, Mt Gambier, Port Augusta',
      'Good pathway to Fellowship through rural exposure',
    ],
    applyUrl: 'https://iworkfor.sa.gov.au',
    applyLabel: 'iWorkFor SA',
  },
  {
    state: 'Northern Territory',
    code: 'NT',
    color: '#ef4444',
    when: 'Year-round recruitment — high demand, fastest pathway',
    tips: [
      'NT has easiest entry for IMGs in Australia',
      'Royal Darwin Hospital is a major tertiary centre',
      'DPA area — counts toward GP pathway bonding requirements',
    ],
    applyUrl: 'https://healthjobs.nt.gov.au',
    applyLabel: 'NT Health Jobs',
  },
  {
    state: 'Australian Capital Territory',
    code: 'ACT',
    color: '#64748b',
    when: 'Opens Jan–Feb; Canberra Hospital only major public hospital',
    tips: [
      'ACT Calvary and Canberra Hospital main employers',
      'Smaller pool — apply early',
      'Good work-life balance; proximity to Sydney',
    ],
    applyUrl: 'https://jobs.act.gov.au',
    applyLabel: 'ACT Government Jobs',
  },
];

export default function RMOScreen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={s.title}>RMO Pools</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {POOLS.map((p) => (
            <View key={p.code} style={s.poolCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                <View style={[s.badge, { backgroundColor: p.color + '22' }]}>
                  <Text style={[s.badgeText, { color: p.color }]}>{p.code}</Text>
                </View>
                <Text style={s.poolName}>{p.state}</Text>
              </View>
              <View style={s.whenRow}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={s.whenText}>{p.when}</Text>
              </View>
              {p.tips.map((tip, i) => (
                <View key={i} style={s.tipRow}>
                  <Text style={s.tipDot}>•</Text>
                  <Text style={s.tipText}>{tip}</Text>
                </View>
              ))}
              <TouchableOpacity style={[s.applyBtn, { borderColor: p.color }]} onPress={() => Linking.openURL(p.applyUrl)}>
                <Text style={[s.applyBtnText, { color: p.color }]}>{p.applyLabel}</Text>
                <Ionicons name="open-outline" size={14} color={p.color} />
              </TouchableOpacity>
            </View>
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
  poolCard: { marginHorizontal: 16, marginBottom: 14, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontSize: 13, fontWeight: '800' },
  poolName: { fontSize: 17, fontWeight: '700', color: '#f1f5f9' },
  whenRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 10 },
  whenText: { fontSize: 12, color: '#64748b', flex: 1, lineHeight: 17 },
  tipRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  tipDot: { color: '#7c3aed', fontSize: 14, lineHeight: 18 },
  tipText: { fontSize: 13, color: '#94a3b8', flex: 1, lineHeight: 18 },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14,
    borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start',
  },
  applyBtnText: { fontSize: 13, fontWeight: '700' },
});
