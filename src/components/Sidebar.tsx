'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect, useState } from 'react';
import { createClientClient } from '@/lib/supabase/client';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientClient();

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

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    ...(isAdmin ? [{ href: '/admin/roles', label: 'Role Management' }] : []),
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold">HonourSystem</h1>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 hover:bg-gray-700 ${
              pathname === link.href ? 'bg-gray-700' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 