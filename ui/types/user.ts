import { User } from './auth';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export type UserWithStats = User & {
  totalOrders?: number;
  totalSpent?: number;
  totalProducts?: number;
  totalSales?: number;
};