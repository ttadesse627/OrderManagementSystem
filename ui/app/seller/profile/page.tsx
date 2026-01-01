'use client';

import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, MapPin, Shield, Package } from 'lucide-react';

export default function ProfilePage() {

  const { user } = useProtectedRoute();
  
  if (!user) {
    return null; // Will redirect automatically
  }

  const router = useRouter();

  useEffect(() => {
    if (!user?.isLoggedIn) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user?.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">View and manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-6">
                  {/* Avatar */}
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {user.firstName?.charAt(0).toUpperCase()}
                      {user.lastName?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.address && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{user.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Account Status */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-medium">Account Verified</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Your account is active and ready to use
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">First Name</label>
                        <p className="font-medium">{user.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Last Name</label>
                        <p className="font-medium">{user.lastName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email Address</label>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">User ID</label>
                        <p className="font-medium text-sm font-mono">{user.userId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Customer ID</label>
                        <p className="font-medium text-sm font-mono">{user.customerId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Member Since</label>
                        <p className="font-medium">Recently joined</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                {user.address && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900">{user.address}</p>
                          <p className="text-sm text-gray-500 mt-1">Primary shipping address</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Quick Links */}
            <div className="space-y-6">
              {/* Order Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Total Orders</p>
                        <p className="text-sm text-gray-500">All time</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      Start shopping to see your order history here.
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200">
                    <p className="font-medium">Order History</p>
                    <p className="text-sm text-gray-500">View all your past orders</p>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200">
                    <p className="font-medium">Wishlist</p>
                    <p className="text-sm text-gray-500">Your saved items</p>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200">
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-sm text-gray-500">Manage your payment options</p>
                  </button>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed: Never</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Change
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      For security reasons, we recommend changing your password regularly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}