'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/ui/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search,
  RefreshCw,
  Download,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_count: number;
  type: 'figure' | 'manga' | 'plushie';
  image_url?: string;
  is_featured?: boolean;
}

export default function AdminProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Always fetch ALL products for stats
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string, productType: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}?type=${productType}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
      }
    } catch (error) {
    }
  };

  if (isLoading || !user?.isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Filter by type AND search term
  const filteredProducts = products.filter(product => {
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'figure':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          gradient: 'from-purple-400 to-pink-500'
        };
      case 'manga':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          gradient: 'from-blue-400 to-cyan-500'
        };
      case 'plushie':
        return {
          color: 'bg-pink-50 text-pink-700 border-pink-200',
          gradient: 'from-pink-400 to-rose-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const typeTabs = [
    { label: 'All Products', value: 'all', count: products.length },
    { label: 'Figures', value: 'figure', count: products.filter(p => p.type === 'figure').length },
    { label: 'Manga', value: 'manga', count: products.filter(p => p.type === 'manga').length },
    { label: 'Plushies', value: 'plushie', count: products.filter(p => p.type === 'plushie').length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your store inventory</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <Link
              href="/admin/products/add"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-purple-600">{products.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">In Stock</p>
            <p className="text-3xl font-bold text-blue-600">{products.filter(p => p.stock_count > 0).length}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm border border-red-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-xs font-semibold text-red-600">Alert</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">{products.filter(p => p.stock_count === 0).length}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-600">Featured</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Featured Items</p>
            <p className="text-3xl font-bold text-yellow-600">{products.filter(p => p.is_featured).length}</p>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <div className="flex gap-1 overflow-x-auto">
            {typeTabs.map((tab) => {
              const config = getTypeConfig(tab.value);
              return (
                <button
                  key={tab.value}
                  onClick={() => setTypeFilter(tab.value)}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    typeFilter === tab.value
                      ? 'bg-gradient-to-r ' + config.gradient + ' text-white shadow-md scale-105'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      typeFilter === tab.value ? 'bg-white/20' : 'bg-gray-100'
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
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No products found</p>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const typeConfig = getTypeConfig(product.type);
                    return (
                      <tr key={`${product.type}-${product.id}`} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              {product.is_featured && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs text-yellow-600 font-medium">Featured</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${typeConfig.color}`}>
                            {product.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${
                            product.stock_count > 10 
                              ? 'text-green-600' 
                              : product.stock_count > 0 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {product.stock_count} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {product.stock_count > 0 ? (
                            <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="w-3 h-3" />
                              In Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                              <AlertCircle className="w-3 h-3" />
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/edit/${product.id}?type=${product.type}`}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition inline-flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteProduct(product.id, product.type)}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
