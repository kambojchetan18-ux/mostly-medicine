import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// SecureStore adapter for Supabase auth tokens. Uses encrypted device
// keychain instead of plaintext AsyncStorage. Falls back to AsyncStorage
// for values exceeding SecureStore's 2048-byte limit (rare for JWTs).
const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key)
    } catch {
      return AsyncStorage.getItem(key)
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (value.length > 2048) {
        await SecureStore.deleteItemAsync(key).catch(() => {})
        await AsyncStorage.setItem(key, value)
        return
      }
      await AsyncStorage.removeItem(key).catch(() => {})
      await SecureStore.setItemAsync(key, value)
    } catch {
      await AsyncStorage.setItem(key, value)
    }
  },
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key).catch(() => {})
    await AsyncStorage.removeItem(key).catch(() => {})
  },
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
