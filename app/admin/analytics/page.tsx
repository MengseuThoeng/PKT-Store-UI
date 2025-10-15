'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminLayout from '@/components/ui/AdminLayout';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    growth: number;
  };
  products: {
    total: number;
    figures: number;
    manga: number;
    plushies: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchAnalytics();
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your store performance and metrics</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUp className="w-4 h-4" />
                    12.5%
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$24,563</p>
                <p className="text-xs text-gray-500 mt-2">+$2,845 from last month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUp className="w-4 h-4" />
                    8.2%
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">1,254</p>
                <p className="text-xs text-gray-500 mt-2">+95 from last month</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUp className="w-4 h-4" />
                    15.3%
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">New Customers</p>
                <p className="text-3xl font-bold text-gray-900">342</p>
                <p className="text-xs text-gray-500 mt-2">+45 from last month</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg border border-orange-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                    <ArrowDown className="w-4 h-4" />
                    3.1%
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">3.42%</p>
                <p className="text-xs text-gray-500 mt-2">-0.11% from last month</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Revenue Overview
                  </h2>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">January</span>
                    <span className="text-sm font-bold text-gray-900">$18,450</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">February</span>
                    <span className="text-sm font-bold text-gray-900">$21,235</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">March</span>
                    <span className="text-sm font-bold text-gray-900">$24,563</span>
                  </div>
                </div>
              </div>

              {/* Product Distribution */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Product Distribution
                  </h2>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Figures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[45%] h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 min-w-[3rem] text-right">45%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Manga</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[35%] h-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 min-w-[3rem] text-right">35%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Plushies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[20%] h-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 min-w-[3rem] text-right">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Top Performing Products
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sales</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: 'Naruto Figure', category: 'Figure', sales: 234, revenue: '$4,680', trend: 'up', growth: '+12%' },
                      { name: 'One Piece Manga Vol 1', category: 'Manga', sales: 189, revenue: '$1,890', trend: 'up', growth: '+8%' },
                      { name: 'Pikachu Plushie', category: 'Plushie', sales: 156, revenue: '$3,120', trend: 'down', growth: '-3%' },
                    ].map((product, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.sales} units</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{product.revenue}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-sm font-semibold ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {product.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {product.growth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
