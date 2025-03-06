'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect, useState } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClientSupabaseClient();

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

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/profile', label: 'Profile' },
    ...(isAdmin ? [
      { href: '/admin/roles', label: 'Role Management' },
      { href: '/admin/balances', label: 'User Balances' }
    ] : []),
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white bg-gray-800 hover:bg-gray-700"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-64 h-full">
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
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
} 