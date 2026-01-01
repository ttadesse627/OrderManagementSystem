'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FormField from '@/components/shared/FormField';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // In a real app: await userService.updateProfile(formData);
      updateUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">👤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-1">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Customer
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                <FormField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                />

                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <FormField
                label="Address"
                name="address"
                type="textarea"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                rows={3}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
              />

              {editing && (
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Info */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Member Since</div>
                <div className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Account Status</div>
                <div className="font-medium text-green-600">Active</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email Verified</div>
                <div className="font-medium text-green-600">Verified</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
                View Order History
              </button>
              <button className="w-full text-left px-4 py-3 text-red-600 border border-red-200 rounded-md hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}