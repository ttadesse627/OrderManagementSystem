import { UUID } from "crypto";

export type UserRole = 'Customer' | 'Seller' | 'Admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  role: UserRole;
  token: string;
  refreshToken: string;
}

export interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | null;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  address: string;
  roles: UserRole[];
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserDto {
  userId: UUID; 
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  role: UserRole | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}