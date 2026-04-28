import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

type Stat = { label: string; value: string | number; color: string };

export default function HomeScreen() {
  const [userName, setUserName] = useState('Doctor');
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'Doctor';
      setUserName(name);

      const [attemptsRes, streakRes, dueRes] = await Promise.all([
        supabase.from('attempts').select('is_correct').eq('user_id', user.id),
        supabase.from('study_streaks').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('sr_cards').select('question_id', { count: 'exact', head: true })
          .eq('user_id', user.id).lte('due', new Date().toISOString()),
      ]);

      const attempts = attemptsRes.data ?? [];
      const total = attempts.length;
      const correct = attempts.filter((a) => a.is_correct).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      setStats([
        { label: 'Questions Done', value: total, color: '#7c3aed' },
        { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 75 ? '#10b981' : accuracy >= 55 ? '#f59e0b' : '#ef4444' },
        { label: 'Day Streak', value: `${streakRes.data?.current_streak ?? 0}🔥`, color: '#f97316' },
        { label: 'Due Today', value: dueRes.count ?? 0, color: '#3b82f6' },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const modules = [
    { label: 'AMC CAT 1', sub: 'MCQ Practice — 3,000+ questions', icon: 'school' as const, color: '#7c3aed', route: '/cat1' },
    { label: 'AMC CAT 2', sub: 'AMC OSCE-style clinical practice', icon: 'medkit' as const, color: '#ec4899', route: '/cat2' },
    { label: 'My Progress', sub: 'Stats, streaks, weak areas', icon: 'bar-chart' as const, color: '#10b981', route: '/progress' },
    { label: 'Australian Jobs', sub: 'RMO · GP · Specialist pathway', icon: 'briefcase' as const, color: '#0ea5e9', route: '/jobs' },
    { label: 'Library', sub: 'AMC resources & references', icon: 'book' as const, color: '#64748b', route: '/library' },
    { label: 'AI Role-Play', sub: 'CAT 2 clinical OSCE scenarios', icon: 'chatbubbles' as const, color: '#8b5cf6', route: '/roleplay' },
  ];

  return (
    <View style={styles.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good day, {userName} 👋</Text>
              <Text style={styles.subGreeting}>AMC Prep 2026</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          {!loading && stats.length > 0 && (
            <View style={styles.statsGrid}>
              {stats.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Quick start */}
          <TouchableOpacity style={styles.quickStart} onPress={() => router.push('/(tabs)/cat1')}>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickTitle}>⚡ Quick Quiz</Text>
              <Text style={styles.quickSub}>20 random CAT 1 questions</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#a78bfa" />
          </TouchableOpacity>

          {/* Modules */}
          <Text style={styles.sectionTitle}>Modules</Text>
          <View style={styles.moduleGrid}>
            {modules.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.moduleCard}
                onPress={() => m.route ? router.push(`/(tabs)${m.route}` as any) : null}
                activeOpacity={m.route ? 0.7 : 0.4}
              >
                <View style={[styles.moduleIcon, { backgroundColor: m.color + '22' }]}>
                  <Ionicons name={m.icon} size={24} color={m.color} />
                </View>
                <Text style={styles.moduleLabel}>{m.label}</Text>
                <Text style={styles.moduleSub}>{m.sub}</Text>
                {!m.route && (
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Coming soon</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#f1f5f9' },
  subGreeting: { fontSize: 12, color: '#64748b', marginTop: 2 },
  logoutBtn: { padding: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '44%', backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  statValue: { fontSize: 26, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  quickStart: {
    marginHorizontal: 16, marginBottom: 24, backgroundColor: '#1e1b4b',
    borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#4c1d95',
  },
  quickTitle: { fontSize: 17, fontWeight: '700', color: '#e9d5ff' },
  quickSub: { fontSize: 12, color: '#7c3aed', marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  moduleCard: { width: '46.5%', backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  moduleIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  moduleLabel: { fontSize: 14, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  moduleSub: { fontSize: 11, color: '#64748b', lineHeight: 15 },
  comingSoon: { marginTop: 8, backgroundColor: '#0f172a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  comingSoonText: { fontSize: 10, color: '#475569', fontWeight: '600' },
});
