import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClientSupabaseClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
} 