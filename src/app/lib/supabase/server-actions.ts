'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../database.types'

interface UnpaidOrder {
  id: string;
  user_id: string;
  total_price: number;
  quantity: number;
  consumables: {
    name: string;
    unit: string;
  };
  user_profiles: {
    full_name: string;
  };
}

export async function getServerSupabase() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { expires?: Date }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { expires?: Date }) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )
}

export async function fetchUnpaidOrders(): Promise<UnpaidOrder[]> {
  try {
    const cookieStore = cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: { expires?: Date }) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: { expires?: Date }) {
            cookieStore.set({ name, value: '', ...options })
          }
        }
      }
    )

    const { data, error } = await supabase
      .from('consumable_purchases')
      .select(`
        id,
        user_id,
        total_price,
        quantity,
        consumables (
          name,
          unit
        ),
        user_profiles (
          full_name
        )
      `)
      .eq('status', 'unpaid')

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export async function fetchUserOrders() {
  try {
    const supabase = await getServerSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('consumable_purchases')
      .select(`
        id,
        user_id,
        total_price,
        quantity,
        status,
        updated_at,
        consumables (
          name,
          unit
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data || []

  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
} 