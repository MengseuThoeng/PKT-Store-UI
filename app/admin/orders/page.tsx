'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/ui/AdminLayout';
import { 
  Search, 
  Package,
  Clock,
  Truck,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
}

function AdminOrdersContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders();
    }
  }, [user, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/orders';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  if (isLoading || !user?.isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          gradient: 'from-yellow-400 to-orange-500'
        };
      case 'confirmed':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          gradient: 'from-green-400 to-emerald-500'
        };
      case 'processing':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Truck className="w-4 h-4" />,
          gradient: 'from-blue-400 to-cyan-500'
        };
      case 'completed':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <CheckCircle className="w-4 h-4" />,
          gradient: 'from-purple-400 to-pink-500'
        };
      case 'delivered':
        return {
          color: 'bg-teal-50 text-teal-700 border-teal-200',
          icon: <CheckCircle className="w-4 h-4" />,
          gradient: 'from-teal-400 to-cyan-500'
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          gradient: 'from-red-400 to-pink-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Package className="w-4 h-4" />,
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: 'all', count: orders.length },
    { label: 'Pending', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
    { label: 'Confirmed', value: 'confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { label: 'Processing', value: 'processing', count: orders.filter(o => o.status === 'processing').length },
    { label: 'Completed', value: 'completed', count: orders.filter(o => o.status === 'completed').length },
    { label: 'Delivered', value: 'delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">View and manage all customer orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex gap-1 overflow-x-auto">
            {statusTabs.map((tab) => {
              const config = getStatusConfig(tab.value);
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    statusFilter === tab.value
                      ? 'bg-gradient-to-r ' + config.gradient + ' text-white shadow-md scale-105'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {statusFilter === tab.value && config.icon}
                    <span className="font-medium">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      statusFilter === tab.value ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No orders found</p>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              {order.order_number}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{order.customer?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              ${Number(order.total_amount).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition"
                                >
                                  Process
                                </button>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition"
                                >
                                  Complete
                                </button>
                              )}
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(startIndex + ordersPerPage, filteredOrders.length)}</span> of <span className="font-semibold">{filteredOrders.length}</span> orders
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>
                    <div className="hidden md:flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg transition ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                              : 'border border-gray-300 hover:bg-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    }>
      <AdminOrdersContent />
    </Suspense>
  );
}
