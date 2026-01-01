import { RegisterRequest, UserDto} from '../types/user';
import { ApiResponse } from '../types/apiResponse';
import { apiClient } from '../config/apiClient';
import { UUID } from 'crypto';
import { AuthResponse } from '@/types/auth';

export class UserService {

  async create(request: RegisterRequest){
      return apiClient.post<AuthResponse>(`/User/register`, request)
    }
    
  async getAll() {
    return apiClient.get<Array<UserDto>>("/User");
  }

  async getById(id: UUID) {
    return apiClient.get<UserDto>(`/User/${id}`);
  }

  async update(id: string, request: RegisterRequest){
      return apiClient.put<ApiResponse<string>>(`/User/${id}/update`, request)
    }

  async deleteById(id: UUID) {
    return apiClient.delete<ApiResponse<string>>(`User/${id}/delete`);
  }
};