import { UUID } from "crypto";

export interface CategoryRequest {
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
  id: UUID; //
  name: string;
  price: number;
  stockQuantity: number;
  category?: CategoryDto;
  imageUrl: string;
}

export interface CategoryDto {
  id: UUID;
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

export interface ProductCreateRequest {
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  image: File;
}

export interface ProductResponse {
  id: UUID;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}


//

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  seller?: {
    id: string;
    name: string;
  };
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: UUID;
  images: File[];
}

export interface ProductDetailDto {
  id: UUID;
  name: string;
  price: number;
  stockQuantity: number;
  category?: CategoryDto;
  imageUrls: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}