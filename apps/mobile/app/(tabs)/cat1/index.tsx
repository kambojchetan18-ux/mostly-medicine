import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { allQuestions } from '@mostly-medicine/content';

type TopicStat = { topic: string; total: number; done: number; correct: number };

const TOPICS = [...new Set(allQuestions.map((q) => q.topic))].sort();

export default function CAT1Screen() {
  const [stats, setStats] = useState<Record<string, { done: number; correct: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data, error } = await supabase
          .from('attempts')
          .select('question_id, is_correct')
          .eq('user_id', user.id);

        if (error) { console.error('[cat1] load error', error.message); setLoading(false); return; }
        if (data) {
          const map: Record<string, { done: number; correct: number }> = {};
          for (const a of data) {
            const q = allQuestions.find((q) => q.id === a.question_id);
            if (!q) continue;
            if (!map[q.topic]) map[q.topic] = { done: 0, correct: 0 };
            map[q.topic].done++;
            if (a.is_correct) map[q.topic].correct++;
          }
          setStats(map);
        }
      } catch (err) {
        console.error('[cat1] unexpected error', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const topicData: TopicStat[] = TOPICS.map((t) => ({
    topic: t,
    total: allQuestions.filter((q) => q.topic === t).length,
    done: stats[t]?.done ?? 0,
    correct: stats[t]?.correct ?? 0,
  }));

  function startQuiz(topic?: string) {
    if (topic) {
      router.push(`/(tabs)/cat1/quiz?topic=${encodeURIComponent(topic)}` as any);
    } else {
      router.push('/(tabs)/cat1/quiz' as any);
    }
  }

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

          <View style={s.header}>
            <Text style={s.title}>AMC CAT 1</Text>
            <Text style={s.sub}>{allQuestions.length.toLocaleString()} questions</Text>
          </View>

          {/* Quick Quiz */}
          <TouchableOpacity style={s.quickCard} onPress={() => startQuiz()}>
            <View style={s.quickIcon}>
              <Ionicons name="flash" size={22} color="#a78bfa" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.quickTitle}>Quick Quiz</Text>
              <Text style={s.quickSub}>20 random questions from all topics</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#64748b" />
          </TouchableOpacity>

          <Text style={s.sectionLabel}>Topics</Text>

          {loading ? (
            <ActivityIndicator color="#7c3aed" style={{ marginTop: 40 }} />
          ) : (
            topicData.map((t) => {
              const accuracy = t.done > 0 ? Math.round((t.correct / t.done) * 100) : null;
              const progress = t.done / t.total;
              const accColor = accuracy === null ? '#64748b' : accuracy >= 75 ? '#10b981' : accuracy >= 55 ? '#f59e0b' : '#ef4444';
              return (
                <TouchableOpacity key={t.topic} style={s.topicCard} onPress={() => startQuiz(t.topic)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.topicName}>{t.topic}</Text>
                    <Text style={s.topicCount}>{t.done}/{t.total} done</Text>
                    {/* Progress bar */}
                    <View style={s.barBg}>
                      <View style={[s.barFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: '#7c3aed' }]} />
                    </View>
                  </View>
                  {accuracy !== null && (
                    <Text style={[s.accuracy, { color: accColor }]}>{accuracy}%</Text>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#475569" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              );
            })
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  quickCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 16,
    backgroundColor: '#1e1b4b', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#4c1d95', gap: 12,
  },
  quickIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2e1065', justifyContent: 'center', alignItems: 'center' },
  quickTitle: { fontSize: 16, fontWeight: '700', color: '#e9d5ff' },
  quickSub: { fontSize: 12, color: '#7c3aed', marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  topicCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10,
    backgroundColor: '#1e293b', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#334155',
  },
  topicName: { fontSize: 14, fontWeight: '600', color: '#f1f5f9', marginBottom: 2 },
  topicCount: { fontSize: 11, color: '#64748b', marginBottom: 6 },
  barBg: { height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },
  accuracy: { fontSize: 16, fontWeight: '700', marginLeft: 12 },
});
