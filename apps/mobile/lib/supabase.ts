import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL is not defined. Set it in your .env or EAS secrets.'
  )
}
if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined. Set it in your .env or EAS secrets.'
  )
}

// expo-secure-store has a 2048-byte value limit.  Supabase auth tokens
// (especially with long JWTs) can exceed that, so we chunk large values
// across multiple SecureStore entries and store a chunk count header.
const CHUNK_SIZE = 2048

const secureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const raw = await SecureStore.getItemAsync(key)
    if (raw === null) return null

    // If the sentinel value starts with "__chunk_count:" the real value
    // was split across numbered keys.
    if (raw.startsWith('__chunk_count:')) {
      const count = parseInt(raw.replace('__chunk_count:', ''), 10)
      const chunks: string[] = []
      for (let i = 0; i < count; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`)
        if (chunk === null) return null // corrupted — treat as missing
        chunks.push(chunk)
      }
      return chunks.join('')
    }

    return raw
  },

  async setItem(key: string, value: string): Promise<void> {
    // Clean up any previous chunks before writing a new value.
    await secureStoreAdapter.removeItem(key)

    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value)
      return
    }

    const count = Math.ceil(value.length / CHUNK_SIZE)
    await SecureStore.setItemAsync(key, `__chunk_count:${count}`)
    for (let i = 0; i < count; i++) {
      await SecureStore.setItemAsync(
        `${key}_chunk_${i}`,
        value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      )
    }
  },

  async removeItem(key: string): Promise<void> {
    const raw = await SecureStore.getItemAsync(key)
    if (raw !== null && raw.startsWith('__chunk_count:')) {
      const count = parseInt(raw.replace('__chunk_count:', ''), 10)
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}_chunk_${i}`)
      }
    }
    await SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
