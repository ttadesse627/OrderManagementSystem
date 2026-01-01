'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show navbar on auth pages
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}