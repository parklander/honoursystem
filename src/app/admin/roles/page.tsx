'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserWithRoles {
  id: string;
  full_name: string;
  email?: string;
  roles: string[];
  membership_status: string;
}

interface Role {
  role: string;
  description: string;
  hierarchy_level: number;
}

// Add type for the raw data from Supabase
interface UserProfileRow {
  id: string;
  full_name: string;
  roles: string[];
  membership_status: string;
}

export default function RoleManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // First check auth status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Auth Session:', {
          session,
          error: sessionError
        });

        if (!session) {
          console.log('No session found, redirecting to login');
          router.push('/login');
          return;
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('roles')
          .eq('id', user?.id)
          .single();

        console.log('Admin check:', {
          profile,
          error: profileError
        });

        if (profileError || !profile?.roles?.includes('admin')) {
          console.log('User is not admin, redirecting...');
          router.push('/dashboard');
          return;
        }

        // Fetch all users with their roles
        const { data, error: usersError } = await supabase
          .from('user_profiles')
          .select('id, full_name, roles, membership_status') as { data: UserProfileRow[] | null, error: any };

        console.log('Users data:', {
          data: data,
          error: usersError
        });

        if (usersError) {
          console.error('Users error:', usersError);
          throw usersError;
        }

        const usersData = data?.map((user: UserProfileRow) => ({
          id: user.id,
          full_name: user.full_name,
          roles: user.roles,
          membership_status: user.membership_status
        })) || [];

        setUsers(usersData);

        // Fetch roles enum values
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .order('hierarchy_level');

        console.log('Roles data:', {
          data: rolesData,
          error: rolesError
        });

        if (rolesError) {
          console.error('Roles error:', rolesError);
          throw rolesError;
        }

        setRoles(rolesData || []);

      } catch (err) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint,
          stack: err.stack
        });
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, supabase]);

  const updateUserRoles = async (userId: string, newRoles: string[]) => {
    try {
      setError(null);
      setSuccess(null);

      const { error } = await supabase
        .from('user_profiles')
        .update({ roles: newRoles })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === userId ? { ...u, roles: newRoles } : u
      ));
      setSuccess('Roles updated successfully');
    } catch (err) {
      console.error('Error updating roles:', err);
      setError('Failed to update roles');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Role Management</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

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

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Roles</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="py-3 px-4">{user.full_name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.membership_status === 'active' ? 'bg-green-600' :
                        user.membership_status === 'pending' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        {user.membership_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="bg-blue-600 px-2 py-1 rounded-full text-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {roles.map((role) => (
                          <button
                            key={role.role}
                            onClick={() => {
                              const newRoles = user.roles.includes(role.role)
                                ? user.roles.filter(r => r !== role.role)
                                : [...user.roles, role.role];
                              updateUserRoles(user.id, newRoles);
                            }}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              user.roles.includes(role.role)
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            title={role.description}
                          >
                            {user.roles.includes(role.role) ? '-' : '+'} {role.role}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 