'use client';

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

interface WishlistItemWithProduct {
  id: string;
  product_id: number;
  product_type: 'plushie' | 'manga' | 'figure';
  created_at: string;
  product: any;
}

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loadWishlist, wishlistCount } = useWishlist();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login?redirect=/wishlist');
      return;
    }

    loadData();
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await loadWishlist();
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: number, productType: string) => {
    const success = await removeFromWishlist(productId, productType);
    if (success) {
      setItems(prev => prev.filter(item => 
        !(item.product_id === productId && item.product_type === productType)
      ));
    }
  };

  const handleMoveToCart = async (item: WishlistItemWithProduct) => {
    if (item.product && item.product.stock_count > 0) {
      addItem({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image_url,
        type: item.product_type,
        maxStock: item.product.stock_count,
        quantity: 1
      });
      await handleRemove(item.product_id, item.product_type);
    }
  };

  const getProductLink = (productId: number, productType: string) => {
    const typeMap = {
      plushie: 'plushies',
      manga: 'manga',
      figure: 'figures'
    };
    return `/${typeMap[productType as keyof typeof typeMap]}/${productId}`;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlistCount === 0 
              ? 'Your wishlist is empty' 
              : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved`
            }
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love so you don't lose them!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/plushies"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Plushies
              </Link>
              <Link
                href="/manga"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Manga
              </Link>
              <Link
                href="/figures"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Figures
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={getProductLink(item.product_id, item.product_type)}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product?.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name || 'Product'}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {item.product?.stock_count === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={getProductLink(item.product_id, item.product_type)}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                        {item.product?.name || 'Product'}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {item.product_type}
                      </span>
                      {item.product?.stock_count > 0 ? (
                        <span className="text-sm text-green-600 font-medium">
                          In Stock: {item.product.stock_count}
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      ${item.product?.price?.toFixed(2) || '0.00'}
                    </p>

                    {item.product?.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.product || item.product.stock_count === 0}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                        ${item.product?.stock_count > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <ShoppingCart size={18} />
                      Move to Cart
                    </button>
                    
                    <button
                      onClick={() => handleRemove(item.product_id, item.product_type)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {items.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your wishlist items
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/cart"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  View Cart
                </Link>
                <Link
                  href="/"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
