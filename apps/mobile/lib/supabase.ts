import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Hardcoded to prevent process.env / Constants.expoConfig failures on Android
const SUPABASE_URL = 'https://bzfrnxibcilsfyvgiqot.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZnJueGliY2lsc2Z5dmdpcW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjk3MjksImV4cCI6MjA4OTg0NTcyOX0.ikXCcXVu2EKgQD5eArubV6gGWsjL92yK_tmYhmCrmMo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
