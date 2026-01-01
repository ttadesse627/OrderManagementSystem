'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import CartItem from '@/components/CartItem';
import { ShoppingCart, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function CartPage() {
  const router = useRouter();
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/customer/cart');
      return;
    }

    if (items.length === 0) {
      return;
    }

    setShowCheckoutModal(true);
  };

  const proceedToCheckout = () => {
    setShowCheckoutModal(false);
    router.push('/customer/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const subtotal = total;
  const shipping = items.length > 0 ? 5.99 : 0; // Flat rate shipping
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">Manage your shopping cart</p>
        </div>

        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <ShoppingCart className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Start shopping
            to discover amazing products!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customer/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart</h1>
            <p className="text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              <Link
                href="/customer/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Continue Shopping
              </Link>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  stock={item.stock}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Have a Promo Code?
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 mb-4"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-500 text-center">
              By completing your purchase, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>
            </p>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                We Accept
              </h4>
              <div className="flex space-x-2">
                <div className="h-8 w-12 bg-gray-100 rounded border flex items-center justify-center">
                  💳
                </div>
                <div className="h-8 w-12 bg-gray-100 rounded border flex items-center justify-center">
                  📱
                </div>
                <div className="h-8 w-12 bg-gray-100 rounded border flex items-center justify-center">
                  🏦
                </div>
                <div className="h-8 w-12 bg-gray-100 rounded border flex items-center justify-center">
                  🌐
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Cart"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to remove all items from your cart?
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowClearModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Proceed to Checkout"
        size="md"
      >
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Items ({itemCount})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-blue-900 font-medium">Total</span>
                <span className="text-lg font-bold text-blue-900">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm your shipping address before proceeding.
            </p>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-900">123 Main Street</p>
              <p className="text-sm text-gray-600">New York, NY 10001</p>
              <p className="text-sm text-gray-600">United States</p>
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              Change Address
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Cart
            </button>
            <button
              onClick={proceedToCheckout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


/*
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
*/