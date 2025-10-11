'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  product_id: number;
  product_type: 'plushie' | 'manga' | 'figure';
  created_at: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: number, productType: string) => boolean;
  addToWishlist: (productId: number, productType: 'plushie' | 'manga' | 'figure') => Promise<boolean>;
  removeFromWishlist: (productId: number, productType: string) => Promise<boolean>;
  toggleWishlist: (productId: number, productType: 'plushie' | 'manga' | 'figure') => Promise<boolean>;
  loadWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [isAuthenticated, user]);

  // Update count when items change
  useEffect(() => {
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.items || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const isInWishlist = (productId: number, productType: string): boolean => {
    return wishlistItems.some(
      item => item.product_id === productId && item.product_type === productType
    );
  };

  const addToWishlist = async (productId: number, productType: 'plushie' | 'manga' | 'figure'): Promise<boolean> => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return false;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, product_type: productType }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(prev => [...prev, data.item]);
        return true;
      } else {
        console.error('Failed to add to wishlist:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: number, productType: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, product_type: productType }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(prev =>
          prev.filter(item => !(item.product_id === productId && item.product_type === productType))
        );
        return true;
      } else {
        console.error('Failed to remove from wishlist:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const toggleWishlist = async (productId: number, productType: 'plushie' | 'manga' | 'figure'): Promise<boolean> => {
    if (isInWishlist(productId, productType)) {
      return await removeFromWishlist(productId, productType);
    } else {
      return await addToWishlist(productId, productType);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        loadWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
