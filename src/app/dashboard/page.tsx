'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_profiles')
        .select('roles')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(data?.roles?.includes('admin') || false);
    };
    
    checkAdminStatus();
  }, [user, supabase]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Profile Settings
            </button>
            {isAdmin && (
              <button
                onClick={() => router.push('/admin/roles')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Manage Roles
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.user_metadata.full_name || user.email}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                    sizes="64px"
                    onError={(e) => {
                      // If image fails to load, replace with fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.classList.add('bg-gray-600', 'flex', 'items-center', 'justify-center');
                      target.parentElement!.innerHTML = `<span class="text-2xl text-white">${
                        (user.user_metadata.full_name || user.email || 'U')[0].toUpperCase()
                      }</span>`;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">
                      {(user.user_metadata.full_name || user.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-300">Email: {user.email}</p>
                <p className="text-gray-300">Discord ID: {user.user_metadata.provider_id}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
                  Book a Tool
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
                  View Certifications
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
                  Log Consumables
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 