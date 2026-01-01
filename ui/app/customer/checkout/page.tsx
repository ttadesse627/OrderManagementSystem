'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/orderService';
import FormField from '@/components/shared/FormField';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      // In a real app: const order = await orderService.createOrder(orderData);
      console.log('Order created:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      
      // Redirect to orders after 3 seconds
      setTimeout(() => {
        router.push('/customer/orders');
      }, 3000);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total;
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
            You will receive an email confirmation shortly.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Redirecting to your orders...</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Shipping Address"
                name="shippingAddress"
                type="textarea"
                value={formData.shippingAddress}
                onChange={handleChange}
                required
                placeholder="Enter your complete shipping address"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="City"
                  name="city"
                  type="text"
                  value=""
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
                <FormField
                  label="ZIP Code"
                  name="zipCode"
                  type="text"
                  value=""
                  onChange={handleChange}
                  required
                  placeholder="ZIP Code"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {['credit_card', 'paypal', 'bank_transfer'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        formData.paymentMethod === method
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900 capitalize">
                          {method.replace('_', ' ')}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <FormField
                    label="Card Number"
                    name="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    max={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Expiry Date"
                      name="cardExpiry"
                      type="text"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      required
                      placeholder="MM/YY"
                      max={5}
                    />
                    <FormField
                      label="CVC"
                      name="cardCVC"
                      type="text"
                      value={formData.cardCVC}
                      onChange={handleChange}
                      required
                      placeholder="123"
                      max={3}
                    />
                  </div>
                </div>
              )}

              <FormField
                label="Order Notes (Optional)"
                name="notes"
                type="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Special instructions for your order..."
                rows={2}
              />

              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Place Order ($${grandTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-100 rounded-md mr-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t pt-3">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2" />
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Secure payment processing
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}