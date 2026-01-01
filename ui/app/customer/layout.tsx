'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useProtectedRoute({ requiredRole: 'Customer' });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your orders and profile</p>
      </div>
      {children}
    </div>
  );
}