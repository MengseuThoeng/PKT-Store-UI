'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import AdminLayout from '@/components/ui/AdminLayout';
import { ArrowLeft, Save, Upload, Package, DollarSign, Hash, Image as ImageIcon, Star, Trash2, X } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_count: '',
    type: 'figure',
    image_url: '',
    is_featured: false,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchProduct();
  }, [user, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);
      const data = await response.json();
      
      if (data.success && data.product) {
        const product = data.product;
        setFormData({
          name: product.name || product.title || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock_count: product.stock_count?.toString() || '',
          type: product.type || 'figure',
          image_url: product.image_url || product.image || '',
          is_featured: product.is_featured || false,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_count: parseInt(formData.stock_count),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/products');
      } else {
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/products');
      } else {
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Products</span>
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-emerald-100 mt-2">Update product information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock_count}
                    onChange={(e) => setFormData({ ...formData, stock_count: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                  <option value="figure">Figure</option>
                  <option value="manga">Manga</option>
                  <option value="plushie">Plushie</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              Product Image
            </h2>
            
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload from Computer
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </span>
                  </label>
                  {formData.image_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      <span className="font-medium">Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB. Supported: JPG, PNG, GIF, WebP</p>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* Preview */}
              {formData.image_url && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23ddd" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Invalid Image</text></svg>';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-600" />
              Additional Options
            </h2>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <input
                type="checkbox"
                id="featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                <Star className="w-4 h-4 text-yellow-600" />
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition font-medium flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Product
            </button>

            <div className="flex gap-3">
              <Link
                href="/admin/products"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
