"use client"
import { useState } from "react"
import { BookOpen } from "lucide-react"
import MangaCard from "@/components/ui/mangaCard"
import { featuredManga } from "@/lib/data/manga-data"
import type { Manga } from "@/lib/types/manga"
import { useCart } from "@/lib/context/CartContext"
import { useToast } from "@/lib/hooks/useToast"
import ToastContainer from "@/components/ui/toast"

export default function FeaturedManga() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const { addItem } = useCart()
  const { toasts, addToast, removeToast } = useToast()

  const handleAddToCart = (manga: Manga) => {
    addItem({
      id: manga.id,
      type: 'manga',
      name: manga.title,
      price: manga.price,
      originalPrice: manga.originalPrice,
      image: manga.image,
      maxStock: manga.stockCount || 10,
      series: manga.title,
      character: manga.author,
      quantity: 1
    })
    
    addToast(`Added ${manga.title} to cart!`, 'success')
  }

  const handleToggleWishlist = (mangaId: number) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(mangaId)) {
      newWishlist.delete(mangaId)
    } else {
      newWishlist.add(mangaId)
    }
    setWishlist(newWishlist)
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent">
            Featured Manga Collection
          </h2>
          <BookOpen className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dive into captivating stories with our carefully curated selection of the most popular and acclaimed manga
          series
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Manga Grid - Adjusted for smaller cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredManga.slice(0, 4).map((manga) => (
          <MangaCard
            key={manga.id}
            manga={manga}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(manga.id)}
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600 mb-1">500+</div>
          <div className="text-sm text-gray-600">Manga Titles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-rose-600 mb-1">50+</div>
          <div className="text-sm text-gray-600">Popular Series</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600 mb-1">24/7</div>
          <div className="text-sm text-gray-600">New Releases</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-rose-600 mb-1">98%</div>
          <div className="text-sm text-gray-600">Reader Satisfaction</div>
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <button className="inline-flex items-center gap-2 bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          <span>Explore All Manga</span>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        </button>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  )
}
