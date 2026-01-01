"use client";


import { Product, ProductResponse } from '@/types/product';
import ProductCard from './ProductCard';
import { useState } from 'react';

interface ProductListProps {
  products: ProductResponse[];
  loading?: boolean;
  onAddToCart?: (product: ProductResponse) => void;
}

export default function ProductList({ 
  products = [], 
  loading = false,
  onAddToCart 
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No products found</div>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Products ({products.length})
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div
        className={`gap-6 ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        }`}
      >
        {products && products.map((product, index) => (
          <div key={`${product.id}-${index}`} className={viewMode === 'list' ? 'flex bg-white rounded-lg shadow-sm' : ''}>
            {viewMode === 'list' ? (
              <div className="flex flex-1">
                <div className="w-48 h-48 relative shrink-0">
                  <img
                    src={product.imageUrl || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onAddToCart?.(product)}
                        disabled={product.stockQuantity === 0}
                        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onAddToCart?.(product)}
                        disabled={product.stockQuantity === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ProductCard
                product={product}
                onAddToCart={() => onAddToCart?.(product)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
