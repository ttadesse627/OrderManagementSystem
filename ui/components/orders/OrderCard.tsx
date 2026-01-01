'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import Link from 'next/link';
import { ChevronRight, Calendar, Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  linkPrefix?: string;
  showCustomerInfo?: boolean;
  showSellerInfo?: boolean;
}

export default function OrderCard({
  order,
  linkPrefix = '/customer/orders',
  showCustomerInfo = false,
  showSellerInfo = false,
}: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(order.createdAt)}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${order.totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        {showCustomerInfo && order.customer && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Customer</h4>
            <p className="text-sm text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-600">{order.customer.email}</p>
          </div>
        )}

        {showSellerInfo && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-gray-700">Items</h4>
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">
                  {item.quantity} × {item.productName}
                </span>
              </div>
              <span className="text-gray-900">${item.total.toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-sm text-gray-500">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {order.paymentStatus === 'paid' ? (
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Paid
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Pending Payment
              </span>
            )}
            <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
              {order.paymentMethod}
            </span>
          </div>
          
          <Link
            href={`${linkPrefix}/${order.id}`}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}