import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import FunLoading from '@/components/FunLoading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { allQuestions } from '@mostly-medicine/content';
import type { MCQuestion } from '@mostly-medicine/content';

type SRCard = { id: string; question_id: string; interval: number; ease_factor: number; repetitions: number };
type Rating = 'again' | 'hard' | 'good' | 'easy';

function nextInterval(card: SRCard, rating: Rating): { interval: number; ease_factor: number; repetitions: number } {
  const ratingNum = { again: 0, hard: 1, good: 2, easy: 3 }[rating];
  let { interval, ease_factor, repetitions } = card;
  if (ratingNum < 2) {
    return { interval: 1, ease_factor: Math.max(1.3, ease_factor - 0.2), repetitions: 0 };
  }
  const newEf = Math.max(1.3, ease_factor + (0.1 - (3 - ratingNum) * (0.08 + (3 - ratingNum) * 0.02)));
  let newInterval: number;
  if (repetitions === 0) newInterval = 1;
  else if (repetitions === 1) newInterval = 6;
  else newInterval = Math.round(interval * newEf);
  if (rating === 'easy') newInterval = Math.round(newInterval * 1.3);
  return { interval: newInterval, ease_factor: newEf, repetitions: repetitions + 1 };
}

export default function RecallsScreen() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<SRCard[]>([]);
  const [qMap, setQMap] = useState<Record<string, MCQuestion>>({});
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const map: Record<string, MCQuestion> = {};
    for (const q of allQuestions) map[q.id] = q;
    setQMap(map);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('sr_cards')
      .select('id, question_id, interval, ease_factor, repetitions')
      .eq('user_id', user.id)
      .lte('due', new Date().toISOString())
      .limit(50);
    setCards(data ?? []);
    setIdx(0);
    setRevealed(false);
    setDone((data ?? []).length === 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleRate(rating: Rating) {
    if (saving) return;
    setSaving(true);
    const card = cards[idx];
    const { interval, ease_factor, repetitions } = nextInterval(card, rating);
    const due = new Date();
    due.setDate(due.getDate() + interval);
    await supabase.from('sr_cards').update({ interval, ease_factor, repetitions, due: due.toISOString() }).eq('id', card.id);
    setSaving(false);
    if (idx + 1 >= cards.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  }

  const card = cards[idx];
  const question = card ? qMap[card.question_id] : null;

  if (loading) return (
    <View style={[s.bg, { justifyContent: 'center', alignItems: 'center' }]}>
      <FunLoading
        pool={[
          '⏳ Spaced-repetition is doing its thing…',
          '🧠 Strengthening the memory trace…',
        ]}
      />
    </View>
  );

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Recalls</Text>
            <Text style={s.sub}>Spaced repetition review</Text>
          </View>
        </View>

        {done ? (
          <View style={s.center}>
            <Text style={{ fontSize: 52, marginBottom: 16 }}>🎉</Text>
            <Text style={s.doneTitle}>All caught up!</Text>
            <Text style={s.doneSub}>No cards due right now. Come back tomorrow to keep your streak going.</Text>
            <TouchableOpacity style={s.refreshBtn} onPress={load}>
              <Ionicons name="refresh" size={16} color="#a78bfa" />
              <Text style={s.refreshBtnText}>Check again</Text>
            </TouchableOpacity>
          </View>
        ) : question ? (
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <View style={s.progress}>
              <Text style={s.progressText}>{idx + 1} / {cards.length}</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${((idx + 1) / cards.length) * 100}%` }]} />
              </View>
            </View>

            <View style={s.card}>
              <View style={s.topicRow}>
                <Text style={s.topicBadge}>{question.topic}</Text>
                <Text style={s.diffBadge}>{question.difficulty}</Text>
              </View>
              <Text style={s.stem}>{question.stem}</Text>

              {!revealed ? (
                <TouchableOpacity style={s.revealBtn} onPress={() => setRevealed(true)}>
                  <Text style={s.revealBtnText}>Show Answer</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <View style={s.divider} />
                  {question.options.map((opt) => (
                    <View key={opt.label} style={[s.optRow, opt.label === question.correctAnswer && s.optCorrect]}>
                      <Text style={[s.optLabel, opt.label === question.correctAnswer && s.optLabelCorrect]}>{opt.label}</Text>
                      <Text style={[s.optText, opt.label === question.correctAnswer && s.optTextCorrect]}>{opt.text}</Text>
                    </View>
                  ))}
                  <View style={s.explainBox}>
                    <Text style={s.explainText}>{question.explanation}</Text>
                  </View>
                </View>
              )}
            </View>

            {revealed && (
              <View style={s.ratingRow}>
                {(['again', 'hard', 'good', 'easy'] as Rating[]).map((r) => (
                  <TouchableOpacity key={r} style={[s.rateBtn, s[`rate_${r}` as keyof typeof s] as any]} onPress={() => handleRate(r)} disabled={saving}>
                    <Text style={s.rateBtnText}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={s.center}>
            <Text style={s.doneTitle}>Card not found</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, gap: 12 },
  back: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  doneTitle: { fontSize: 22, fontWeight: '800', color: '#f1f5f9', marginBottom: 10, textAlign: 'center' },
  doneSub: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 21 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24, backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: '#334155' },
  refreshBtnText: { color: '#a78bfa', fontWeight: '600', fontSize: 14 },
  progress: { marginBottom: 14 },
  progressText: { fontSize: 12, color: '#64748b', marginBottom: 6, textAlign: 'right' },
  progressBar: { height: 4, backgroundColor: '#1e293b', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#7c3aed', borderRadius: 2 },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#334155' },
  topicRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  topicBadge: { backgroundColor: '#2e1065', color: '#a78bfa', fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  diffBadge: { backgroundColor: '#0f2a1e', color: '#10b981', fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, textTransform: 'capitalize' },
  stem: { fontSize: 15, color: '#e2e8f0', lineHeight: 22 },
  revealBtn: { marginTop: 20, backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  revealBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 14 },
  optRow: { flexDirection: 'row', gap: 10, marginBottom: 8, padding: 10, borderRadius: 10, backgroundColor: '#0f172a' },
  optCorrect: { backgroundColor: '#064e3b', borderWidth: 1, borderColor: '#10b981' },
  optLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', width: 18 },
  optLabelCorrect: { color: '#10b981' },
  optText: { flex: 1, fontSize: 13, color: '#94a3b8', lineHeight: 18 },
  optTextCorrect: { color: '#d1fae5', fontWeight: '600' },
  explainBox: { marginTop: 10, backgroundColor: '#0f172a', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#7c3aed' },
  explainText: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  ratingRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  rateBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  rateBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  rate_again: { backgroundColor: '#7f1d1d' },
  rate_hard: { backgroundColor: '#713f12' },
  rate_good: { backgroundColor: '#1e3a5f' },
  rate_easy: { backgroundColor: '#064e3b' },
});
