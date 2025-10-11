'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import OrderCard from '@/components/ui/orderCard';
import { Package, Loader2, ShoppingBag, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/orders');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders', { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status.toLowerCase() === filter.toLowerCase());
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  useEffect(() => setCurrentPage(1), [filter]);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;
  if (!user) return null;

  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="mb-8"><div className="flex items-center gap-3 mb-2"><div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg"><Package className="w-6 h-6 text-white" /></div><h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">My Orders</h1></div><p className="text-gray-600">Track and manage your order history</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"><div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"><p className="text-sm text-gray-600 mb-1">Total Orders</p><p className="text-2xl font-bold text-gray-900">{orderStats.total}</p></div><div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-200"><p className="text-sm text-yellow-700 mb-1">Pending</p><p className="text-2xl font-bold text-yellow-800">{orderStats.pending}</p></div><div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200"><p className="text-sm text-blue-700 mb-1">Processing</p><p className="text-2xl font-bold text-blue-800">{orderStats.processing}</p></div><div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200"><p className="text-sm text-green-700 mb-1">Delivered</p><p className="text-2xl font-bold text-green-800">{orderStats.delivered}</p></div></div><div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"><div className="flex flex-wrap gap-2">{['all', 'pending', 'processing', 'delivered'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{f === 'all' ? 'All Orders' : f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div></div>{loading ? <div className="flex flex-col items-center justify-center py-12"><Loader2 className="w-12 h-12 animate-spin text-pink-500 mb-4" /><p className="text-gray-600">Loading your orders...</p></div> : error ? <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" /><h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Orders</h3><p className="text-red-700 mb-4">{error}</p><button onClick={fetchOrders} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Try Again</button></div> : filteredOrders.length === 0 ? <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"><div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4"><ShoppingBag className="w-10 h-10 text-gray-400" /></div><h3 className="text-xl font-semibold text-gray-900 mb-2">{filter === 'all' ? 'No Orders Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}</h3><p className="text-gray-600 mb-6">{filter === 'all' ? "You haven't placed any orders yet. Start shopping to see your orders here!" : `You don't have any ${filter} orders at the moment.`}</p>{filter === 'all' && <button onClick={() => router.push('/')} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg">Start Shopping</button>}</div> : <><div className="space-y-6 mb-8">{currentOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>{totalPages > 1 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"><div className="flex flex-col sm:flex-row items-center justify-between gap-4"><div className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * ordersPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders</div><div className="flex items-center gap-2"><button onClick={() => {setCurrentPage(currentPage - 1); window.scrollTo({top: 0, behavior: 'smooth'});}} disabled={currentPage === 1} className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}><ChevronLeft className="w-5 h-5" /></button><div className="flex items-center gap-1">{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) ? <button key={page} onClick={() => {setCurrentPage(page); window.scrollTo({top: 0, behavior: 'smooth'});}} className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{page}</button> : (page === currentPage - 2 || page === currentPage + 2) ? <span key={page} className="px-2 text-gray-400">...</span> : null)}</div><button onClick={() => {setCurrentPage(currentPage + 1); window.scrollTo({top: 0, behavior: 'smooth'});}} disabled={currentPage === totalPages} className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}><ChevronRight className="w-5 h-5" /></button></div></div></div>}</>}</div></div>;
}
