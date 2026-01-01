import { getUserRole } from '@/utils/auth';
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };
  
  const isCustomer = hasRole('Customer');
  const isSeller = hasRole('Seller');
  const isAdmin = hasRole('Admin');
  
  return {
    role: user?.role,
    hasRole,
    isCustomer,
    isSeller,
    isAdmin,
  };
};