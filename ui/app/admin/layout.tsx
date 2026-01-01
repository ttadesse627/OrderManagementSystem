'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useProtectedRoute({ requiredRole: 'Admin' });
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage the entire platform</p>
          </div>
        </div>
        
        <nav className="mt-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'border-red-500 text-red-600'
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