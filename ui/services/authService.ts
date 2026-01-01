

import {apiClient} from '@/config/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import { LoginCredentials, RegisterRequest, User, AuthResponse } from '@/types/auth';
import toast from 'react-hot-toast';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);

    console.log("login response from authService: ",response.data)
    return response.data;
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.USER_REGISTER, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  async getCurrentUser(): Promise<User | null> {

    var currentUser = JSON.parse(localStorage.getItem("user")?? "");
      return currentUser;
  },

  async getUserProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      toast.error("");
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },
};

