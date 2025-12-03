// API Configuration
class ApiConfig {
  private baseUrl: string;

  constructor() {
    // Use environment variable with fallback for development
    this.baseUrl = 'http://localhost:5077';
  }

  // Get the base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Construct full API URL
  getApiUrl(path: string = ''): string {
    // Remove leading/trailing slashes for consistency
    const cleanPath = path.replace(/^\/|\/$/g, '');
    return `${this.baseUrl}/${cleanPath}`;
  }

  // API Endpoints configuration
  endpoints = {
    // Auth endpoints
    auth: {
      login: () => this.getApiUrl('api/Auth/login'),
      register: () => this.getApiUrl('api/Auth/register'),
      refresh: () => this.getApiUrl('api/Auth/refresh'),
      logout: () => this.getApiUrl('api/Auth/logout'),
      profile: () => this.getApiUrl('api/Auth/profile'),
    },

    // Category endpoints
    categories: {
      getAll: () => this.getApiUrl('api/Category'),
      getById: (id: string) => this.getApiUrl(`api/Category/${id}`),
      create: () => this.getApiUrl('api/Category/create'),
      update: (id: string) => this.getApiUrl(`api/Category/${id}`),
      delete: (id: string) => this.getApiUrl(`api/Category/${id}`),
    },

    // Item endpoints
    items: {
      getAll: (params?: {
        currentPage?: number;
        pageSize?: number;
        sortBy?: string;
        sortDescending?: boolean;
      }) => {
        const url = this.getApiUrl('api/Item');
        if (!params) return url;
        
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        
        return queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
      },
      getById: (id: string) => this.getApiUrl(`api/Item/${id}`),
      create: () => this.getApiUrl('api/Item/create'),
      update: (id: string) => this.getApiUrl(`api/Item/${id}`),
      delete: (id: string) => this.getApiUrl(`api/Item/${id}`),
      uploadImage: () => this.getApiUrl('api/Item/upload-image'),
    },

    // User endpoints
    users: {
      getAll: () => this.getApiUrl('api/User'),
      getById: (id: string) => this.getApiUrl(`api/User/${id}`),
      create: () => this.getApiUrl('api/User/create'),
      update: (id: string) => this.getApiUrl(`api/User/${id}`),
      delete: (id: string) => this.getApiUrl(`api/User/${id}`),
      changeRole: (id: string) => this.getApiUrl(`api/User/${id}/role`),
    },
  };

  // Page routes configuration
  routes = {
    // Public routes
    public: {
      home: '/',
      login: '/auth/login',
      register: '/auth/register',
      about: '/about',
      contact: '/contact',
    },

    // Auth routes (require authentication)
    auth: {
      dashboard: '/dashboard',
      profile: '/profile',
      settings: '/settings',
    },

    // Category routes
    categories: {
      list: '/categories',
      create: '/categories/create',
      edit: (id: string) => `/categories/edit/${id}`,
      view: (id: string) => `/categories/${id}`,
    },

    // Item routes
    items: {
      list: '/items',
      create: '/items/create',
      edit: (id: string) => `/items/edit/${id}`,
      view: (id: string) => `/items/${id}`,
    },

    // Admin routes
    admin: {
      dashboard: '/admin',
      users: '/admin/users',
      analytics: '/admin/analytics',
    },
  };

  // API Headers configuration
  headers = {
    json: {
      'Content-Type': 'application/json',
    },
    formData: {
      // Don't set Content-Type for FormData - browser will set it with boundary
    },
    withAuth: (token: string) => ({
      'Authorization': `Bearer ${token}`,
    }),
    withAuthJson: (token: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }),
  };

  // HTTP Status codes
  statusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  };

  // Default settings
  settings = {
    defaultPageSize: 20,
    maxPageSize: 100,
    defaultTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    uploadLimit: '10MB', // File upload size limit
  };

  // Feature flags (can be controlled by environment variables)
  features = {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  };

  // Environment detection
  get environment() {
    return {
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      isTest: process.env.NODE_ENV === 'test',
    };
  }

  // Debug utilities (only in development)
  debug = {
    log: (message: string, data?: any) => {
      if (this.environment.isDevelopment) {
        console.log(`[API Config] ${message}`, data || '');
      }
    },
    warn: (message: string, data?: any) => {
      if (this.environment.isDevelopment) {
        console.warn(`[API Config] ${message}`, data || '');
      }
    },
    error: (message: string, data?: any) => {
      console.error(`[API Config] ${message}`, data || '');
    },
  };
}

// Create and export singleton instance
export const apiConfig = new ApiConfig();

// Utility functions
export const ApiUtils = {
  // Generate query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return searchParams.toString();
  },

  // Handle API errors consistently
  handleApiError: async (response: Response): Promise<never> => {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorText = await response.text();
      if (errorText) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.title || errorMessage;
      }
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new Error(errorMessage);
  },

  // Check if response is successful
  isSuccess: (status: number): boolean => {
    return status >= 200 && status < 300;
  },

  // Format API response
  formatResponse: async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      await ApiUtils.handleApiError(response);
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  },

  // Get auth token from storage
  getAuthToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Set auth token in storage
  setAuthToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },

  // Remove auth token from storage
  removeAuthToken: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  },
};

// Default export
export default apiConfig;