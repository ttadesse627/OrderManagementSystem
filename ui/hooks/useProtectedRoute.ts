'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { useRole } from './useRole';

interface UseProtectedRouteOptions {
  requiredRole?: 'Customer' | 'Seller' | 'Admin';
  redirectTo?: string;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole } = useRole();
  const { requiredRole, redirectTo = '/' } = options;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requiredRole, hasRole, router, redirectTo]);

  return { isLoading: isLoading || !isAuthenticated };
};