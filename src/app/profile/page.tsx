'use client';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  roles: string[];
  membership_status: string;
  phone_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  notes?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = useMemo(() => createClientSupabaseClient(), []);

  const handleError = (error: Error | PostgrestError) => {
    console.error('Error:', error);
    toast.error(error.message || 'An error occurred');
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    console.log('Current user:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });

    const fetchProfile = async () => {
      try {
        // First check auth status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Auth Session:', {
          session,
          error: sessionError,
          accessToken: session?.access_token
        });

        if (!session) {
          console.log('No session found, redirecting to login');
          router.push('/login');
          return;
        }

        // Try to get the profile
        console.log('Attempting to fetch profile for user:', user?.id);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user?.id)
          .limit(1)
          .maybeSingle();

        console.log('Profile query result:', {
          userId: user?.id,
          data,
          error
        });

        if (error) {
          if (error instanceof PostgrestError) {
            console.error('Database error:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
          } else {
            console.error('Unknown error:', error);
          }
          throw error;
        }

        if (!data) {
          toast.error('Profile not found');
          return;
        }

        setProfile({
          id: data.id,
          full_name: data.full_name,
          roles: data.roles,
          membership_status: data.membership_status,
          phone_number: data.phone_number,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_phone: data.emergency_contact_phone,
          emergency_contact_relationship: data.emergency_contact_relationship,
          notes: data.notes,
          created_at: data.created_at
        });
      } catch (error) {
        handleError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          emergency_contact_name: profile.emergency_contact_name,
          emergency_contact_phone: profile.emergency_contact_phone,
          emergency_contact_relationship: profile.emergency_contact_relationship,
          notes: profile.notes,
        })
        .eq('id', user?.id);

      if (error) throw error;
      setSuccess('Profile updated successfully');
    } catch (error) {
      handleError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Profile not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone_number || ''}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={profile.emergency_contact_name || ''}
                    onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={profile.emergency_contact_phone || ''}
                    onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    value={profile.emergency_contact_relationship || ''}
                    onChange={(e) => setProfile({ ...profile, emergency_contact_relationship: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={profile.notes || ''}
                    onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}