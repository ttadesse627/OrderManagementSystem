'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { orderService } from '@/services/orderService';
import OrderList from '@/components/orders/OrderList';
import { Package, RefreshCw } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // In a real app: const response = await orderService.getMyOrders();
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerId: 'cust1',
          items: [
            { id: '1', productId: 'prod1', productName: 'Wireless Headphones', quantity: 1, price: 129.99, total: 129.99 },
          ],
          totalAmount: 129.99,
          shippingAddress: '123 Main St, New York, NY',
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerId: 'cust1',
          items: [
            { id: '2', productId: 'prod2', productName: 'Smart Watch', quantity: 1, price: 199.99, total: 199.99 },
          ],
          totalAmount: 199.99,
          shippingAddress: '123 Main St, New York, NY',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'PayPal',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View and manage your orders</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-600">Completed Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Active Orders</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <OrderList
          orders={orders}
          loading={loading}
          emptyMessage="You haven't placed any orders yet"
          linkPrefix="/customer/orders"
        />
      </div>
    </div>
  );
}