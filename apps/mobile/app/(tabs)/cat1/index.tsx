import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  InteractionManager,
} from 'react-native';
import FunLoading from '@/components/FunLoading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { allQuestions, type MCQuestion } from '@mostly-medicine/content';

// ── Config ────────────────────────────────────────────────────────────────────
const DAILY_TARGET = 50;
const REVIEW_LATER_KEY = 'cat1:reviewLater';
const SWIPE_THRESHOLD = 110; // px
const SCREEN_WIDTH = Dimensions.get('window').width;

type SwipeDir = 'left' | 'right';

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Persistence helpers ───────────────────────────────────────────────────────
async function loadReviewLater(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(REVIEW_LATER_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

async function saveReviewLater(set: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(REVIEW_LATER_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

// Mirrors POST /api/cat1/attempt — but uses direct Supabase writes because the
// web API requires SSR cookie auth that mobile doesn't have. Logic here matches
// the existing apps/mobile/app/(tabs)/cat1/quiz.tsx pattern.
async function persistAttempt(q: MCQuestion, isCorrect: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const today = new Date().toISOString().split('T')[0];

  await supabase.from('attempts').insert({
    user_id: user.id,
    question_id: q.id,
    selected_answer: isCorrect ? 'correct' : 'wrong',
    is_correct: isCorrect,
  });

  // Update streak (best-effort — match logic in /api/cat1/attempt)
  const { data: streak } = await supabase
    .from('study_streaks')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!streak) {
    await supabase.from('study_streaks').insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    });
  } else if (streak.last_study_date !== today) {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];
    const newStreak =
      streak.last_study_date === yesterday ? streak.current_streak + 1 : 1;
    await supabase
      .from('study_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak ?? 0),
        last_study_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);
  }
}

// ── Card component ────────────────────────────────────────────────────────────
type CardProps = {
  question: MCQuestion;
  selected: string | null;
  onSelect: (label: string) => void;
  onSwipe: (dir: SwipeDir) => void;
  swipeEnabled: boolean;
  isTop: boolean;
  stackOffset: number;
};

