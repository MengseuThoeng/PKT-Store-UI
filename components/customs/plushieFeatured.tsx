"use client"
import { useState } from "react"
import { Heart } from "lucide-react"
import PlushieCard from "@/components/ui/plushie"
import { featuredPlushies } from "@/lib/data/plushie-data"
import type { Plushie } from "@/lib/types/plushie"
import { useCart } from "@/lib/context/CartContext"
import { useToast } from "@/lib/hooks/useToast"
import ToastContainer from "@/components/ui/toast"

export default function FeaturedPlushies() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const { addItem } = useCart()
  const { toasts, addToast, removeToast } = useToast()

  const handleAddToCart = (plushie: Plushie) => {
    addItem({
      id: plushie.id,
      type: 'plushie',
      name: plushie.name,
      price: plushie.price,
      originalPrice: plushie.originalPrice,
      image: plushie.image,
      maxStock: plushie.stockCount || 10,
      series: plushie.series,
      character: plushie.character,
      quantity: 1
    })
    
    addToast(`Added ${plushie.name} to cart!`, 'success')
  }

  const handleToggleWishlist = (plushieId: number) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(plushieId)) {
      newWishlist.delete(plushieId)
    } else {
      newWishlist.add(plushieId)
    }
    setWishlist(newWishlist)
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            Adorable Plushies
          </h2>
          <Heart className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Cuddle up with our super soft and huggable plushie collection featuring your favorite anime characters
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Plushies Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredPlushies.slice(0, 4).map((plushie) => (
          <PlushieCard
            key={plushie.id}
            plushie={plushie}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(plushie.id)}
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600 mb-1">200+</div>
          <div className="text-sm text-gray-600">Plushie Designs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-rose-600 mb-1">Ultra</div>
          <div className="text-sm text-gray-600">Soft Materials</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600 mb-1">100%</div>
          <div className="text-sm text-gray-600">Huggable</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-rose-600 mb-1">5★</div>
          <div className="text-sm text-gray-600">Cuddle Rating</div>
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <button className="inline-flex items-center gap-2 bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          <span>View All Plushies</span>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        </button>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  )
}
