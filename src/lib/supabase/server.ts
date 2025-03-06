import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge?: number; domain?: string; secure?: boolean }) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle route handlers which can't set cookies
            console.warn('Unable to set cookie in route handler')
          }
        },
        remove(name: string, options: { path: string }) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle route handlers which can't set cookies
            console.warn('Unable to remove cookie in route handler')
          }
        },
      },
    }
  )
} 