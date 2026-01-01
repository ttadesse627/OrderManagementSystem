'use client';

import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { orderService } from '@/services/orderService';
import Table from '@/components/shared/Table';
import Modal from '@/components/shared/Modal';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Search, Filter, Calendar, Download, Eye, CheckCircle, XCircle, Truck, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.items);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for development
      
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.start) {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(dateRange.start);
      matchesDate = matchesDate && orderDate >= startDate;
    }
    if (dateRange.end) {
      const orderDate = new Date(order.createdAt);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && orderDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setActionLoading(true);
      const updatedOrder = await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
      setShowUpdateModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    const config = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
    };
    const { color, label } = config[status as keyof typeof config] || config.pending;
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>;
  };

  const columns = [
    {
      key: 'order',
      header: 'Order',
      render: (order: Order) => (
        <div>
          <div className="font-medium text-gray-900">{order.orderNumber}</div>
          <div className="text-sm text-gray-500">{order.customer?.name}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (order: Order) => formatDateTime(order.createdAt),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (order: Order) => (
        <div className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</div>
      ),
      align: 'right' as const,
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (order: Order) => (
        <div className="flex flex-col items-start">
          {getPaymentStatusBadge(order.paymentStatus)}
          <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (order: Order) => (
        <div className="text-sm text-gray-900">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (order: Order) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/orders/${order.id}`}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedOrder(order);
              setNewStatus(order.status);
              setShowUpdateModal(true);
            }}
            className="p-1 text-gray-500 hover:text-green-600"
            title="Update Status"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const orderStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
  };

  const statusFilters: Array<{ value: OrderStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">
              Manage all customer orders ({filteredOrders.length} orders)
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="h-5 w-5 mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-green-600 text-sm font-medium">
              +12.5%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {orderStats.totalOrders}
          </h3>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-green-600 text-sm font-medium">
              {orderStats.completedOrders}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ${orderStats.totalRevenue.toFixed(2)}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-red-600 text-sm font-medium">
              {orderStats.pendingOrders}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {orderStats.pendingOrders}
          </h3>
          <p className="text-gray-600">Pending Orders</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-green-600 text-sm font-medium">
              +8.3%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ${orderStats.averageOrderValue.toFixed(2)}
          </h3>
          <p className="text-gray-600">Average Order Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(search || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: {search}
                  <button
                    onClick={() => setSearch('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
              {dateRange.start && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  From: {dateRange.start}
                  <button
                    onClick={() => setDateRange({ ...dateRange, start: '' })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
              {dateRange.end && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  To: {dateRange.end}
                  <button
                    onClick={() => setDateRange({ ...dateRange, end: '' })}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setDateRange({ start: '', end: '' });
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredOrders}
            loading={loading}
            emptyMessage="No orders found"
            onRowClick={(order) => window.location.href = `/admin/orders/${order.id}`}
          />
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Order Status"
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedOrder.orderNumber}</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.customer?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </div>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Placed on {formatDateTime(selectedOrder.createdAt)}
              </p>
            </div>

            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Update Order Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statusFilters
                  .filter(s => s.value !== 'all')
                  .map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setNewStatus(status.value as OrderStatus)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        newStatus === status.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{status.label}</div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Status Flow */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Status Flow</h4>
              <div className="flex items-center justify-between">
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      selectedOrder.status === status
                        ? 'bg-blue-600 text-white'
                        : statusFilters.find(s => s.value === status)?.value === 'all'
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs mt-2 capitalize">{status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={actionLoading || selectedOrder.status === newStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Helper component
function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}