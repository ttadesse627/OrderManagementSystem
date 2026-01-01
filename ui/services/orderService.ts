import apiClient from '@/config/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import { Order, CreateOrderDto } from '@/types/order';
import { PaginatedResponse } from '@/types/apiResponse';
import { UUID } from 'crypto';

export const orderService = {
  async getOrders(params?: {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
  }): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS, { params });
    return response.data;
  },

  async getOrderById(id: UUID): Promise<Order> {
    const response = await apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
    return response.data;
  },

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS, data);
    return response.data;
  },

  async updateOrderStatus(id: UUID, status: string): Promise<Order> {
    const response = await apiClient.patch(API_ENDPOINTS.ORDER_BY_ID(id), { status });
    return response.data;
  },

  async getMyOrders(params?: {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
  }): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.MY_ORDERS, { params });
    return response.data;
  },

  async cancelOrder(id: UUID): Promise<Order> {
    const response = await apiClient.patch(`${API_ENDPOINTS.ORDER_BY_ID(id)}/cancel`);
    return response.data;
  },
};