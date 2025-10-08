'use client';

import React from 'react';
import { Package, Calendar, CreditCard, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  product_type: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.order_number}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Status & Total */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {formatPrice(order.total_amount)}
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900">{order.payment_method || 'N/A'}</p>
              <p className={`text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-medium text-gray-900 line-clamp-2">{order.customer_address}</p>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>View Details</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Order Details (Expandable) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                  {/* Product Image */}
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.product_type}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Item Subtotal */}
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.shipping_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-gray-900">{formatPrice(order.shipping_fee)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-base">
                <span className="text-gray-900">Total</span>
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="text-gray-900 font-medium">{order.customer_name}</span>
              </div>
              {order.customer_email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{order.customer_email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="text-gray-900">{order.customer_phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
