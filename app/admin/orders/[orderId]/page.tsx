'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminLayout from '@/components/ui/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, User, Phone, Mail, MapPin, CreditCard, Calendar, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${params.orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    let confirmMessage = `Update order status to "${newStatus}"?`;
    if (newStatus === 'confirmed') {
      confirmMessage = `Confirm this order? This will:\n• Check stock availability\n• Reduce stock for all items\n• Send notification to customer`;
    } else if (newStatus === 'cancelled') {
      if (order.status === 'confirmed' || order.status === 'processing') {
        confirmMessage = `Cancel this order? This will:\n• Return stock to inventory\n• Send cancellation notification`;
      } else {
        confirmMessage = `Cancel this order? This will send a cancellation notification.`;
      }
    }

    if (!confirm(confirmMessage)) return;

    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'Insufficient stock' && data.details) {
          const stockIssues = data.details.map((item: any) => 
            `${item.product_type} #${item.product_id}: need ${item.requested}, have ${item.available}`
          ).join('\n');
          alert(`Cannot confirm order - insufficient stock:\n\n${stockIssues}`);
        } else {
          alert(data.error || 'Failed to update status');
        }
        return;
      }

      if (data.success) {
        setOrder(data.order);
        alert(data.message || 'Order status updated successfully!');
        fetchOrderDetails(); // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: <Clock className="w-5 h-5" />,
          gradient: 'from-yellow-400 to-orange-500'
        };
      case 'confirmed':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <CheckCircle className="w-5 h-5" />,
          gradient: 'from-purple-400 to-pink-500'
        };
      case 'processing':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Truck className="w-5 h-5" />,
          gradient: 'from-blue-400 to-cyan-500'
        };
      case 'completed':
      case 'delivered':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle className="w-5 h-5" />,
          gradient: 'from-green-400 to-emerald-500'
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-5 h-5" />,
          gradient: 'from-red-400 to-pink-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Package className="w-5 h-5" />,
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Button onClick={() => router.push('/admin/orders')} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/orders')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className={`px-6 py-3 rounded-xl border-2 flex items-center gap-2 font-semibold ${statusConfig.color} bg-white`}>
              {statusConfig.icon}
              {order.status.toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Order {order.order_number}
            </h1>
            <p className="text-purple-100">
              Created {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Update Order Status
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Order Flow:</strong> Pending → Confirmed (stock reduced) → Processing (packing) → Completed (delivered)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['pending', 'confirmed', 'processing', 'completed', 'cancelled'].map((status) => {
              const config = getStatusConfig(status);
              const isCurrentStatus = order.status.toLowerCase() === status.toLowerCase();
              return (
                <Button
                  key={status}
                  variant={isCurrentStatus ? 'default' : 'outline'}
                  disabled={isCurrentStatus || updatingStatus}
                  onClick={() => updateStatus(status)}
                  className={isCurrentStatus ? `bg-gradient-to-r ${config.gradient} text-white` : ''}
                >
                  {config.icon}
                  <span className="ml-2">
                    {updatingStatus ? 'Updating...' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.customers.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.customers.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.customers.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Order Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.payment_method.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{new Date(order.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900 text-lg">${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-purple-600" />
            Delivery Address
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{order.delivery_address}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items ({order.items?.length || 0})</h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-gradient-to-r from-white to-gray-50">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.product_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No items found</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
