import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DECKS } from '@/lib/flashcard-decks';

const WEB_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://mostlymedicine.com';

export default function FlashcardsHubScreen() {
  const [webOnlyModal, setWebOnlyModal] = useState<null | 'generate' | 'import'>(null);

  const openWebFlow = (kind: 'generate' | 'import') => {
    const path = kind === 'generate' ? '/dashboard/flashcards/generate' : '/dashboard/flashcards/import';
    Linking.openURL(`${WEB_URL}${path}`).catch(console.warn);
    setWebOnlyModal(null);
  };

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.title}>Flashcards</Text>
          <Text style={s.sub}>AMC-aligned · AU-cited · {DECKS.length} decks</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          <View style={[s.chip, s.chipEmerald]}>
            <Text style={s.chipText}>✨ Generate 3/d Free · ∞ Pro</Text>
          </View>
          <View style={[s.chip, s.chipSky]}>
            <Text style={s.chipText}>📦 Anki import 1/d Free · ∞ Pro</Text>
          </View>
          <View style={[s.chip, s.chipRose]}>
            <Text style={s.chipText}>🃏 Review 5/d Free · ∞ Pro</Text>
          </View>
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 10 }}
        >
          {/* Generate + Import placeholders — defer to web for v1 */}
          <View style={s.webOnlyRow}>
            <TouchableOpacity
              style={[s.webOnlyCard, { borderColor: '#10b98155', backgroundColor: '#022c2233' }]}
              onPress={() => setWebOnlyModal('generate')}
              activeOpacity={0.7}
            >
              <Text style={s.webOnlyEmoji}>✨</Text>
              <Text style={s.webOnlyTitle}>Generate from notes</Text>
              <Text style={s.webOnlySub}>Available on web</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.webOnlyCard, { borderColor: '#0ea5e955', backgroundColor: '#0c244833' }]}
              onPress={() => setWebOnlyModal('import')}
              activeOpacity={0.7}
            >
              <Text style={s.webOnlyEmoji}>📦</Text>
              <Text style={s.webOnlyTitle}>Import .apkg</Text>
              <Text style={s.webOnlySub}>Available on web</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.sectionLabel}>Packaged decks</Text>

          {DECKS.map((d) => (
            <TouchableOpacity
              key={d.slug}
              style={s.deckCard}
              onPress={() => router.push(`/(tabs)/flashcards/${d.slug}`)}
              activeOpacity={0.7}
            >
              <View style={s.deckTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.deckName}>{d.name}</Text>
                  <Text style={s.deckDesc} numberOfLines={1}>{d.description}</Text>
                </View>
                <View style={s.deckRight}>
                  <Text style={s.deckCount}>{d.cards.length}</Text>
                  <Text style={s.deckCountLabel}>cards</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </View>
              <Text style={s.deckCitation} numberOfLines={1}>📖 {d.citation}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Web-only handoff modal */}
      <Modal
        transparent
        animationType="fade"
        visible={webOnlyModal !== null}
        onRequestClose={() => setWebOnlyModal(null)}
      >
        <Pressable style={s.modalBackdrop} onPress={() => setWebOnlyModal(null)}>
          <Pressable style={s.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalTitle}>
              {webOnlyModal === 'generate' ? 'Generate on the web' : 'Import on the web'}
            </Text>
            <Text style={s.modalBody}>
              {webOnlyModal === 'generate'
                ? 'AI flashcard generation works best on a bigger screen — paste your notes on the web app and the cards will sync back here.'
                : 'Anki .apkg uploads are easier on the web app. Once imported, your deck reviews unlock here on mobile.'}
            </Text>
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalSecondary} onPress={() => setWebOnlyModal(null)}>
                <Text style={s.modalSecondaryText}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.modalPrimary}
                onPress={() => webOnlyModal && openWebFlow(webOnlyModal)}
              >
                <Text style={s.modalPrimaryText}>Open web app</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row' },
  chip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  chipEmerald: { backgroundColor: '#022c2255', borderColor: '#10b98155' },
  chipSky: { backgroundColor: '#0c244855', borderColor: '#0ea5e955' },
  chipRose: { backgroundColor: '#4c051355', borderColor: '#f43f5e55' },
  chipText: { fontSize: 11, color: '#e2e8f0', fontWeight: '600' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
    marginBottom: 2,
  },
  webOnlyRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  webOnlyCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  webOnlyEmoji: { fontSize: 20 },
  webOnlyTitle: { color: '#f1f5f9', fontSize: 13, fontWeight: '700', marginTop: 4 },
  webOnlySub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  deckCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  deckTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deckName: { fontSize: 15, fontWeight: '700', color: '#f1f5f9' },
  deckDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  deckRight: { alignItems: 'flex-end' },
  deckCount: { fontSize: 16, fontWeight: '800', color: '#a78bfa', fontVariant: ['tabular-nums'] },
  deckCountLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  deckCitation: { fontSize: 11, color: '#475569', marginTop: 8 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#f1f5f9', marginBottom: 8 },
  modalBody: { fontSize: 13, color: '#cbd5e1', lineHeight: 19 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalPrimary: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalSecondary: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalSecondaryText: { color: '#94a3b8', fontWeight: '600', fontSize: 14 },
});
