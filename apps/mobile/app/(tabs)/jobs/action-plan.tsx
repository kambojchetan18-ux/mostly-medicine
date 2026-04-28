import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

type Step = {
  step: number;
  title: string;
  urgency: 'high' | 'medium' | 'low';
  timeEstimate: string;
  description: string;
  link?: string;
  linkText?: string;
  isWarning?: boolean;
};

type Profile = {
  doctor_type: string | null;
  amc_part1_status: string | null;
  amc_part2_status: string | null;
  ahpra_status: string | null;
  english_test: string | null;
  visa_type: string | null;
  location_preference: string | null;
};

function buildPlan(profile: Profile): Step[] {
  if (profile.doctor_type === 'non_doctor') {
    return [{
      step: 1, title: 'AMC Requires Medical Degree',
      urgency: 'high', timeEstimate: 'Review now',
      description: 'The AMC pathway is for qualified medical doctors (MBBS/MD). If you are a healthcare professional (nurse, pharmacist, etc.), you follow different registration pathways through AHPRA directly.',
      link: 'https://www.ahpra.gov.au', linkText: 'AHPRA Website', isWarning: true,
    }];
  }

  const steps: Step[] = [];

  if (profile.english_test === 'not_done' || !profile.english_test) {
    steps.push({ step: steps.length + 1, title: 'Sit English Language Test', urgency: 'high', timeEstimate: '2–4 weeks to prepare', description: 'AHPRA requires OET (Medicine) with Grade B in all components, or IELTS Academic with 7.0 in each band. OET is preferred for medical graduates.', link: 'https://www.occupationalenglishtest.org', linkText: 'OET Website' });
  }

  if (profile.amc_part1_status !== 'passed') {
    steps.push({ step: steps.length + 1, title: 'Pass AMC Part 1 (AMC MCQ)', urgency: 'high', timeEstimate: '3–6 months preparation', description: 'Computer Adaptive Test — 150 MCQ questions on clinical medicine. Recommended: 3–6 months study with question banks. Use Mostly Medicine AMC MCQ to practise daily.', link: 'https://www.amc.org.au/assessment/amc-computer-adaptive-test/', linkText: 'AMC MCQ Info' });
  }

  if (profile.amc_part1_status === 'passed' && profile.amc_part2_status !== 'passed') {
    steps.push({ step: steps.length + 1, title: 'Pass AMC Part 2 (Clinical)', urgency: 'high', timeEstimate: '3–4 months preparation', description: 'OSCE-style clinical exam — 16 stations. Tests history-taking, examination, clinical reasoning, and communication. Prepare with clinical skills workshops.', link: 'https://www.amc.org.au/assessment/amc-clinical-examination/', linkText: 'AMC Clinical Exam' });
  }

  if (profile.ahpra_status !== 'registered') {
    steps.push({ step: steps.length + 1, title: 'Apply for AHPRA Registration', urgency: profile.amc_part2_status === 'passed' ? 'high' : 'medium', timeEstimate: '4–8 weeks processing', description: 'Apply online with AMC certificate, identity documents, police check (Australian + home country), and 3 referee reports from supervisors.', link: 'https://www.ahpra.gov.au/Registration/New-Registrants.aspx', linkText: 'AHPRA Registration' });
  }

  if (profile.doctor_type === 'specialist') {
    steps.push({ step: steps.length + 1, title: 'Apply for OTS Assessment', urgency: 'medium', timeEstimate: '3–12 months', description: 'Contact the relevant specialist college for Overseas Trained Specialist (OTS) assessment. Timeframe varies by college (RACP, RACS, RANZCOG, etc.).', link: 'https://www.health.gov.au/topics/doctors-and-specialists/overseas-trained-specialists', linkText: 'OTS Information' });
  } else {
    steps.push({ step: steps.length + 1, title: 'Apply to RMO Pools', urgency: 'medium', timeEstimate: 'Pools open Jan–April', description: `Apply to ${profile.location_preference ?? 'your preferred state'} health service RMO pool. Have your CV, referee contacts, and AHPRA registration ready.` });
    steps.push({ step: steps.length + 1, title: profile.doctor_type === 'gp' ? 'GP College Application' : 'Gain PGY Experience', urgency: 'low', timeEstimate: '1–3 years', description: profile.doctor_type === 'gp' ? 'Apply to RACGP or ACRRM GP training program after completing PGY1–2 years. Consider DPA positions for obligation requirements.' : 'Complete PGY1 (intern) and PGY2 years. Build Australian clinical experience across rotations to strengthen future applications.' });
  }

  return steps;
}

const URGENCY_COLOR: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const URGENCY_BG: Record<string, string> = { high: '#7f1d1d', medium: '#713f12', low: '#064e3b' };

export default function ActionPlanScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('img_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (!data) { setNoProfile(true); } else { setProfile(data); }
      setLoading(false);
    }
    load();
  }, []);

  const steps = profile ? buildPlan(profile) : [];

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={s.title}>My Action Plan</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {loading ? (
            <ActivityIndicator color="#7c3aed" style={{ marginTop: 80 }} />
          ) : noProfile ? (
            <View style={s.noProfile}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
              <Text style={s.noProfileTitle}>Set Up Your Profile</Text>
              <Text style={s.noProfileSub}>Upload your CV on the website to get a personalised step-by-step action plan tailored to your background.</Text>
              <TouchableOpacity style={s.ctaBtn} onPress={() => Linking.openURL('https://mostlymedicine.com/dashboard/jobs/action-plan')}>
                <Text style={s.ctaBtnText}>Set Up on Website</Text>
                <Ionicons name="open-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            steps.map((st) => (
              <View key={st.step} style={[s.stepCard, st.isWarning && s.warningCard]}>
                <View style={s.stepTop}>
                  <View style={s.stepNum}>
                    <Text style={s.stepNumText}>{st.step}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.stepTitle}>{st.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      <View style={[s.urgencyBadge, { backgroundColor: URGENCY_BG[st.urgency] }]}>
                        <Text style={[s.urgencyText, { color: URGENCY_COLOR[st.urgency] }]}>{st.urgency.toUpperCase()}</Text>
                      </View>
                      <Text style={s.timeEst}>{st.timeEstimate}</Text>
                    </View>
                  </View>
                </View>
                <Text style={s.desc}>{st.description}</Text>
                {st.link && (
                  <TouchableOpacity style={s.linkBtn} onPress={() => Linking.openURL(st.link!)}>
                    <Ionicons name="open-outline" size={13} color="#a78bfa" />
                    <Text style={s.linkBtnText}>{st.linkText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

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
  noProfile: { margin: 24, alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 20, padding: 32, borderWidth: 1, borderColor: '#334155' },
  noProfileTitle: { fontSize: 20, fontWeight: '800', color: '#f1f5f9', marginBottom: 10 },
  noProfileSub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  stepCard: { marginHorizontal: 16, marginBottom: 14, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  warningCard: { borderColor: '#ef4444', backgroundColor: '#1c0a0a' },
  stepTop: { flexDirection: 'row', gap: 14, marginBottom: 10 },
  stepNum: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2e1065', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 15, fontWeight: '800', color: '#a78bfa' },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#f1f5f9' },
  urgencyBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  urgencyText: { fontSize: 10, fontWeight: '700' },
  timeEst: { fontSize: 11, color: '#64748b', lineHeight: 18 },
  desc: { fontSize: 13, color: '#94a3b8', lineHeight: 19 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  linkBtnText: { fontSize: 12, color: '#a78bfa', fontWeight: '600' },
});
