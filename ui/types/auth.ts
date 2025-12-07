export interface RegisterRequest {
  firstName: string;
  lastName: string;
  address: string;
  roles: string[];  // Empty array for customers
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;  // Guid as string
  customerId: string;  // Guid as string
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// Update existing User interface
export interface User {
  userId: string;  // Changed from id: number
  customerId: string;  // New field
  email: string;
  firstName: string;
  lastName: string;
  address?: string;  // Optional since it's not in AuthResponse
  isLoggedIn: boolean;
  token?: string;
}