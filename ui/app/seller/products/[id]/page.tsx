'use client';

import { useParams } from 'next/navigation';
import { mockProducts } from '@/lib/data';
import Image from 'next/image';
import { ShoppingCart, Star, Shield, Truck } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';

export default function ProductDetail() {
  const params = useParams();
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = mockProducts.find(p => p.id === Number(params.id));
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex space-x-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-20 w-20 rounded border overflow-hidden">
                <Image
                  src={product.image}
                  alt={`${product.name} view ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-blue-600 font-medium">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600">(4.5/5.0)</span>
            </div>
          </div>

          <div className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

          <p className="text-gray-700">{product.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">1 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className={`p-4 rounded-lg ${product.stock > 10 ? 'bg-green-50' : 'bg-orange-50'}`}>
            <p className={`font-medium ${product.stock > 10 ? 'text-green-700' : 'text-orange-700'}`}>
              {product.stock > 10 
                ? `${product.stock} items in stock` 
                : `Only ${product.stock} items left!`}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-gray-600">Max: {product.stock}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Category</span>
                <span className="font-medium">{product.category}</span>
              </li>
              <li className="flex justify-between">
                <span>SKU</span>
                <span className="font-medium">SKU-{product.id.toString().padStart(4, '0')}</span>
              </li>
              <li className="flex justify-between">
                <span>Weight</span>
                <span className="font-medium">1.2 kg</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}