import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../database.types'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: { expires?: Date }) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie error
          }
        },
        remove(name: string, options: { expires?: Date }) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // Handle cookie error
          }
        }
      }
    }
  )
} 