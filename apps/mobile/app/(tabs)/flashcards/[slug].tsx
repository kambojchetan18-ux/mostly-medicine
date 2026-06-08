import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { DECK_BY_SLUG } from '@/lib/flashcard-decks';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

type Rating = 'again' | 'hard' | 'good' | 'easy';

const RATING_LABELS: Record<Rating, string> = {
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
};

// Dark-mode versions of the web rating palette (rose/amber/emerald/sky).
const RATING_COLORS: Record<Rating, { bg: string; border: string; text: string }> = {
  again: { bg: '#4c0519', border: '#9f1239', text: '#fda4af' },
  hard:  { bg: '#451a03', border: '#b45309', text: '#fcd34d' },
  good:  { bg: '#022c22', border: '#047857', text: '#6ee7b7' },
  easy:  { bg: '#082f49', border: '#0369a1', text: '#7dd3fc' },
};

type LimitInfo = { dailyLimit: number; used: number; upgrade: string };

type ClozePart =
  | { kind: 'text'; value: string }
  | { kind: 'cloze'; value: string };

// Parse {{c1::answer}} segments out of the front text. Same regex as
// the web FlashcardSession component so behaviour matches exactly.
function parseCloze(front: string): ClozePart[] {
  const parts: ClozePart[] = [];
  const regex = /\{\{c(\d+)::([^}]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(front)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: 'text', value: front.slice(lastIndex, match.index) });
    }
    parts.push({ kind: 'cloze', value: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < front.length) {
    parts.push({ kind: 'text', value: front.slice(lastIndex) });
  }
  return parts;
}

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? '';
}

