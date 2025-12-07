export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}