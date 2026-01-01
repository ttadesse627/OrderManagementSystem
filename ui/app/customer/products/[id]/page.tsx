'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';
import { useCart } from '@/hooks/useCart';
import { Star, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Spinner from '@/components/shared/Spinner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/customer/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '/images/placeholder.jpg',
      stock: product.stock,
    });
    
    router.push('/customer/cart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product not found</h2>
        <Link
          href="/customer/products"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  const mainImage = product.images[selectedImage] || '/images/placeholder.jpg';

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/customer/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-blue-500'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (product.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.averageRating?.toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-900">Category:</span>
              <span className="ml-2 text-gray-600">{product.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Seller:</span>
              <span className="ml-2 text-gray-600">{product.seller?.name || 'Unknown'}</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                  className="w-16 text-center border-0 focus:ring-0"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Max: {product.stock} units
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Free Shipping</div>
                <div className="text-sm text-gray-500">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900">30-Day Return</div>
                <div className="text-sm text-gray-500">Money back guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-8 border-t">
        <Link
          href="/customer/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    </div>
  );
}



/*
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

          <div className={`p-4 rounded-lg ${product.stock > 10 ? 'bg-green-50' : 'bg-orange-50'}`}>
            <p className={`font-medium ${product.stock > 10 ? 'text-green-700' : 'text-orange-700'}`}>
              {product.stock > 10 
                ? `${product.stock} items in stock` 
                : `Only ${product.stock} items left!`}
            </p>
          </div>

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

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>

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
*/