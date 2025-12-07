'use client';

import { useStore } from '@/contexts/StoreContext';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, user } = useStore();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart to see them here.</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user?.isLoggedIn) {
      alert('Please login to proceed with checkout');
      return;
    }
    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {cart.map((item) => (
              <div key={item.product.id} className="p-6 border-b last:border-b-0">
                <div className="flex space-x-4">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-1">{item.product.description}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${(item.product.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!user?.isLoggedIn && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  Please login or sign up to proceed with checkout.
                </p>
                <div className="flex space-x-2 mt-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!user?.isLoggedIn}
              className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition ${
                user?.isLoggedIn
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{user?.isLoggedIn ? 'Proceed to Checkout' : 'Login Required'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            {user?.isLoggedIn && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Your order will be processed within 24 hours
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}