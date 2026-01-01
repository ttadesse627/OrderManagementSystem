
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductResponse } from '@/types/product';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: ProductResponse;
  showActions?: boolean;
  onAddToCart?: () => void;
}

export default function ProductCard({ 
  product, 
  showActions = true,
  onAddToCart 
}: ProductCardProps) {
  const imageUrl = product.imageUrl || '/images/placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/customer/products/${product.id}`}>
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={imageUrl}
            alt={`Image: ${product.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/customer/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.stockQuantity > 0 && (
              <span className="ml-2 text-sm text-green-600">
                In Stock ({product.stockQuantity})
              </span>
            )}
          </div>
        </div>
        
        
        
        {showActions && (
          <div className="mt-4 flex space-x-2">
            <Link
              href={`/customer/products/${product.id}`}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
            >
              View Details
            </Link>
            <button
              onClick={onAddToCart}
              disabled={product.stockQuantity === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
