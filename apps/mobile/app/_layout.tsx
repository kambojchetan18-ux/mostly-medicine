import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ALLOWED_DEEP_LINK_PATHS = new Set([
  '/(tabs)',
  '/(tabs)/cat1',
  '/(tabs)/cat2',
  '/(tabs)/roleplay',
  '/(tabs)/progress',
  '/(tabs)/library',
  '/(tabs)/jobs',
  '/auth/login',
  '/auth/signup',
]);

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

  // Validate incoming deep links against known routes
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      try {
        const url = new URL(event.url);
        const path = url.pathname || '/';
        if (!ALLOWED_DEEP_LINK_PATHS.has(path) && !path.startsWith('/(tabs)/')) {
          console.warn('[deep-link] blocked unknown path:', path);
          return;
        }
      } catch {
        console.warn('[deep-link] invalid URL:', event.url);
      }
    };
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
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
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </GestureHandlerRootView>
  );
}
