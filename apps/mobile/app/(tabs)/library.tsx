import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Resource = { title: string; desc: string; url: string; icon: string; color: string };
type Section = { heading: string; items: Resource[] };

const SECTIONS: Section[] = [
  {
    heading: 'AMC Official',
    items: [
      { title: 'AMC CAT 1 Info', desc: 'Computer adaptive test — format, fees, booking', url: 'https://www.amc.org.au/assessment/amc-computer-adaptive-test/', icon: 'desktop-outline', color: '#7c3aed' },
      { title: 'AMC CAT 2 Clinical', desc: 'OSCE exam — stations, skills, registration', url: 'https://www.amc.org.au/assessment/amc-clinical-examination/', icon: 'people-outline', color: '#ec4899' },
      { title: 'AMC Handbook', desc: 'Core curriculum: medical knowledge & clinical skills', url: 'https://www.amc.org.au/assessment/the-amc-clinical-examination/preparation/', icon: 'book-outline', color: '#0ea5e9' },
      { title: 'AMC Question Bank', desc: 'Official practice questions from AMC', url: 'https://www.amc.org.au/assessment/amc-computer-adaptive-test/preparation/', icon: 'help-circle-outline', color: '#10b981' },
    ],
  },
  {
    heading: 'Registration & Jobs',
    items: [
      { title: 'AHPRA Registration', desc: 'Apply for medical registration in Australia', url: 'https://www.ahpra.gov.au/Registration/New-Registrants.aspx', icon: 'shield-checkmark-outline', color: '#f59e0b' },
      { title: 'OTS Assessment', desc: 'Overseas trained specialist pathway', url: 'https://www.health.gov.au/topics/doctors-and-specialists/overseas-trained-specialists', icon: 'medal-outline', color: '#f97316' },
      { title: 'IMG Guide (IMGConnect)', desc: 'Step-by-step guide for IMGs in Australia', url: 'https://www.imgconnect.com.au', icon: 'map-outline', color: '#3b82f6' },
      { title: 'DoctorConnect', desc: 'Govt portal: DPA areas, bonded scholarships', url: 'https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator', icon: 'location-outline', color: '#8b5cf6' },
    ],
  },
  {
    heading: 'Clinical References',
    items: [
      { title: 'eTG (Therapeutic Guidelines)', desc: 'Australian prescribing & treatment guidelines', url: 'https://www.tg.org.au', icon: 'medical-outline', color: '#10b981' },
      { title: 'AMH (Australian Medicines Handbook)', desc: 'Drug reference for Australian clinical practice', url: 'https://amhonline.amh.net.au', icon: 'flask-outline', color: '#06b6d4' },
      { title: 'UpToDate', desc: 'Clinical decision support resource', url: 'https://www.uptodate.com', icon: 'search-outline', color: '#6366f1' },
      { title: 'RACGP Guidelines', desc: 'General practice clinical guidelines', url: 'https://www.racgp.org.au/clinical-resources/clinical-guidelines', icon: 'document-text-outline', color: '#f59e0b' },
    ],
  },
  {
    heading: 'Exam Preparation',
    items: [
      { title: 'AMCQuestions.com', desc: 'Popular CAT 1 question bank', url: 'https://www.amcquestions.com', icon: 'checkmark-circle-outline', color: '#7c3aed' },
      { title: 'PassMedicine AMC', desc: 'Question bank tailored for AMC CAT 1', url: 'https://www.passmedicine.com/amc', icon: 'trophy-outline', color: '#ec4899' },
      { title: 'AMC Facebook Groups', desc: 'Community support and discussion', url: 'https://www.facebook.com/groups/amccatexam/', icon: 'people-circle-outline', color: '#0ea5e9' },
      { title: 'Mostly Medicine Website', desc: 'Full platform with more features', url: 'https://mostlymedicine.com', icon: 'globe-outline', color: '#10b981' },
    ],
  },
];

export default function LibraryScreen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Library</Text>
            <Text style={s.sub}>AMC resources & references</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
          {SECTIONS.map((section) => (
            <View key={section.heading} style={{ marginBottom: 24 }}>
              <Text style={s.sectionTitle}>{section.heading}</Text>
              {section.items.map((item) => (
                <TouchableOpacity key={item.title} style={s.card} onPress={() => Linking.openURL(item.url)} activeOpacity={0.7}>
                  <View style={[s.iconBox, { backgroundColor: item.color + '22' }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <Text style={s.cardDesc}>{item.desc}</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color="#475569" />
                </TouchableOpacity>
              ))}
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
  title: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9', marginBottom: 2 },
  cardDesc: { fontSize: 12, color: '#64748b', lineHeight: 16 },
});
