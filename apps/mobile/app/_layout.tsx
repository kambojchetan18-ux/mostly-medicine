import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === 'auth';
    if (!session && !inAuth) router.replace('/auth/login');
    if (session && inAuth) router.replace('/(tabs)');
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: 24 }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#f8fafc', marginBottom: 8, textAlign: 'center' }}>
        Something went wrong
      </Text>
      <Text style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, textAlign: 'center' }}>
        {error.message}
      </Text>
      <TouchableOpacity
        onPress={retry}
        style={{ backgroundColor: '#7c3aed', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </GestureHandlerRootView>
  );
}
