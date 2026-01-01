'use client';

import { useState } from 'react';
import { Save, Bell, Shield, CreditCard, Globe, Database, Mail, Lock } from 'lucide-react';

interface PlatformSettings {
  // General
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  
  // Security
  requireEmailVerification: boolean;
  allowRegistration: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  
  // Payment
  paymentMethods: string[];
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  
  // Notifications
  notifyNewOrders: boolean;
  notifyLowStock: boolean;
  notifyUserRegistration: boolean;
  emailNotifications: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    // General
    siteName: 'E-Shop Pro',
    siteDescription: 'Premium E-commerce Platform',
    adminEmail: 'admin@example.com',
    supportEmail: 'support@example.com',
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Security
    requireEmailVerification: true,
    allowRegistration: true,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    
    // Payment
    paymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
    taxRate: 8.0,
    shippingCost: 5.99,
    freeShippingThreshold: 50,
    
    // Notifications
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyUserRegistration: true,
    emailNotifications: true,
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (section: keyof PlatformSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleGeneralChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    const currentMethods = [...settings.paymentMethods];
    if (currentMethods.includes(method)) {
      const index = currentMethods.indexOf(method);
      currentMethods.splice(index, 1);
    } else {
      currentMethods.push(method);
    }
    handleGeneralChange('paymentMethods', currentMethods);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, you would save to API
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'advanced', label: 'Advanced', icon: <Database className="h-5 w-5" /> },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'GMT (London)' },
    { value: 'Europe/Paris', label: 'CET (Paris)' },
    { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  ];

  const paymentMethodOptions = [
    { id: 'credit_card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🌐' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💰' },
    { id: 'digital_wallet', label: 'Digital Wallet', icon: '📱' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Settings</h1>
            <p className="text-gray-600">Configure your e-commerce platform</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <input
                        type="text"
                        value={settings.siteDescription}
                        onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleGeneralChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Require Email Verification</h4>
                          <p className="text-sm text-gray-500">
                            Users must verify their email address before accessing the platform
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireEmailVerification}
                          onChange={(e) => handleGeneralChange('requireEmailVerification', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-4">
                          <Lock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Allow User Registration</h4>
                          <p className="text-sm text-gray-500">
                            Allow new users to create accounts on the platform
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowRegistration}
                          onChange={(e) => handleGeneralChange('allowRegistration', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={settings.maxLoginAttempts}
                            onChange={(e) => handleGeneralChange('maxLoginAttempts', parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="ml-4 font-medium text-gray-900">
                            {settings.maxLoginAttempts} attempts
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Maximum failed login attempts before account lockout
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="48"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleGeneralChange('sessionTimeout', parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="ml-4 font-medium text-gray-900">
                            {settings.sessionTimeout} hours
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          User session timeout in hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Payment Methods */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Methods</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethodOptions.map((method) => (
                          <div
                            key={method.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              settings.paymentMethods.includes(method.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                            onClick={() => handlePaymentMethodToggle(method.id)}
                          >
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{method.icon}</div>
                              <div>
                                <div className="font-medium text-gray-900">{method.label}</div>
                                <div className={`text-xs mt-1 ${
                                  settings.paymentMethods.includes(method.id)
                                    ? 'text-blue-600'
                                    : 'text-gray-500'
                                }`}>
                                  {settings.paymentMethods.includes(method.id) ? 'Enabled' : 'Disabled'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tax & Shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={settings.taxRate}
                            onChange={(e) => handleGeneralChange('taxRate', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Cost ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.shippingCost}
                            onChange={(e) => handleGeneralChange('shippingCost', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Free Shipping Threshold ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.freeShippingThreshold}
                            onChange={(e) => handleGeneralChange('freeShippingThreshold', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Payment Configuration Note</h4>
                      <p className="text-sm text-blue-700">
                        Changes to payment methods and pricing will affect all new orders.
                        Existing orders will not be modified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">
                            Enable email notifications for all system events
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleGeneralChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">Notification Types</h4>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">New Orders</h5>
                          <p className="text-sm text-gray-500">Notify when new orders are placed</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifyNewOrders}
                            onChange={(e) => handleGeneralChange('notifyNewOrders', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Low Stock</h5>
                          <p className="text-sm text-gray-500">Notify when product stock is low</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifyLowStock}
                            onChange={(e) => handleGeneralChange('notifyLowStock', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">New User Registrations</h5>
                          <p className="text-sm text-gray-500">Notify when new users register</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifyUserRegistration}
                            onChange={(e) => handleGeneralChange('notifyUserRegistration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Notification Frequency</h4>
                      <p className="text-sm text-yellow-700">
                        Email notifications are sent in real-time. Consider setting up a
                        notification digest for high-traffic stores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Database Maintenance</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">Clear Cache</h5>
                            <p className="text-sm text-gray-500">Clear all cached data</p>
                          </div>
                          <button className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50">
                            Clear Now
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">Optimize Database</h5>
                            <p className="text-sm text-gray-500">Optimize database tables for performance</p>
                          </div>
                          <button className="px-4 py-2 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50">
                            Optimize
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Logging & Monitoring</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableLogging"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-700">
                            Enable detailed logging
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableMonitoring"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="enableMonitoring" className="ml-2 block text-sm text-gray-700">
                            Enable performance monitoring
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableAnalytics"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="enableAnalytics" className="ml-2 block text-sm text-gray-700">
                            Enable advanced analytics
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-700 mb-4">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
                          Reset All Settings to Default
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
                          Export All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}