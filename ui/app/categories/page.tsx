'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categoryService';
import { Search, Filter, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // In a real app, you would use categoryService.getCategories()
      // For now, we'll use mock data
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          description: 'Latest gadgets and devices',
          productCount: 1250,
        },
        {
          id: '2',
          name: 'Clothing',
          slug: 'clothing',
          description: 'Fashion for everyone',
          productCount: 890,
        },
        {
          id: '3',
          name: 'Home & Kitchen',
          slug: 'home-kitchen',
          description: 'Everything for your home',
          productCount: 750,
        },
        {
          id: '4',
          name: 'Books',
          slug: 'books',
          description: 'Books for all ages',
          productCount: 620,
        },
        {
          id: '5',
          name: 'Sports',
          slug: 'sports',
          description: 'Sporting goods and equipment',
          productCount: 450,
        },
        {
          id: '6',
          name: 'Beauty',
          slug: 'beauty',
          description: 'Cosmetics and personal care',
          productCount: 380,
        },
        {
          id: '7',
          name: 'Toys',
          slug: 'toys',
          description: 'Toys and games for kids',
          productCount: 320,
        },
        {
          id: '8',
          name: 'Automotive',
          slug: 'automotive',
          description: 'Car accessories and parts',
          productCount: 290,
        },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subcategories = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.children || []
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Categories</h1>
        <p className="text-gray-600">
          Discover products by category
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">Filter by:</span>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Popular</option>
              <option>New</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all hover:shadow-md cursor-pointer ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:border-blue-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount || 0} products
                  </span>
                  <Link
                    href={`/customer/products?category=${category.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Browse →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Subcategories */}
          {selectedCategory && subcategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subcategories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/customer/products?category=${subcategory.slug}`}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">
                        {subcategory.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {subcategory.productCount || 0} products
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </>
      )}

      {/* Stats */}
      <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
            </div>
            <div className="text-blue-100">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{categories.length}</div>
            <div className="text-blue-100">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {Math.max(...categories.map(c => c.productCount || 0))}
            </div>
            <div className="text-blue-100">Largest Category</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CategoryDto } from '../../types/category';
import { categoryService } from '@/services/categoryService';
import { UUID } from 'crypto';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const {data} = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: UUID, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await categoryService.deleteById(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id: UUID) => {
    router.push(`/category/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your product categories
            </p>
          </div>
          <button
            onClick={() => router.push('/categories/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Category
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/categories/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Category
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {category.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">
                          {category.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          disabled={deleteLoading === category.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading === category.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  */