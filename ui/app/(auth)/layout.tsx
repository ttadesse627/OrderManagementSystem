'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const userRole = user?.role;

  console.log('Loading status:', isLoading);
  console.log('Authentication status:', isAuthenticated);
  console.log('User role:', userRole);

  useEffect(() => {
    if (!isLoading && isAuthenticated && userRole) {
      switch (userRole) {
        case "Customer":
          router.push("/customer/dashboard");
          break;
        case "Seller":
          router.push("/seller/dashboard");
          break;
        case "Admin":
          router.push("/admin/dashboard");
          break;
      }
    }
  }, [userRole, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}