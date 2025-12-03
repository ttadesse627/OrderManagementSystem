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