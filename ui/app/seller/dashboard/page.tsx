'use client';

import { DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8.3%',
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: '42',
      change: '+5.2%',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '+2.1%',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-yellow-500',
    },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', amount: 249.99, status: 'pending' },
    { id: '2', customer: 'Jane Smith', amount: 129.99, status: 'processing' },
    { id: '3', customer: 'Bob Johnson', amount: 89.99, status: 'delivered' },
    { id: '4', customer: 'Alice Brown', amount: 299.99, status: 'shipped' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div className="text-green-600 text-sm font-medium">
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/seller/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ORD-{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <Link href={`/seller/orders/${order.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/seller/products/create"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors"
          >
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Add New Product</span>
            <span className="text-sm text-gray-500 mt-1">Create new listing</span>
          </Link>
          <Link
            href="/seller/products"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Manage Products</span>
            <span className="text-sm text-gray-500 mt-1">View all products</span>
          </Link>
          <Link
            href="/seller/orders"
            className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-colors"
          >
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">View Orders</span>
            <span className="text-sm text-gray-500 mt-1">Process orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}