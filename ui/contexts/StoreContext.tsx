'use client';

import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Add new interfaces for API requests


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  user: User | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (registerData: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // API call functions
  const apiRegister = async (registerData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...registerData,
        roles: [] // Always empty array for customer registration
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Registration failed';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  const apiLogin = async (loginData: LoginRequest): Promise<AuthResponse> => {
    // You'll need to implement this endpoint on your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Login failed';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  // Updated login function
  const login = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = { email, password };
      const authResponse = await apiLogin(loginData);
      
      // Save user data and token
      const userData: User = {
        userId: authResponse.userId,
        customerId: authResponse.customerId,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        isLoggedIn: true,
        token: authResponse.token
      };
      
      setUser(userData);

      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  };

  // Updated register function
  const register = async (registerData: RegisterRequest) => {
    try {
      const authResponse = await apiRegister(registerData);
      
      // Save user data and token
      const userData: User = {
        userId: authResponse.userId,
        customerId: authResponse.customerId,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        address: registerData.address, // Keep address from registration form
        isLoggedIn: true,
        token: authResponse.token
      };
      
      setUser(userData);

      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('cart'); // Also clear cart on logout if needed
    }
  };

  // Add other existing functions (addToCart, removeFromCart, etc.)
  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Initialize user from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedUser = localStorage.getItem('user');
        const savedCart = localStorage.getItem('cart');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser({
            ...userData,
            isLoggedIn: true
          });
        }
        
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCart(cartData);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
      } finally {
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        login,
        logout,
        register
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};