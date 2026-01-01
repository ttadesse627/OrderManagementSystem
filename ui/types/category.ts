import { UUID } from "crypto";

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryDto {
  id: UUID;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
  // createdAt: string;
  // updatedAt: string;
}