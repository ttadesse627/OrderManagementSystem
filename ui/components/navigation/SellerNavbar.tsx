'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SellerNavbar() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/seller/dashboard" className="text-xl font-bold text-green-600">
              Seller Portal
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link
                href="/seller/dashboard"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/seller/products"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/seller/orders"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/seller/products/create"
                className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Product
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors">
                <User className="h-5 w-5 text-gray-600" />
                <span className="hidden md:inline text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 invisible group-hover:visible">
                <Link
                  href="/seller/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  href="/seller/orders"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}