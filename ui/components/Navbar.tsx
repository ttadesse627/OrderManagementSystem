'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PublicNavbar from './navigation/PublicNavbar';
import CustomerNavbar from './navigation/CustomerNavbar';
import SellerNavbar from './navigation/SellerNavbar';
import AdminNavbar from './navigation/AdminNavbar';
    
export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isCustomer, isSeller, isAdmin } = useRole();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null;
  }

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  if (!isAuthenticated) {
    return <PublicNavbar />;
  }

  if (isCustomer) {
    return <CustomerNavbar />;
  }

  if (isSeller) {
    return <SellerNavbar />;
  }

  if (isAdmin) {
    return <AdminNavbar />;
  }

  return <PublicNavbar />;
}