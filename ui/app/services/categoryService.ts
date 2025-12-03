import { CategoryRequest, CategoryDto} from '../types/category';
import { ApiResponse } from '../types/apiResponse';
import { apiConfig } from '../../config/api';
import { getAuthToken } from '../utils/auth';

class CategoryService
{
    private baseUrl = apiConfig.endpoints.categories.getAll();

    async getAllCategories(): Promise<CategoryDto[]> {
          const token = getAuthToken();
          const response = await fetch(apiConfig.getApiUrl(this.baseUrl), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

      if (!response.ok)
      {
          throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      return result.data || result;
    }

    async getCategoryById(id: string): Promise<CategoryDto> {
      const token = getAuthToken();
      const response = await fetch(apiConfig.getApiUrl(`${ this.baseUrl}/${ id}`), {
        headers:
          {
            'Authorization': `Bearer ${ token}`,
            'Content-Type': 'application/json'
          }
        });

      if (!response.ok)
      {
        throw new Error('Failed to fetch category');
      }

      const result = await response.json();
      return result.data || result;
    }

async createCategory(request: CategoryRequest): Promise<string> {
    const token = getAuthToken();
    const response = await fetch(apiConfig.getApiUrl(`${ this.baseUrl}/ create`), {
    method: 'POST',
      headers:
        {
          'Authorization': `Bearer ${ token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
    }

    const result = await response.json();
    return result.data;
}

async updateCategory(id: string, request: CategoryRequest): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(apiConfig.getApiUrl(`${ this.baseUrl}/${ id}`), {
    method: 'PUT',
      headers:
        {
          'Authorization': `Bearer ${ token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
    }
}

async deleteCategory(id: string): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(apiConfig.getApiUrl(`${ this.baseUrl}/${ id}`), {
    method: 'DELETE',
      headers:
        {
            'Authorization': `Bearer ${ token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
    }
}
}

export const categoryService = new CategoryService();