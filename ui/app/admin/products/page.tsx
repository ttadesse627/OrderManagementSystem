'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';
import Table from '@/components/shared/Table';
import Modal from '@/components/shared/Modal';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Package, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        pageSize: 50,
        sortDescending: true
      });
      setProducts(response.items);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Mock data for development
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 129.99,
          stock: 45,
          category: 'Electronics',
          images: ['/images/headphones.jpg'],
          sellerId: 'seller1',
          averageRating: 4.5,
          reviewCount: 128,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
        {
          id: '2',
          name: 'Smart Watch',
          description: 'Feature-rich smartwatch with health tracking',
          price: 199.99,
          stock: 32,
          category: 'Electronics',
          images: ['/images/smartwatch.jpg'],
          sellerId: 'seller1',
          averageRating: 4.8,
          reviewCount: 89,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
        },
        {
          id: '3',
          name: 'Running Shoes',
          description: 'Comfortable running shoes for all terrains',
          price: 79.99,
          stock: 67,
          category: 'Sports',
          images: ['/images/shoes.jpg'],
          sellerId: 'seller2',
          averageRating: 4.3,
          reviewCount: 56,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-13T00:00:00Z',
        },
        {
          id: '4',
          name: 'Coffee Maker',
          description: 'Automatic coffee maker with programmable settings',
          price: 99.99,
          stock: 23,
          category: 'Home & Kitchen',
          images: ['/images/coffee-maker.jpg'],
          sellerId: 'seller3',
          averageRating: 4.6,
          reviewCount: 42,
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
        },
        {
          id: '5',
          name: 'Yoga Mat',
          description: 'Non-slip yoga mat with carrying strap',
          price: 29.99,
          stock: 89,
          category: 'Sports',
          images: ['/images/yoga-mat.jpg'],
          sellerId: 'seller2',
          averageRating: 4.2,
          reviewCount: 31,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-11T00:00:00Z',
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      setActionLoading(true);
      await productService.deleteProduct(selectedProduct.id);
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    }
    if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>;
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (product: Product) => (
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <Package className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{product.name}</div>
            <div className="text-sm text-gray-500 truncate">{product.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: Product) => (
        <div className="font-medium text-gray-900">${product.price.toFixed(2)}</div>
      ),
      align: 'right' as const,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product: Product) => (
        <div className="flex flex-col items-end">
          <div className="font-medium text-gray-900">{product.stock}</div>
          {getStockStatus(product.stock)}
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (product: Product) => (
        <div className="text-right">
          <div className="flex items-center justify-end">
            <span className="font-medium text-gray-900 mr-1">{product.averageRating?.toFixed(1) || 'N/A'}</span>
            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
          </div>
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'seller',
      header: 'Seller',
      render: (product: Product) => (
        <div className="text-sm text-gray-900 truncate">
          {product.seller?.name || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setShowStatsModal(true);
            }}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="View Stats"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
          <Link
            href={`/admin/products/${product.id}`}
            className="p-1 text-gray-500 hover:text-green-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedProduct(product);
              setShowDeleteModal(true);
            }}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const productStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">
              Manage all products on the platform ({filteredProducts.length} products)
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              View Stats
            </button>
            <Link
              href="/admin/products/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Package className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {productStats.totalProducts}
          </h3>
          <p className="text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-red-600 font-medium">{productStats.lowStock}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {productStats.lowStock}
          </h3>
          <p className="text-gray-600">Low Stock</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-red-600 font-medium">{productStats.outOfStock}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {productStats.outOfStock}
          </h3>
          <p className="text-gray-600">Out of Stock</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ${productStats.totalValue.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Inventory Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Stock
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Stock Levels</option>
              <option>In Stock (&gt; 10)</option>
              <option>Low Stock (1-10)</option>
              <option>Out of Stock (0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredProducts}
            loading={loading}
            emptyMessage="No products found"
            onRowClick={(product) => window.location.href = `/admin/products/${product.id}`}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete product{' '}
            <span className="font-semibold">{selectedProduct?.name}</span>?
            This action cannot be undone.
          </p>
          {selectedProduct && selectedProduct.stock > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                ⚠️ This product has {selectedProduct.stock} units in stock.
                Deleting it will remove it from the catalog.
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Product Stats Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Product Statistics"
        size="lg"
      >
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {productStats.totalProducts}
              </div>
              <div className="text-sm text-blue-700">Total Products</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className="text-sm text-green-700">Available Products</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">
                {productStats.lowStock}
              </div>
              <div className="text-sm text-yellow-700">Low Stock</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-900">
                {productStats.outOfStock}
              </div>
              <div className="text-sm text-red-700">Out of Stock</div>
            </div>
          </div>

          {/* Category Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Products by Category</h4>
            <div className="space-y-3">
              {Object.entries(
                products.reduce((acc, product) => {
                  acc[product.category] = (acc[product.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => {
                const percentage = (count / products.length) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className="text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Analysis */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Price Analysis</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  ${Math.min(...products.map(p => p.price)).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Lowest Price</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  ${productStats.averagePrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Average Price</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  ${Math.max(...products.map(p => p.price)).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Highest Price</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={() => setShowStatsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}