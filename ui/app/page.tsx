'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, ProductResponse } from '@/types/product';
import { productService } from '@/services/productService';
import ProductList from '@/components/products/ProductList';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, Tag, Truck, Shield } from 'lucide-react';
import { stringify } from 'querystring';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch featured products
      const featuredResponse = await productService.getProducts();
      console.log('Fetched products: ', JSON.stringify(featuredResponse.Items));
      setFeaturedProducts(featuredResponse.Items);

    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: ProductResponse) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || '/images/placeholder.jpg',
      stock: product.stockQuantity,
    });
  };

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Secure Payment',
      description: '100% secure & safe',
    },
    {
      icon: <Tag className="h-8 w-8 text-purple-600" />,
      title: 'Best Price',
      description: 'Guaranteed best prices',
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-orange-600" />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/90 to-indigo-700/90" />
        </div>
        
        <div className="relative px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to Our <span className="text-yellow-300">E-Shop</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing products at unbeatable prices. Shop with confidence
              and enjoy a seamless shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Start Shopping
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-2">Most popular products this week</p>
          </div>
          <Link
            href="/customer/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <ProductList
          products={featuredProducts}
          loading={loading}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-600 mt-2">Freshly added to our collection</p>
          </div>
          <Link
            href="/customer/products?sort=newest"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <ProductList
          products={featuredProducts}
          loading={loading}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of sellers who are growing their business with our platform.
            Create your seller account today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?role=seller"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50"
            >
              Become a Seller
            </Link>
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10"
            >
              Seller Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}