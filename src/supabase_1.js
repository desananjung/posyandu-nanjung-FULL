import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback ke localStorage jika belum setting Supabase (untuk demo offline)
export const isSupabaseConfigured = Boolean(url && key && url.includes('supabase.co'))

export const supabase = isSupabaseConfigured 
  ? createClient(url, key)
  : null

console.log('Supabase configured:', isSupabaseConfigured)
