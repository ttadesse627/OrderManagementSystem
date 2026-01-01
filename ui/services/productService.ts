

import {apiClient} from '@/config/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import { Product, CreateProductDto, UpdateProductDto, ProductResponse } from '@/types/product';
import { PaginatedResult } from '@/types/apiResponse';
import { UUID } from 'crypto';

export const productService = {
  async getProducts(params?: {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending: boolean;
  }): Promise<PaginatedResult<ProductResponse>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },

  async getProductById(id: UUID): Promise<Product> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_PRODUCT, data);
    return response.data;
  },

  async updateProduct(id: UUID, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_PRODUCT(id), data);
    return response.data;
  },

  async deleteProduct(id: UUID): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DELETE_PRODUCT(id));
  },

  async getSellerProducts(params?: {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending: boolean;
  }): Promise<PaginatedResult<Product>> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/seller`, { params });
    return response.data;
  },
};
