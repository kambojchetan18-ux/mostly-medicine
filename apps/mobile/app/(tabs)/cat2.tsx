import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CAT2Screen() {
  return (
    <View style={s.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View>
            <Text style={s.title}>AMC Handbook AI RolePlay</Text>
            <Text style={s.sub}>OSCE-style clinical practice</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, gap: 12 }}>
          <TouchableOpacity
            style={s.card}
            onPress={() => router.push('/(tabs)/roleplay' as any)}
            activeOpacity={0.7}
          >
            <View style={[s.iconWrap, { backgroundColor: '#8b5cf622' }]}>
              <Ionicons name="chatbubbles" size={26} color="#8b5cf6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>AMC Clinical AI RolePlay</Text>
              <Text style={s.cardSub}>AI-driven AMC clinical roleplays with voice</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#475569" />
          </TouchableOpacity>

          <View style={s.infoCard}>
            <Text style={s.infoTitle}>About AMC Handbook AI RolePlay</Text>
            <Text style={s.infoText}>
              Practice OSCE-style clinical scenarios with an AI patient simulator. New
              structured station packs are being prepared and will appear here soon.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 12 },
  back: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1e293b', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#334155',
  },
  iconWrap: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#f1f5f9' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  infoCard: {
    backgroundColor: '#1e1b4b', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#4c1d95',
  },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#e9d5ff', marginBottom: 6 },
  infoText: { fontSize: 12, color: '#a78bfa', lineHeight: 18 },
});
