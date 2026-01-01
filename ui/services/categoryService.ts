import { CategoryRequest, CategoryDto} from '../types/category';
import { ApiResponse } from '../types/apiResponse';
import apiClient from '../config/apiClient';
import { UUID } from 'crypto';

class CategoryService {

  async create(request: CategoryRequest){
      return apiClient.post(`/Category/create`, request)
    }
    
  async getAll() {
    return apiClient.get<Array<CategoryDto>>("/Category");
  }

  async getById(id: UUID) {
    return apiClient.get<CategoryDto>(`/Category/${id}`);
  }

  async update(id: string, request: CategoryRequest){
      return apiClient.put(`/Category/${id}/update`, request)
    }

  async deleteById(id: UUID) {
    return apiClient.delete<ApiResponse<string>>(`Category/${id}/delete`);
  }

};

export const categoryService = new CategoryService();

