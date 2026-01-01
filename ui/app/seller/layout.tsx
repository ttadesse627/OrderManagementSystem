'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sellerNavItems = [
  { href: '/seller/dashboard', label: 'Dashboard' },
  { href: '/seller/products', label: 'Products' },
  { href: '/seller/orders', label: 'Orders' },
  { href: '/seller/profile', label: 'Profile' },
];

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useProtectedRoute({ requiredRole: 'Seller' });
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products and orders</p>
          </div>
        </div>
        
        <nav className="mt-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {sellerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <div>{children}</div>
    </div>
  );
}