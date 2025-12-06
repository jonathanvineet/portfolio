import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fwbvvdduuzcheibmjrhn.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

// Avoid throwing at import time so the app can still boot in environments
// where the public anon key is not set (e.g. during local dev or CI).
if (!supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_SUPABASE_KEY is not set — Supabase client will be disabled.')
}

export const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
