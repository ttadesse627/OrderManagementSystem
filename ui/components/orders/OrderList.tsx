'use client';

import { Order } from '@/types/order';
import OrderCard from './OrderCard';
import { useState } from 'react';

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  emptyMessage?: string;
  showCustomerInfo?: boolean;
  showSellerInfo?: boolean;
  linkPrefix?: string;
}

export default function OrderList({
  orders,
  loading = false,
  emptyMessage = 'No orders found',
  showCustomerInfo = false,
  showSellerInfo = false,
  linkPrefix = '/customer/orders',
}: OrderListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statuses: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            linkPrefix={linkPrefix}
            showCustomerInfo={showCustomerInfo}
            showSellerInfo={showSellerInfo}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders match the selected filter
          </h3>
          <p className="text-gray-500">
            Try selecting a different status filter
          </p>
        </div>
      )}
    </div>
  );
}