export default function FlashcardPlayerScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const deck = slug ? DECK_BY_SLUG[slug] : undefined;

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratingsByIndex, setRatingsByIndex] = useState<Record<number, Rating>>({});
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cards = deck?.cards ?? [];
  const card = cards[index];
  const total = cards.length;
  const isLast = index === total - 1;
  const ratedCount = Object.keys(ratingsByIndex).length;

  const ratingCounts = useMemo(() => {
    const c: Record<Rating, number> = { again: 0, hard: 0, good: 0, easy: 0 };
    for (const r of Object.values(ratingsByIndex)) c[r]++;
    return c;
  }, [ratingsByIndex]);

  // Deck not found in the slug map
  if (!deck) {
    return (
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.back}>
              <Ionicons name="arrow-back" size={22} color="#94a3b8" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Deck not found</Text>
          </View>
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>This deck isn’t available on mobile yet.</Text>
            <TouchableOpacity
              style={s.btnPrimary}
              onPress={() => router.replace('/(tabs)/flashcards')}
            >
              <Text style={s.btnPrimaryText}>Back to decks</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Empty deck guard (no cards array yet)
  if (total === 0) {
    return (
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.back}>
              <Ionicons name="arrow-back" size={22} color="#94a3b8" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{deck.name}</Text>
          </View>
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>No cards in this deck yet.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const sessionComplete = ratedCount === total && isLast && !!ratingsByIndex[index];
  const progressPct = Math.round((ratedCount / total) * 100);

  const restart = () => {
    setIndex(0);
    setRevealed(false);
    setRatingsByIndex({});
    setLimitInfo(null);
  };

  const handleRate = async (rating: Rating) => {
    if (!card || limitInfo || submitting) return;
    // Optimistically advance (mirrors the web component)
    const advancedFromIndex = index;
    setRatingsByIndex((prev) => ({ ...prev, [advancedFromIndex]: rating }));
    if (!isLast) {
      setIndex(advancedFromIndex + 1);
      setRevealed(false);
    }
    if (!card.id) return;
    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/flashcards/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ cardId: card.id, rating }),
      });
      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        if (data.error === 'daily_limit_reached') {
          // Roll back the optimistic advance so the user lands on the card
          // they were rating when the gate appears.
          setRatingsByIndex((prev) => {
            const next = { ...prev };
            delete next[advancedFromIndex];
            return next;
          });
          setIndex(advancedFromIndex);
          setRevealed(true);
          setLimitInfo({
            dailyLimit: Number((data.dailyLimit as number | undefined) ?? 5),
            used: Number((data.used as number | undefined) ?? 5),
            upgrade:
              typeof data.upgrade === 'string'
                ? data.upgrade
                : 'Upgrade to Pro for unlimited flashcard reviews.',
          });
        }
      }
    } catch {
      // Network failures stay silent — optimistic advance already happened
      // and FSRS state will catch up on the next review.
    } finally {
      setSubmitting(false);
    }
  };

  const openBilling = () => {
    const url = `${API_URL || 'https://mostlymedicine.com'}/dashboard/billing`;
    Linking.openURL(url).catch(() => {});
  };

  const clozeParts = card ? parseCloze(card.front_md) : [];

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle} numberOfLines={1}>{deck.name}</Text>
            <Text style={s.headerSub}>
              {Math.min(index + 1, total)}/{total} · {ratedCount} rated
            </Text>
          </View>
        </View>

        {/* progress bar */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {limitInfo && (
            <View style={s.limitBox}>
              <Text style={s.limitTitle}>⏳ Daily review limit reached</Text>
              <Text style={s.limitBody}>
                You’ve reviewed {limitInfo.used} of your {limitInfo.dailyLimit} free flashcards today.
                The counter resets at midnight UTC.
              </Text>
              <Text style={s.limitBody}>{limitInfo.upgrade}</Text>
              <TouchableOpacity style={s.limitBtn} onPress={openBilling}>
                <Text style={s.limitBtnText}>Upgrade to Pro →</Text>
              </TouchableOpacity>
            </View>
          )}

          {sessionComplete ? (
            <View style={s.summaryCard}>
              <Text style={s.summaryTitle}>Deck complete</Text>
              <Text style={s.summarySub}>
                {total} {deck.name.toLowerCase()} cards reviewed.
              </Text>
              <View style={s.summaryGrid}>
                {(['again', 'hard', 'good', 'easy'] as Rating[]).map((r) => (
                  <View key={r} style={s.summaryCell}>
                    <Text style={s.summaryCellLabel}>{RATING_LABELS[r]}</Text>
                    <Text style={s.summaryCellCount}>{ratingCounts[r]}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.btnPrimary} onPress={restart}>
                <Text style={s.btnPrimaryText}>Restart deck</Text>
              </TouchableOpacity>
            </View>
          ) : card ? (
            <View style={s.cardSurface}>
              <View style={s.cardMetaRow}>
                {card.subtopic && <Text style={s.cardMeta}>{card.subtopic}</Text>}
                {card.mark_sheet_domain && (
                  <View style={s.metaPill}>
                    <Text style={s.metaPillText}>{card.mark_sheet_domain}</Text>
                  </View>
                )}
                <View style={s.metaPill}>
                  <Text style={s.metaPillText}>
                    {card.amc_part === 'part_2_clinical'
                      ? 'AMC Part 2'
                      : card.amc_part === 'part_1'
                        ? 'AMC Part 1'
                        : 'AMC Part 1 + 2'}
                  </Text>
                </View>
              </View>

              {/* Cloze front — slate pill for blanks, emerald highlight when revealed */}
              <Text style={s.frontText}>
                {clozeParts.map((p, i) =>
                  p.kind === 'text' ? (
                    <Text key={i}>{p.value}</Text>
                  ) : revealed ? (
                    <Text key={i} style={s.clozeRevealed}>{p.value}</Text>
                  ) : (
                    <Text key={i} style={s.clozeHidden}>  [ … ]  </Text>
                  ),
                )}
              </Text>

              {revealed && (
                <>
                  <View style={s.divider} />
                  <Text style={s.backText}>{card.back_md}</Text>
                  {card.citation && (
                    <Text style={s.citation}>📖 {card.citation}</Text>
                  )}
                </>
              )}

              {!revealed ? (
                <TouchableOpacity
                  style={s.showAnswerBtn}
                  onPress={() => setRevealed(true)}
                  activeOpacity={0.85}
                >
                  <Text style={s.showAnswerText}>Show answer</Text>
                </TouchableOpacity>
              ) : (
                <View style={s.ratingGrid}>
                  {(['again', 'hard', 'good', 'easy'] as Rating[]).map((r) => {
                    const pal = RATING_COLORS[r];
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[
                          s.ratingBtn,
                          { backgroundColor: pal.bg, borderColor: pal.border },
                          (submitting || !!limitInfo) && { opacity: 0.5 },
                        ]}
                        onPress={() => handleRate(r)}
                        disabled={submitting || !!limitInfo}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.ratingBtnText, { color: pal.text }]}>
                          {RATING_LABELS[r]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ) : null}

          <Text style={s.footer}>
            Reviews persist via FSRS-5 — cards will come back when they’re due.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#f1f5f9' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  progressTrack: {
    height: 4,
    marginHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#34d399' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  emptyText: { color: '#94a3b8', fontSize: 14 },
  cardSurface: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  cardMeta: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  metaPill: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaPillText: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  frontText: { fontSize: 16, lineHeight: 24, color: '#f1f5f9' },
  clozeHidden: {
    backgroundColor: '#0f172a',
    color: '#64748b',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  clozeRevealed: {
    backgroundColor: '#022c22',
    color: '#6ee7b7',
    fontWeight: '700',
  },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 14 },
  backText: { fontSize: 14, lineHeight: 21, color: '#cbd5e1' },
  citation: { fontSize: 11, color: '#64748b', marginTop: 8 },
  showAnswerBtn: {
    marginTop: 18,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  showAnswerText: { color: '#f1f5f9', fontWeight: '800', fontSize: 15 },
  ratingGrid: { flexDirection: 'row', gap: 8, marginTop: 18 },
  ratingBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratingBtnText: { fontSize: 13, fontWeight: '700' },
  limitBox: {
    backgroundColor: '#451a03',
    borderWidth: 1,
    borderColor: '#b45309',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 6,
  },
  limitTitle: { color: '#fcd34d', fontSize: 14, fontWeight: '800' },
  limitBody: { color: '#fde68a', fontSize: 12, lineHeight: 18 },
  limitBtn: {
    marginTop: 4,
    backgroundColor: '#b45309',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  limitBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  summaryCard: {
    backgroundColor: '#022c22',
    borderWidth: 1,
    borderColor: '#047857',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  summaryTitle: { fontSize: 22, fontWeight: '800', color: '#ecfdf5' },
  summarySub: { fontSize: 13, color: '#a7f3d0', marginTop: 4, textAlign: 'center' },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    width: '100%',
  },
  summaryCell: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: '#064e3b',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  summaryCellLabel: {
    fontSize: 11,
    color: '#a7f3d0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryCellCount: { fontSize: 22, fontWeight: '800', color: '#ecfdf5', marginTop: 2 },
  btnPrimary: {
    marginTop: 18,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { textAlign: 'center', marginTop: 18, fontSize: 11, color: '#475569' },
});
