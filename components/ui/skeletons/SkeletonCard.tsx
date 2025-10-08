interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`group relative bg-white rounded-xl shadow-md overflow-hidden border border-pink-100/50 animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
        
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 w-12 h-5 bg-gray-300 rounded-full"></div>
        
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-3/4"></div>
        
        {/* Subtitle */}
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-1/2"></div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-300 rounded w-8"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonMangaCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`group relative bg-white rounded-xl shadow-md overflow-hidden border border-pink-100/50 animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2 w-16 h-5 bg-gray-300 rounded"></div>
        
        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
        
        {/* Volume Badge */}
        <div className="absolute bottom-2 left-2 w-12 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-4/5"></div>
        
        {/* Author */}
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-2/3"></div>
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1">
          <div className="h-4 bg-gray-300 rounded-full w-12"></div>
          <div className="h-4 bg-gray-300 rounded-full w-16"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-300 rounded w-8"></div>
        </div>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonPlushieCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`group relative bg-white rounded-xl shadow-md overflow-hidden border border-pink-100/50 animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
        
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 w-12 h-5 bg-gray-300 rounded-full"></div>
        
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-3/4"></div>
        
        {/* Character/Series */}
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-1/2"></div>
        
        {/* Size Info */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* Material */}
        <div className="h-3 bg-gray-300 rounded w-20"></div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-300 rounded w-8"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
