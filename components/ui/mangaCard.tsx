"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Star, BookOpen, Eye } from "lucide-react"
import type { Manga } from "@/lib/types/manga"

interface MangaCardProps {
  manga: Manga
  onAddToCart?: (manga: Manga) => void
  onToggleWishlist?: (mangaId: number) => void
  isInWishlist?: boolean
  className?: string
}

export default function MangaCard({
  manga,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className = "",
}: MangaCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    onAddToCart?.(manga)
  }

  const handleToggleWishlist = () => {
    onToggleWishlist?.(manga.id)
  }

  const getStatusColor = () => {
    switch (manga.status) {
      case "new":
        return "bg-pink-500"
      case "ongoing":
        return "bg-blue-500"
      case "completed":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (manga.status) {
      case "new":
        return "NEW"
      case "ongoing":
        return "ONGOING"
      case "completed":
        return "COMPLETE"
      default:
        return "UNKNOWN"
    }
  }

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100/50 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div
        className={`absolute top-2 left-2 z-10 ${getStatusColor()} text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md`}
      >
        {getStatusText()}
      </div>

      {/* Popular Badge */}
      {manga.isPopular && (
        <div className="absolute top-2 right-10 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          <Eye className="w-3 h-3" />
          HOT
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 group/heart"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 group-hover/heart:scale-110 ${
            isInWishlist ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Image Container - Made smaller */}
      <Link href={`/manga/${manga.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
          <Image
            src={manga.image || "/placeholder.svg"}
            alt={manga.title}
            fill
            className={`object-cover transition-all duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* View Details Button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              View Details
            </div>
          </div>
        </div>
      </Link>

      {/* Content - Reduced padding */}
      <div className="p-4">
        {/* Rating & Volumes */}
        <div className="flex items-center justify-between mb-2">
          {manga.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(manga.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">({manga.rating})</span>
            </div>
          )}
          <span className="text-xs text-pink-600 font-medium">Vol. {manga.volumes}</span>
        </div>

        {/* Title & Author */}
        <Link href={`/manga/${manga.id}`} className="block">
          <h3 className="font-bold text-base mb-1 text-gray-800 hover:text-pink-600 transition-colors line-clamp-1">
            {manga.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-600 mb-2">by {manga.author}</p>

        {/* Genres - Limited to 2 */}
        <div className="flex flex-wrap gap-1 mb-2">
          {manga.genre.slice(0, 2).map((genre) => (
            <span key={genre} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
              {genre}
            </span>
          ))}
        </div>

        {/* Description - Single line */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-1">{manga.description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-pink-600">${manga.price.toFixed(2)}</span>
          {manga.originalPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">${manga.originalPrice.toFixed(2)}</span>
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                -{Math.round(((manga.originalPrice - manga.price) / manga.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button - Smaller */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 group/btn text-sm"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:animate-pulse" />
          Add to Cart
        </button>
      </div>

      {/* Hover Effect Border - Simplified */}
      <div className="absolute inset-0 rounded-xl border-2 border-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
