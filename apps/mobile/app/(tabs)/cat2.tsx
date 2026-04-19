import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { recalls } from '@mostly-medicine/content';
import type { RecallMonth } from '@mostly-medicine/content';

const CATEGORIES = ['All', 'Medicine & Surgery', 'Psychiatry', 'Paediatrics', 'Counselling', 'PE'] as const;
type Filter = typeof CATEGORIES[number];

const CAT_COLOR: Record<string, string> = {
  'Medicine & Surgery': '#7c3aed',
  'Psychiatry': '#ec4899',
  'Paediatrics': '#0ea5e9',
  'Counselling': '#10b981',
  'PE': '#f59e0b',
};

export default function CAT2Screen() {
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'All' ? recalls : recalls.filter((r) => r.category === filter);

  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View>
            <Text style={s.title}>AMC CAT 2 Recalls</Text>
            <Text style={s.sub}>OSCE station cases by month</Text>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[s.chip, filter === c && s.chipActive]}
              onPress={() => setFilter(c)}
            >
              <Text style={[s.chipText, filter === c && s.chipTextActive]}>
                {c === 'All' ? `All (${recalls.reduce((n, r) => n + r.items.length, 0)})` : c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, gap: 12 }}>
          {filtered.map((month: RecallMonth) => {
            const key = `${month.month}${month.year}${month.category}`;
            const isOpen = expanded === key;
            const color = CAT_COLOR[month.category] ?? '#7c3aed';
            return (
              <View key={key} style={s.monthCard}>
                <TouchableOpacity style={s.monthHeader} onPress={() => setExpanded(isOpen ? null : key)} activeOpacity={0.7}>
                  <View style={[s.catDot, { backgroundColor: color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.monthTitle}>{month.month} {month.year} — {month.category}</Text>
                    <Text style={s.monthCount}>{month.items.length} stations</Text>
                  </View>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
                </TouchableOpacity>

                {isOpen && (
                  <View style={s.stationList}>
                    {month.items.map((item) => (
                      <View key={item.number} style={s.stationRow}>
                        <View style={[s.stationNum, { backgroundColor: color + '22' }]}>
                          <Text style={[s.stationNumText, { color }]}>{item.number}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.stationTitle}>{item.title}</Text>
                          <View style={s.tagsRow}>
                            {item.tasks.map((t) => (
                              <View key={t} style={s.taskChip}>
                                <Text style={s.taskChipText}>{t}</Text>
                              </View>
                            ))}
                          </View>
                          <View style={s.tagsRow}>
                            {item.tags.map((t) => (
                              <Text key={t} style={s.tag}>{t}</Text>
                            ))}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 },
  back: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  filterRow: { marginBottom: 14, flexGrow: 0 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  chipActive: { backgroundColor: '#4c1d95', borderColor: '#7c3aed' },
  chipText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  chipTextActive: { color: '#e9d5ff' },
  monthCard: { backgroundColor: '#1e293b', borderRadius: 14, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  monthHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  monthTitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9' },
  monthCount: { fontSize: 11, color: '#64748b', marginTop: 2 },
  stationList: { borderTopWidth: 1, borderTopColor: '#334155', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 14, gap: 12 },
  stationRow: { flexDirection: 'row', gap: 10 },
  stationNum: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 2 },
  stationNumText: { fontSize: 12, fontWeight: '800' },
  stationTitle: { fontSize: 13, fontWeight: '600', color: '#e2e8f0', lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 },
  taskChip: { backgroundColor: '#1e1b4b', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#4c1d95' },
  taskChipText: { fontSize: 10, color: '#a78bfa', fontWeight: '600' },
  tag: { fontSize: 10, color: '#475569' },
});