function McqCard({
  question,
  selected,
  onSelect,
  onSwipe,
  swipeEnabled,
  isTop,
  stackOffset,
}: CardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipe = useCallback(
    (dir: SwipeDir) => {
      onSwipe(dir);
    },
    [onSwipe],
  );

  const pan = Gesture.Pan()
    .enabled(swipeEnabled && isTop)
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.4;
    })
    .onEnd((e) => {
      const goRight = e.translationX > SWIPE_THRESHOLD;
      const goLeft = e.translationX < -SWIPE_THRESHOLD;
      if (goRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 220 });
        runOnJS(handleSwipe)('right');
      } else if (goLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 220 });
        runOnJS(handleSwipe)('left');
      } else {
        translateX.value = withSpring(0, { damping: 14 });
        translateY.value = withSpring(0, { damping: 14 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-12, 0, 12],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const reviewBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -20], [1, 0], Extrapolation.CLAMP),
  }));

  const gotItBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const stackStyle = isTop
    ? null
    : {
        transform: [{ scale: 1 - stackOffset * 0.04 }, { translateY: stackOffset * 8 }],
        opacity: 1 - stackOffset * 0.15,
      };

  const isCorrect = selected !== null && selected === question.correctAnswer;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle, stackStyle]}>
        {/* Swipe direction badges (only on top card) */}
        {isTop && (
          <>
            <Animated.View style={[styles.cornerBadge, styles.cornerLeft, reviewBadgeStyle]}>
              <Text style={styles.cornerBadgeText}>REVIEW</Text>
            </Animated.View>
            <Animated.View style={[styles.cornerBadge, styles.cornerRight, gotItBadgeStyle]}>
              <Text style={[styles.cornerBadgeText, { color: '#10b981', borderColor: '#10b981' }]}>
                GOT IT
              </Text>
            </Animated.View>
          </>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          {/* Difficulty + topic chip */}
          <View
            style={[
              styles.diffBadge,
              {
                backgroundColor:
                  question.difficulty === 'easy'
                    ? '#064e3b'
                    : question.difficulty === 'medium'
                      ? '#713f12'
                      : '#7f1d1d',
              },
            ]}
          >
            <Text
              style={[
                styles.diffText,
                {
                  color:
                    question.difficulty === 'easy'
                      ? '#34d399'
                      : question.difficulty === 'medium'
                        ? '#fbbf24'
                        : '#f87171',
                },
              ]}
            >
              {question.difficulty.toUpperCase()} · {question.subtopic}
            </Text>
          </View>

          {/* Stem */}
          <Text style={styles.stem}>{question.stem}</Text>

          {/* Options */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {question.options.map((opt) => {
              let bg = '#1e293b';
              let border = '#334155';
              let textColor = '#f1f5f9';
              if (selected !== null) {
                if (opt.label === question.correctAnswer) {
                  bg = '#064e3b';
                  border = '#10b981';
                  textColor = '#d1fae5';
                } else if (opt.label === selected && selected !== question.correctAnswer) {
                  bg = '#7f1d1d';
                  border = '#ef4444';
                  textColor = '#fee2e2';
                } else {
                  textColor = '#475569';
                }
              }
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.optionCard, { backgroundColor: bg, borderColor: border }]}
                  onPress={() => onSelect(opt.label)}
                  activeOpacity={selected !== null ? 1 : 0.7}
                  disabled={selected !== null}
                >
                  <View style={[styles.optionLabel, { borderColor: border }]}>
                    <Text style={[styles.optionLabelText, { color: textColor }]}>{opt.label}</Text>
                  </View>
                  <Text style={[styles.optionText, { color: textColor, flex: 1 }]}>
                    {opt.text}
                  </Text>
                  {selected !== null && opt.label === question.correctAnswer && (
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  )}
                  {selected === opt.label && selected !== question.correctAnswer && (
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {selected !== null && (
            <View
              style={[
                styles.explanationCard,
                { borderColor: isCorrect ? '#10b981' : '#ef4444' },
              ]}
            >
              <Text
                style={[
                  styles.explanationHeader,
                  { color: isCorrect ? '#10b981' : '#ef4444' },
                ]}
              >
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              <Text style={styles.swipeHint}>
                Swipe right if you got it · left to review later
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Cat1DeckScreen() {
  const [deck, setDeck] = useState<MCQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [reviewLater, setReviewLater] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const swipingRef = useRef(false);

  // Build today's deck
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const reviewSet = await loadReviewLater();

      // Load attempted question IDs for today, so we don't re-show them
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let attemptedToday = new Set<string>();
      if (user) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const { data: attempts } = await supabase
          .from('attempts')
          .select('question_id, attempted_at, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay.toISOString());
        if (attempts) {
          attemptedToday = new Set(attempts.map((a: { question_id: string }) => a.question_id));
        }

        // Streak — try user_profiles.current_streak first per spec, fall back to
        // study_streaks.current_streak, default to 0.
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('current_streak')
            .eq('id', user.id)
            .maybeSingle<{ current_streak: number | null }>();
          if (profile && typeof profile.current_streak === 'number') {
            if (!cancelled) setStreak(profile.current_streak);
          } else {
            const { data: ss } = await supabase
              .from('study_streaks')
              .select('current_streak')
              .eq('user_id', user.id)
              .maybeSingle<{ current_streak: number | null }>();
            if (!cancelled) setStreak(ss?.current_streak ?? 0);
          }
        } catch {
          if (!cancelled) setStreak(0);
        }
      }

      // Pool: prioritise review-later items first, then unseen-today fresh
      // ones. Single O(N) pass — the previous version walked allQuestions twice.
      const reviewPool: MCQuestion[] = [];
      const freshPool: MCQuestion[] = [];
      for (const q of allQuestions) {
        if (attemptedToday.has(q.id)) continue;
        if (reviewSet.has(q.id)) reviewPool.push(q);
        else freshPool.push(q);
      }
      const built = [...shuffle(reviewPool), ...shuffle(freshPool)].slice(0, DAILY_TARGET);

      if (cancelled) return;
      setReviewLater(reviewSet);
      setDeck(built);
      setLoading(false);
    }
    // Defer the heavy filter+shuffle (allQuestions has 3,000+ items) until
    // after the loading splash has painted. Keeps the tab transition snappy.
    const handle = InteractionManager.runAfterInteractions(() => init());
    return () => {
      cancelled = true;
      handle.cancel?.();
    };
  }, []);

  const current = deck[index];
  const upcoming = deck[index + 1];
  const upcoming2 = deck[index + 2];
  const totalForToday = useMemo(() => Math.min(DAILY_TARGET, deck.length), [deck.length]);

  const handleSelect = useCallback(
    async (label: string) => {
      if (selected !== null || !current) return;
      setSelected(label);
      const isCorrect = label === current.correctAnswer;
      // Fire-and-forget — don't block UI. Log failures for debugging.
      persistAttempt(current, isCorrect).catch((err) => {
        console.warn('[cat1] persistAttempt failed:', err?.message ?? err);
      });
      // If they answered correctly, drop it from review-later
      if (isCorrect && reviewLater.has(current.id)) {
        const next = new Set(reviewLater);
        next.delete(current.id);
        setReviewLater(next);
        saveReviewLater(next);
      }
    },
    [selected, current, reviewLater],
  );

  const advance = useCallback(
    async (dir: SwipeDir) => {
      if (!current || swipingRef.current) return;
      swipingRef.current = true;

      if (dir === 'left') {
        const next = new Set(reviewLater);
        next.add(current.id);
        setReviewLater(next);
        saveReviewLater(next);
      } else {
        // Swiped right → user got it. Remove from review-later if present.
        if (reviewLater.has(current.id)) {
          const next = new Set(reviewLater);
          next.delete(current.id);
          setReviewLater(next);
          saveReviewLater(next);
        }
      }

      // Advance after the swipe animation has had a beat to fly out.
      setTimeout(() => {
        setIndex((i) => i + 1);
        setSelected(null);
        swipingRef.current = false;
      }, 180);
    },
    [current, reviewLater],
  );

  const onButton = useCallback(
    (dir: SwipeDir) => {
      // Buttons act before answering OR after — if not answered, treat as
      // "skip" and don't record. After answering, behave like swipe.
      if (selected === null && current) {
        // Without an answer, don't persist. Just push to review (left) or
        // skip forward (right).
      }
      advance(dir);
    },
    [advance, current, selected],
  );

  const onResetReview = useCallback(() => {
    // Re-insert current card in deck for revisit later
    if (!current) return;
    setIndex((i) => i + 1);
    setSelected(null);
    const next = new Set(reviewLater);
    next.add(current.id);
    setReviewLater(next);
    saveReviewLater(next);
  }, [current, reviewLater]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.bg}>
        <SafeAreaView style={styles.center}>
          <FunLoading
            pool={[
              '🧠 Picking a fresh question…',
              '🃏 Reshuffling the deck…',
              '🔍 Hunting in the bank…',
            ]}
          />
        </SafeAreaView>
      </View>
    );
  }

  const done = !current;

  return (
    <View style={styles.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AMC MCQ</Text>
            <Text style={styles.subTitle}>Daily MCQ deck</Text>
          </View>
          <View style={styles.headerRight}>
            {streak > 0 && (
              <View style={styles.streakChip}>
                <Text style={styles.streakText}>🔥 {streak}</Text>
              </View>
            )}
            <Text style={styles.progressText}>
              {Math.min(index, totalForToday)} / {totalForToday} today
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  totalForToday === 0 ? 0 : Math.min(100, (index / totalForToday) * 100)
                }%`,
              },
            ]}
          />
        </View>

        {/* Deck */}
        <View style={styles.deckArea}>
          {done ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>🎯</Text>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySub}>Come back tomorrow.</Text>
              {reviewLater.size > 0 && (
                <Text style={styles.emptyMeta}>
                  {reviewLater.size} card{reviewLater.size === 1 ? '' : 's'} saved for review
                </Text>
              )}
            </View>
          ) : (
            <>
              {/* Render up to 3 stacked cards back-to-front so the top card sits last in the tree */}
              {upcoming2 && (
                <McqCard
                  key={upcoming2.id + ':2'}
                  question={upcoming2}
                  selected={null}
                  onSelect={() => {}}
                  onSwipe={() => {}}
                  swipeEnabled={false}
                  isTop={false}
                  stackOffset={2}
                />
              )}
              {upcoming && (
                <McqCard
                  key={upcoming.id + ':1'}
                  question={upcoming}
                  selected={null}
                  onSelect={() => {}}
                  onSwipe={() => {}}
                  swipeEnabled={false}
                  isTop={false}
                  stackOffset={1}
                />
              )}
              <McqCard
                key={current.id + ':0:' + index}
                question={current}
                selected={selected}
                onSelect={handleSelect}
                onSwipe={advance}
                swipeEnabled={selected !== null}
                isTop
                stackOffset={0}
              />
            </>
          )}
        </View>

        {/* Bottom buttons */}
        {!done && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnReview]}
              onPress={() => onButton('left')}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={26} color="#f87171" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnRetry]}
              onPress={onResetReview}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={22} color="#a78bfa" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnGood]}
              onPress={() => {
                if (selected === null) return; // require an answer first
                onButton('right');
              }}
              activeOpacity={selected === null ? 1 : 0.7}
            >
              <Ionicons
                name="checkmark"
                size={26}
                color={selected === null ? '#334155' : '#34d399'}
              />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#f1f5f9' },
  subTitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  headerRight: { alignItems: 'flex-end', gap: 4 },
  streakChip: {
    backgroundColor: '#7c2d12',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: { color: '#fed7aa', fontWeight: '700', fontSize: 13 },
  progressText: { fontSize: 11, color: '#64748b', fontWeight: '600' },

  progressBarBg: {
    marginHorizontal: 16,
    height: 3,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressBarFill: { height: 3, backgroundColor: '#7c3aed', borderRadius: 2 },

  deckArea: {
    flex: 1,
    marginHorizontal: 14,
    position: 'relative',
  },

  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  cardContent: { padding: 18, paddingBottom: 28 },

  cornerBadge: {
    position: 'absolute',
    top: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2.5,
    borderRadius: 8,
    zIndex: 10,
  },
  cornerLeft: { left: 18, transform: [{ rotate: '-12deg' }], borderColor: '#ef4444' },
  cornerRight: { right: 18, transform: [{ rotate: '12deg' }], borderColor: '#10b981' },
  cornerBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#ef4444',
    borderColor: '#ef4444',
  },

  diffBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  diffText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  stem: { fontSize: 16, color: '#f1f5f9', lineHeight: 24, fontWeight: '500', marginBottom: 16 },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    gap: 12,
  },
  optionLabel: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: { fontSize: 12, fontWeight: '700' },
  optionText: { fontSize: 14, lineHeight: 19 },

  explanationCard: {
    marginTop: 16,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  explanationHeader: { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  explanationText: { fontSize: 13, color: '#94a3b8', lineHeight: 19 },
  swipeHint: { fontSize: 11, color: '#64748b', marginTop: 10, fontStyle: 'italic' },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  actionBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnReview: { borderColor: '#7f1d1d' },
  btnRetry: { borderColor: '#4c1d95', width: 50, height: 50, borderRadius: 25 },
  btnGood: { borderColor: '#064e3b' },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#f1f5f9', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#94a3b8' },
  emptyMeta: { fontSize: 12, color: '#64748b', marginTop: 16 },
});
