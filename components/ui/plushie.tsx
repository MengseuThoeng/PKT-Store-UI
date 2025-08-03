"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Star, Ruler } from "lucide-react"
import type { Plushie } from "@/lib/types/plushie"

interface PlushieCardProps {
  plushie: Plushie
  onAddToCart?: (plushie: Plushie) => void
  onToggleWishlist?: (plushieId: number) => void
  isInWishlist?: boolean
  className?: string
}

export default function PlushieCard({
  plushie,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className = "",
}: PlushieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    onAddToCart?.(plushie)
  }

  const handleToggleWishlist = () => {
    onToggleWishlist?.(plushie.id)
  }

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100/50 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* New Badge */}
      {plushie.isNew && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-md">
          NEW
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

      {/* Image Container */}
      <Link href={`/plushies/${plushie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
          <Image
            src={plushie.image || "/placeholder.svg"}
            alt={plushie.name}
            fill
            className={`object-cover transition-all duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
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
              <Ruler className="w-3 h-3" />
              View Details
            </div>
          </div>

          {/* Size Badge */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            {plushie.size.split(" ")[0]}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        {plushie.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(plushie.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({plushie.rating})</span>
          </div>
        )}

        {/* Character & Series */}
        <div className="mb-1">
          <p className="text-xs text-pink-600 font-medium">{plushie.series}</p>
        </div>

        {/* Plushie Name */}
        <Link href={`/plushies/${plushie.id}`} className="block">
          <h3 className="font-bold text-base mb-1 text-gray-800 hover:text-pink-600 transition-colors line-clamp-1">
            {plushie.character}
          </h3>
        </Link>

        {/* Material */}
        {plushie.material && <p className="text-xs text-gray-500 mb-2">{plushie.material}</p>}

        {/* Size */}
        <div className="mb-2">
          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">{plushie.size}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-pink-500">${plushie.price.toFixed(2)}</span>
          {plushie.originalPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">${plushie.originalPrice.toFixed(2)}</span>
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                -{Math.round(((plushie.originalPrice - plushie.price) / plushie.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 group/btn text-sm"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:animate-pulse" />
          Add to Cart
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
