import { ProductDto, PaginatedResponse } from '../../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5077';

export class ProductService {
  private static readonly BASE_URL = `${API_BASE_URL}/api/Product`;

  /**
   * Get all products with pagination
   */
  static async getProducts(
    currentPage: number = 1,
    pageSize: number = 20,
    sortBy?: string,
    sortDescending: boolean = false
  ): Promise<PaginatedResponse<ProductDto>> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('currentPage', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      params.append('sortDescending', sortDescending.toString());

      const url = `${this.BASE_URL}?${params.toString()}`;
      console.log('🔍 Fetching products from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Use caching for better performance
        cache: 'no-store', // Use 'force-cache' for static data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch products:', response.status, errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Products fetched successfully:', data.items?.length || 0, 'items');
      
      // Ensure image URLs are properly formatted
      if (data.items && Array.isArray(data.items)) {
        data.items = data.items.map((product: ProductDto) => ({
          ...product,
          imageUrl: this.formatImageUrl(product.imageUrl)
        }));
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<ProductDto> {
    try {
      // Note: You need to implement GET /api/Product/{id} endpoint in your API
      const url = `${this.BASE_URL}/${id}`;
      console.log('🔍 Fetching product:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch product:', response.status, errorText);
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Product fetched successfully:', data.name);
      
      // Format image URL
      data.imageUrl = this.formatImageUrl(data.imageUrl);
      
      return data;
    } catch (error) {
      console.error(`❌ Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Format image URL to ensure it's accessible
   */
  private static formatImageUrl(imageUrl: string): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return '/images/placeholder.jpg';
    }

    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path starting with /, prepend API base URL
    if (imageUrl.startsWith('/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }

    // If it's just a filename, assume it's in the API's images folder
    return `${API_BASE_URL}/images/${imageUrl}`;
  }
}