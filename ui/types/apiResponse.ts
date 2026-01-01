export interface ApiResponse<T = any> {
  data: T | null;
  message?: string;
  errors?: string[];
  success?: boolean;
}

export interface PaginatedResult<T = any> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}