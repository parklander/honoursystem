import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';

export async function GET() {
  try {
    const cookieStore = cookies();
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: { path: string; maxAge?: number; domain?: string; secure?: boolean }) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Handle route handlers which can't set cookies
              console.warn('Unable to set cookie in route handler');
            }
          },
          remove(name: string, options: { path: string }) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Handle route handlers which can't set cookies
              console.warn('Unable to remove cookie in route handler');
            }
          },
        },
      }
    );

    // First verify admin status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('roles')
      .eq('id', user.id)
      .single();

    if (!profile?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get user profiles with metadata
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, metadata');

    if (profilesError) {
      throw profilesError;
    }

    // Format user data
    const userMap = profiles.reduce((acc, profile) => {
      const metadata = profile.metadata || {};
      acc[profile.id] = {
        email: metadata.email || 'No email',
        name: metadata.full_name || metadata.email?.split('@')[0] || 'Unknown User'
      };
      return acc;
    }, {} as Record<string, { email: string; name: string }>);

    return NextResponse.json({ users: userMap });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 