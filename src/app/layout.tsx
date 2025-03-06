import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HonourSystem - Makerspace Management",
  description: "Modern makerspace management system for tracking tools, spaces, and members.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
