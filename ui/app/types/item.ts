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

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  imageUrl?: string;
}