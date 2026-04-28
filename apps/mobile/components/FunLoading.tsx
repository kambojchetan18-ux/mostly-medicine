import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

const DEFAULT_POOL: string[] = [
  '🩺 Polishing the stethoscope…',
  '🧠 Loading neurons…',
  "📚 Asking the AI examiner (don't tell them)…",
  '🤔 Channeling our inner Sherlock…',
  '💊 Prescribing patience…',
  '🩸 Counting your white cells…',
  '📋 Reading the handbook for the 100th time…',
  '🤖 Bribing Claude with biscuits…',
];

const ROTATE_MS = 1500;
const PRIMARY = '#7c3aed';

type FunLoadingProps = {
  pool?: string[];
  style?: StyleProp<ViewStyle>;
};

export default function FunLoading({ pool, style }: FunLoadingProps) {
  const messages = pool && pool.length > 0 ? pool : DEFAULT_POOL;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [messages]);

  return (
    <View style={[styles.row, style]}>
      <ActivityIndicator size="small" color={PRIMARY} />
      <Text style={styles.text} numberOfLines={2}>
        {messages[idx]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    flexShrink: 1,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});
