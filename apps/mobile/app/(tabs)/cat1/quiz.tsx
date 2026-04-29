import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { allQuestions, type MCQuestion } from '@mostly-medicine/content';

type Phase = 'quiz' | 'result' | 'done';
type AttemptRecord = { question_id: string; is_correct: boolean; selected_answer: string };

const QUIZ_SIZE = 20;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizScreen() {
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pool = topic
      ? allQuestions.filter((q) => q.topic === topic)
      : allQuestions;
    setQuestions(shuffle(pool).slice(0, QUIZ_SIZE));
  }, [topic]);

  const q = questions[index];
  const isCorrect = selected !== null && selected === q?.correctAnswer;
  const totalCorrect = attempts.filter((a) => a.is_correct).length;

  function handleSelect(label: string) {
    if (selected !== null) return;
    setSelected(label);
    setPhase('result');
  }

  function next() {
    const newAttempts = [...attempts, {
      question_id: q.id,
      is_correct: selected === q.correctAnswer,
      selected_answer: selected ?? '',
    }];
    setAttempts(newAttempts);

    if (index + 1 >= questions.length) {
      saveAttempts(newAttempts);
      setPhase('done');
    } else {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      setIndex(index + 1);
      setSelected(null);
      setPhase('quiz');
    }
  }

  async function saveAttempts(records: AttemptRecord[]) {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('attempts').insert(
        records.map((r) => ({ ...r, user_id: user.id }))
      );
    } finally {
      // Always clear "Saving…" — was previously stuck on for unauthed users
      // and on insert errors.
      setSaving(false);
    }
  }

  if (!q && phase !== 'done') {
    return <View style={s.bg} />;
  }

  if (phase === 'done') {
    const accuracy = Math.round((totalCorrect / questions.length) * 100);
    const accColor = accuracy >= 75 ? '#10b981' : accuracy >= 55 ? '#f59e0b' : '#ef4444';
    return (
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🎯</Text>
          <Text style={s.doneTitle}>Quiz Complete!</Text>
          {topic && <Text style={s.doneTopic}>{topic}</Text>}
          <View style={s.scoreCard}>
            <Text style={[s.scoreNum, { color: accColor }]}>{accuracy}%</Text>
            <Text style={s.scoreSub}>{totalCorrect} / {questions.length} correct</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity style={s.btnSecondary} onPress={() => router.back()}>
              <Text style={s.btnSecondaryText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnPrimary} onPress={() => {
              const pool = topic ? allQuestions.filter((q) => q.topic === topic) : allQuestions;
              setQuestions(shuffle(pool).slice(0, QUIZ_SIZE));
              setIndex(0); setSelected(null); setAttempts([]); setPhase('quiz');
            }}>
              <Text style={s.btnPrimaryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
          {saving && <Text style={{ color: '#64748b', marginTop: 16, fontSize: 12 }}>Saving results...</Text>}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.headerTopic} numberOfLines={1}>{topic ?? 'Quick Quiz'}</Text>
            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: `${((index) / questions.length) * 100}%` }]} />
            </View>
          </View>
          <Text style={s.counter}>{index + 1}/{questions.length}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Difficulty badge */}
            <View style={[s.diffBadge, { backgroundColor: q.difficulty === 'easy' ? '#064e3b' : q.difficulty === 'medium' ? '#713f12' : '#7f1d1d' }]}>
              <Text style={[s.diffText, { color: q.difficulty === 'easy' ? '#34d399' : q.difficulty === 'medium' ? '#fbbf24' : '#f87171' }]}>
                {q.difficulty.toUpperCase()} · {q.subtopic}
              </Text>
            </View>

            {/* Stem */}
            <Text style={s.stem}>{q.stem}</Text>

            {/* Options */}
            <View style={{ gap: 10, marginTop: 8 }}>
              {q.options.map((opt) => {
                let bg = '#1e293b';
                let border = '#334155';
                let textColor = '#f1f5f9';
                if (selected !== null) {
                  if (opt.label === q.correctAnswer) { bg = '#064e3b'; border = '#10b981'; textColor = '#d1fae5'; }
                  else if (opt.label === selected && selected !== q.correctAnswer) { bg = '#7f1d1d'; border = '#ef4444'; textColor = '#fee2e2'; }
                  else { textColor = '#475569'; }
                }
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[s.optionCard, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => handleSelect(opt.label)}
                    activeOpacity={selected !== null ? 1 : 0.7}
                  >
                    <View style={[s.optionLabel, { borderColor: border }]}>
                      <Text style={[s.optionLabelText, { color: textColor }]}>{opt.label}</Text>
                    </View>
                    <Text style={[s.optionText, { color: textColor, flex: 1 }]}>{opt.text}</Text>
                    {selected !== null && opt.label === q.correctAnswer && (
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    )}
                    {selected === opt.label && selected !== q.correctAnswer && (
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {selected !== null && (
              <View style={[s.explanationCard, { borderColor: isCorrect ? '#10b981' : '#ef4444' }]}>
                <Text style={[s.explanationHeader, { color: isCorrect ? '#10b981' : '#ef4444' }]}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </Text>
                <Text style={s.explanationText}>{q.explanation}</Text>
                <TouchableOpacity style={s.nextBtn} onPress={next}>
                  <Text style={s.nextBtnText}>
                    {index + 1 >= questions.length ? 'See Results' : 'Next Question'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  backBtn: { padding: 4 },
  headerTopic: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 6 },
  progressBarBg: { height: 3, backgroundColor: '#1e293b', borderRadius: 2 },
  progressBarFill: { height: 3, backgroundColor: '#7c3aed', borderRadius: 2 },
  counter: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  diffBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  diffText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  stem: { fontSize: 16, color: '#f1f5f9', lineHeight: 24, fontWeight: '500', marginBottom: 16 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1.5, padding: 14, gap: 12,
  },
  optionLabel: { width: 30, height: 30, borderRadius: 8, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  optionLabelText: { fontSize: 13, fontWeight: '700' },
  optionText: { fontSize: 14, lineHeight: 20 },
  explanationCard: {
    marginTop: 20, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1.5,
  },
  explanationHeader: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  explanationText: { fontSize: 14, color: '#94a3b8', lineHeight: 21 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, marginTop: 16,
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  // Done screen
  doneTitle: { fontSize: 26, fontWeight: '800', color: '#f1f5f9', marginBottom: 4 },
  doneTopic: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  scoreCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  scoreNum: { fontSize: 56, fontWeight: '800' },
  scoreSub: { fontSize: 16, color: '#94a3b8', marginTop: 4 },
  btnPrimary: { backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: { backgroundColor: '#1e293b', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, borderWidth: 1, borderColor: '#334155' },
  btnSecondaryText: { color: '#94a3b8', fontWeight: '700', fontSize: 15 },
});
