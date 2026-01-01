'use client';

import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-blue-100 text-blue-800',
    },
    processing: {
      label: 'Processing',
      color: 'bg-indigo-100 text-indigo-800',
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800',
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}