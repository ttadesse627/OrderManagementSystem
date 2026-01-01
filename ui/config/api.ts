import { UUID } from "crypto";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/Auth/login',
  LOGOUT: '/Auth/logout',
  REFRESH_TOKEN: '/Auth/refresh-token',

    // Users
  USERS: '/User',
  USER_REGISTER: '/User/register',
  USER_UPDATE: (id: UUID) => `/User/${id}/update`,
  USER_DELETE: (id: UUID) => `/User/${id}/delete`,
  USER_BY_ID: (id: UUID) => `/User/${id}`,
  USER_PROFILE: '/User/profile',
  
  // Products
  PRODUCTS: '/Product',
  PRODUCT_BY_ID: (id: UUID) => `/Product/${id}`,
  CREATE_PRODUCT: `/Product/create`,
  UPDATE_PRODUCT: (id: UUID) => `/Product/${id}/update`,
  DELETE_PRODUCT: (id: UUID) => `/Product/${id}/delete`,
  
  // Orders
  ORDERS: '/Order',
  CREATE_ORDER: '/Order/create',
  ORDER_BY_ID: (id: UUID) => `/Order/${id}`,
  MY_ORDERS: '/orders/my',
  
  // Categories
  CATEGORIES: '/Category',
  CREATE_CATEGORY: '/Category/create',
  CATEGORY_BY_ID: (id: UUID) => `/Category/${id}`,
  
  // Cart
  CART: '/cart',
  CART_ITEM: (id: UUID) => `/cart/${id}`,
} as const;