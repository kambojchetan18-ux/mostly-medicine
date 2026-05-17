import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0f172a',
            padding: 24,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#f1f5f9', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 24 }}>
            The app ran into an unexpected error.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false })}
            style={{
              backgroundColor: '#7c3aed',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 32,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

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

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGate>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
