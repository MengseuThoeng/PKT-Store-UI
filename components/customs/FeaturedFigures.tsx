"use client"
import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import ProductCard from "@/components/ui/figureCard"
import { featuredProducts } from "@/lib/data/figure-data"
import type { Figure } from "@/lib/types/figure"
import { useCart } from "@/lib/context/CartContext"
import { useToast } from "@/lib/hooks/useToast"
import ToastContainer from "@/components/ui/toast"

export default function FeaturedFigures() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const { addItem } = useCart()
  const { toasts, addToast, removeToast } = useToast()

  const handleAddToCart = (figure: Figure) => {
    addItem({
      id: figure.id,
      type: 'figure',
      name: figure.name,
      price: figure.price,
      originalPrice: figure.originalPrice,
      image: figure.image,
      maxStock: figure.stockCount || 10,
      series: figure.series,
      character: figure.character,
      quantity: 1
    })
    
    addToast(`Added ${figure.name} to cart!`, 'success')
  }

  const handleToggleWishlist = (figureId: number) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(figureId)) {
      newWishlist.delete(figureId)
    } else {
      newWishlist.add(figureId)
    }
    setWishlist(newWishlist)
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            Featured Figures
          </h2>
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our hand-picked collection of premium anime figures from your favorite series
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.slice(0, 4).map((figure) => (
          <ProductCard
            key={figure.id}
            figure={figure}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(figure.id)}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link href="/figures">
          <button className="inline-flex items-center gap-2 bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <span>View All Figures</span>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          </button>
        </Link>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  )
}
