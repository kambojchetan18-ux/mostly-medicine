import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        // session available for future auth routing
      } catch (e) {
        console.error('Session check failed:', e);
        // don't crash, just show the app
      }
    }
    checkSession();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="roleplay/[id]" options={{ headerBackTitle: "Back" }} />
      </Stack>
    </>
  );
}
