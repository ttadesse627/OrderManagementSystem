'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  UserPlus,
  ShoppingCart,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import Table from '@/components/shared/Table';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  userGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
  recentOrders: any[];
  topSellingProducts: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    userGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    recentOrders: [],
    topSellingProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from an admin dashboard endpoint
      // For now, we'll use mock data
      const mockStats: DashboardStats = {
        totalUsers: 1542,
        totalOrders: 892,
        totalProducts: 1250,
        totalRevenue: 85642.50,
        userGrowth: 12.5,
        orderGrowth: 8.3,
        revenueGrowth: 15.2,
        recentOrders: [
          { id: '1', customer: 'John Doe', amount: 249.99, status: 'delivered', date: '2024-01-15' },
          { id: '2', customer: 'Jane Smith', amount: 129.99, status: 'processing', date: '2024-01-15' },
          { id: '3', customer: 'Bob Johnson', amount: 89.99, status: 'shipped', date: '2024-01-14' },
          { id: '4', customer: 'Alice Brown', amount: 299.99, status: 'pending', date: '2024-01-14' },
          { id: '5', customer: 'Charlie Wilson', amount: 159.99, status: 'delivered', date: '2024-01-13' },
        ],
        topSellingProducts: [
          { id: '1', name: 'Wireless Headphones', category: 'Electronics', sales: 142, revenue: 14200 },
          { id: '2', name: 'Smart Watch', category: 'Electronics', sales: 98, revenue: 19600 },
          { id: '3', name: 'Running Shoes', category: 'Sports', sales: 85, revenue: 6800 },
          { id: '4', name: 'Coffee Maker', category: 'Home', sales: 76, revenue: 7600 },
          { id: '5', name: 'Yoga Mat', category: 'Sports', sales: 65, revenue: 1950 },
        ],
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="h-6 w-6" />,
      change: stats.userGrowth,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingBag className="h-6 w-6" />,
      change: stats.orderGrowth,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <Package className="h-6 w-6" />,
      change: 5.2,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      change: stats.revenueGrowth,
      color: 'bg-yellow-500',
    },
  ];

  const recentOrdersColumns = [
    { key: 'customer', header: 'Customer' },
    { key: 'amount', header: 'Amount', render: (item: any) => `$${item.amount}` },
    { key: 'status', header: 'Status', render: (item: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        item.status === 'delivered' ? 'bg-green-100 text-green-800' :
        item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
        item.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {item.status}
      </span>
    )},
    { key: 'date', header: 'Date' },
    { key: 'actions', header: '', render: (item: any) => (
      <Link href={`/admin/orders/${item.id}`} className="text-blue-600 hover:text-blue-800">
        View
      </Link>
    )},
  ];

  const topProductsColumns = [
    { key: 'name', header: 'Product' },
    { key: 'category', header: 'Category' },
    { key: 'sales', header: 'Sales', align: 'right' as const },
    { key: 'revenue', header: 'Revenue', render: (item: any) => `$${item.revenue.toLocaleString()}`, align: 'right' as const },
    { key: 'actions', header: '', render: (item: any) => (
      <Link href={`/admin/products/${item.id}`} className="text-blue-600 hover:text-blue-800">
        View
      </Link>
    )},
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div className={`flex items-center text-sm ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-gray-600">Revenue trends over time</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-green-600">
                <TrendingUp className="h-5 w-5 inline mr-1" />
                {stats.revenueGrowth}% growth
              </div>
              <p className="text-gray-600 mt-2">Total revenue this period</p>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <p className="text-gray-600">Distribution by status</p>
            </div>
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { status: 'Delivered', count: 450, color: 'bg-green-500', percent: 50 },
              { status: 'Processing', count: 180, color: 'bg-yellow-500', percent: 20 },
              { status: 'Shipped', count: 135, color: 'bg-blue-500', percent: 15 },
              { status: 'Pending', count: 90, color: 'bg-gray-500', percent: 10 },
              { status: 'Cancelled', count: 45, color: 'bg-red-500', percent: 5 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.status}</span>
                  <span className="text-gray-600">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-gray-600">Latest orders from customers</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={recentOrdersColumns}
            data={stats.recentOrders}
            loading={loading}
            emptyMessage="No recent orders"
            onRowClick={(item) => window.location.href = `/admin/orders/${item.id}`}
          />
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <p className="text-gray-600">Best performing products</p>
            </div>
            <Link
              href="/admin/products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={topProductsColumns}
            data={stats.topSellingProducts}
            loading={loading}
            emptyMessage="No product data available"
            onRowClick={(item) => window.location.href = `/admin/products/${item.id}`}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users/new"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <UserPlus className="h-8 w-8 text-blue-600 mb-3" />
            <span className="font-medium text-gray-900">Add User</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <Package className="h-8 w-8 text-green-600 mb-3" />
            <span className="font-medium text-gray-900">Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <ShoppingBag className="h-8 w-8 text-purple-600 mb-3" />
            <span className="font-medium text-gray-900">Manage Orders</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <CreditCard className="h-8 w-8 text-yellow-600 mb-3" />
            <span className="font-medium text-gray-900">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}