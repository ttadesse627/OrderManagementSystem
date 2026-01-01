'use client';

import { useEffect, useState } from 'react';
import { User, UserRole } from '@/types/auth';
import Table from '@/components/shared/Table';
import Modal from '@/components/shared/Modal';
import { Search, Filter, MoreVertical, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app: const response = await userService.getUsers();
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Seller',
          phone: '+1234567890',
          address: '123 Main St, NY',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'Customer',
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-13T00:00:00Z',
        },
        {
          id: '4',
          name: 'Alice Brown',
          email: 'alice@example.com',
          role: 'Customer',
          phone: '+1987654321',
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
        },
        {
          id: '5',
          name: 'Charlie Wilson',
          email: 'charlie@example.com',
          role: 'Seller',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-11T00:00:00Z',
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      // In a real app: await userService.deleteUser(selectedUser.id);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: UserRole) => {
    const config = {
      Admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      Seller: { color: 'bg-green-100 text-green-800', label: 'Seller' },
      Customer: { color: 'bg-blue-100 text-blue-800', label: 'Customer' },
    };
    const { color, label } = config[role];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>;
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="font-medium text-gray-700">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => getRoleBadge(user.role),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: User) => formatDate(user.createdAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Active
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(user)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="p-1 text-gray-500 hover:text-green-600"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowDeleteModal(true);
            }}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const roleFilters: Array<{ value: UserRole | 'all'; label: string }> = [
    { value: 'all', label: 'All Users' },
    { value: 'Admin', label: 'Admins' },
    { value: 'Seller', label: 'Sellers' },
    { value: 'Customer', label: 'Customers' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage all users on the platform ({filteredUsers.length} users)
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roleFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredUsers}
            loading={loading}
            emptyMessage="No users found"
            onRowClick={handleViewDetails}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {users.filter(u => u.role === 'Admin').length}
          </div>
          <div className="text-blue-100">Admins</div>
        </div>
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {users.filter(u => u.role === 'Seller').length}
          </div>
          <div className="text-green-100">Sellers</div>
        </div>
        <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {users.filter(u => u.role === 'Customer').length}
          </div>
          <div className="text-purple-100">Customers</div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete user{' '}
            <span className="font-semibold">{selectedUser?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-start space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {selectedUser.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="mt-2">
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div>
                      <span className="text-sm text-gray-600">Address:</span>
                      <p className="text-gray-900">{selectedUser.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Joined:</span>
                    <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <p className="text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats (if available) */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-4">User Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">$1,250</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <Link
                href={`/admin/users/${selectedUser.id}/edit`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit User
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}