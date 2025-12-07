export interface ItemRequest {
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  imageUrl?: string;
}


export interface ProductDto {
  id: string; // Guid
  name: string;
  price: number;
  stockQuantity: number;
  category?: CategoryDto;
  imageUrl: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// For internal use in the cart
export interface CartProduct {
  id: number; // Temporary numeric ID for cart
  productId: string; // Original Guid from API
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}