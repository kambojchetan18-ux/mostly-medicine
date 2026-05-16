import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { allQuestions } from '@mostly-medicine/content';

type TopicRow = { topic: string; total: number; done: number; correct: number };
type Status = 'Completed' | 'In Progress' | 'Not Started';

// Build a question-id → topic Map once. O(1) lookup beats O(N) `find` per attempt.
const QUESTION_TOPIC_MAP = new Map<string, string>(allQuestions.map((q) => [q.id, q.topic]));
// Precompute the list of unique topics + per-topic totals once at module load.
const TOPIC_TOTALS: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (const q of allQuestions) {
    out[q.topic] = (out[q.topic] ?? 0) + 1;
  }
  return out;
})();
const TOPICS = Object.keys(TOPIC_TOTALS).sort();

function getStatus(done: number): Status {
  if (done >= 20) return 'Completed';
  if (done > 0) return 'In Progress';
  return 'Not Started';
}

const STATUS_COLOR: Record<Status, string> = {
  Completed: '#10b981',
  'In Progress': '#f59e0b',
  'Not Started': '#475569',
};
const STATUS_BG: Record<Status, string> = {
  Completed: '#064e3b',
  'In Progress': '#713f12',
  'Not Started': '#1e293b',
};

export default function ProgressScreen() {
  const [rows, setRows] = useState<TopicRow[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [due, setDue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [attRes, streakRes, dueRes] = await Promise.all([
          supabase.from('attempts').select('question_id, is_correct').eq('user_id', user.id),
          supabase.from('study_streaks').select('current_streak').eq('user_id', user.id).maybeSingle(),
          supabase.from('sr_cards').select('question_id', { count: 'exact', head: true })
            .eq('user_id', user.id).lte('due', new Date().toISOString()),
        ]);
        if (cancelled) return;

        const attempts = attRes.data ?? [];
        setTotalAttempts(attempts.length);
        setTotalCorrect(attempts.filter((a) => a.is_correct).length);
        setStreak(streakRes.data?.current_streak ?? 0);
        setDue(dueRes.count ?? 0);

        const topicMap: Record<string, { done: number; correct: number }> = {};
        for (const a of attempts) {
          const topic = QUESTION_TOPIC_MAP.get(a.question_id);
          if (!topic) continue;
          if (!topicMap[topic]) topicMap[topic] = { done: 0, correct: 0 };
          topicMap[topic].done++;
          if (a.is_correct) topicMap[topic].correct++;
        }

        if (cancelled) return;
        setRows(TOPICS.map((t) => ({
          topic: t,
          total: TOPIC_TOTALS[t] ?? 0,
          done: topicMap[t]?.done ?? 0,
          correct: topicMap[t]?.correct ?? 0,
        })));
        setLoading(false);
      } catch (err) {
        console.error("[progress] data load failed", err);
        if (!cancelled) setLoading(false);
        return;
      }
    }
    // Defer the supabase fetch until after the first frame paints — avoids
    // blocking tab transition.
    const handle = InteractionManager.runAfterInteractions(() => load());
    return () => {
      cancelled = true;
      handle.cancel?.();
    };
  }, []);

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const { completed, inProgress, notStarted } = useMemo(() => {
    let c = 0, ip = 0, ns = 0;
    for (const r of rows) {
      const st = getStatus(r.done);
      if (st === 'Completed') c++;
      else if (st === 'In Progress') ip++;
      else ns++;
    }
    return { completed: c, inProgress: ip, notStarted: ns };
  }, [rows]);

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          <View style={s.header}>
            <Text style={s.title}>My Progress</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#7c3aed" style={{ marginTop: 60 }} />
          ) : (
            <>
              {/* Stats row */}
              <View style={s.statsRow}>
                <View style={s.statCard}>
                  <Text style={[s.statVal, { color: '#7c3aed' }]}>{totalAttempts}</Text>
                  <Text style={s.statLabel}>Questions Done</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={[s.statVal, { color: accuracy >= 75 ? '#10b981' : accuracy >= 55 ? '#f59e0b' : '#ef4444' }]}>{accuracy}%</Text>
                  <Text style={s.statLabel}>Accuracy</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={[s.statVal, { color: '#f97316' }]}>{streak}🔥</Text>
                  <Text style={s.statLabel}>Day Streak</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={[s.statVal, { color: '#3b82f6' }]}>{due}</Text>
                  <Text style={s.statLabel}>Due Today</Text>
                </View>
              </View>

              {/* Module summary */}
              <View style={s.summaryRow}>
                <View style={[s.summaryChip, { borderColor: '#10b981' }]}>
                  <Text style={[s.summaryNum, { color: '#10b981' }]}>{completed}</Text>
                  <Text style={s.summaryLabel}>Completed</Text>
                </View>
                <View style={[s.summaryChip, { borderColor: '#f59e0b' }]}>
                  <Text style={[s.summaryNum, { color: '#f59e0b' }]}>{inProgress}</Text>
                  <Text style={s.summaryLabel}>In Progress</Text>
                </View>
                <View style={[s.summaryChip, { borderColor: '#475569' }]}>
                  <Text style={[s.summaryNum, { color: '#475569' }]}>{notStarted}</Text>
                  <Text style={s.summaryLabel}>Not Started</Text>
                </View>
              </View>

              <Text style={s.sectionLabel}>Topics Breakdown</Text>

              {rows.map((r) => {
                const status = getStatus(r.done);
                const acc = r.done > 0 ? Math.round((r.correct / r.done) * 100) : null;
                const accColor = acc === null ? '#64748b' : acc >= 75 ? '#10b981' : acc >= 55 ? '#f59e0b' : '#ef4444';
                return (
                  <View key={r.topic} style={s.topicRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.topicName}>{r.topic}</Text>
                      <Text style={s.topicSub}>{r.done}/{r.total} attempts{acc !== null ? ` · ${acc}% accuracy` : ''}</Text>
                      <View style={s.barBg}>
                        <View style={[s.barFill, { width: `${Math.min(100, Math.round((r.done / r.total) * 100))}%` }]} />
                      </View>
                    </View>
                    <View style={[s.badge, { backgroundColor: STATUS_BG[status] }]}>
                      <Text style={[s.badgeText, { color: STATUS_COLOR[status] }]}>{status}</Text>
                    </View>
                  </View>
                );
              })}
            </>
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
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '44%', backgroundColor: '#1e293b', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#334155' },
  statVal: { fontSize: 24, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  summaryChip: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center' },
  summaryNum: { fontSize: 22, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: '#64748b', fontWeight: '500', marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#475569', paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  topicRow: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10,
    backgroundColor: '#1e293b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155', gap: 12,
  },
  topicName: { fontSize: 14, fontWeight: '600', color: '#f1f5f9', marginBottom: 2 },
  topicSub: { fontSize: 11, color: '#64748b', marginBottom: 6 },
  barBg: { height: 3, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 3, backgroundColor: '#7c3aed', borderRadius: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
