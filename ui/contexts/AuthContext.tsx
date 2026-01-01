'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterRequest, AuthResponse, UserDto, UserRole } from '@/types/auth';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { decodeToken, getUserRole } from '@/utils/auth';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<UserRole | null>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {

    var userRole: UserRole | null = null;
    try {
      const data  = await authService.login(credentials);

      const decodedToken = decodeToken(data.token);
      userRole = getUserRole(decodedToken);

      const userData: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: userRole,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString()
      };

      
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      
      setState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

    } catch (error) {
      toast.error("Login failed. Please try again.");
    }

    return userRole;
  };

  const register = async (credentials: RegisterRequest) => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(credentials);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (state.user) {
      setState({
        ...state,
        user: { ...state.user, ...updatedUser },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
