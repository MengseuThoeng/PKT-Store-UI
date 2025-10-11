'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: number;
  productType: 'plushie' | 'manga' | 'figure';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  productType,
  className = '',
  size = 'md',
  showText = false
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const inWishlist = isInWishlist(productId, productType);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);
    try {
      const success = await toggleWishlist(productId, productType);
      if (success) {
        // Optional: Show toast notification
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center gap-2
        rounded-full
        transition-all duration-300
        ${inWishlist 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500 border border-gray-200'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-lg hover:shadow-xl
        ${className}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSizes[size]}
        fill={inWishlist ? 'currentColor' : 'none'}
        className={`transition-transform ${isLoading ? 'animate-pulse' : 'hover:scale-110'}`}
      />
      {showText && (
        <span className="font-medium">
          {inWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
