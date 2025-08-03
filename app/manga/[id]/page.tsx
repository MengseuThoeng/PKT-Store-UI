"use client"
import { notFound } from "next/navigation"
import { ArrowLeft, Share2, ShoppingCart, Heart, Star, BookOpen, Calendar, User, Globe, Award, Package, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { featuredManga } from "@/lib/data/manga-data"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function MangaDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)

  const manga = featuredManga.find((m) => m.id === parseInt(params.id as string))

  if (!manga) {
    notFound()
  }

  console.log('Manga image path:', manga.image) // Debug log

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${manga.title} to cart`)
  }

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    console.log(`${isInWishlist ? "Removed from" : "Added to"} wishlist: ${manga.title}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: manga.title,
        text: `Check out this amazing manga: ${manga.title} by ${manga.author}`,
        url: window.location.href,
      })
    }
  }

  const getStatusColor = () => {
    switch (manga.status) {
      case "new":
        return "bg-pink-500"
      case "ongoing":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (manga.status) {
      case "new":
        return "NEW RELEASE"
      case "ongoing":
        return "ONGOING"
      case "completed":
        return "COMPLETED"
      default:
        return "UNKNOWN"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/manga" 
            className="group flex items-center gap-3 bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-300 rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="p-2 bg-pink-100 group-hover:bg-pink-200 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 text-pink-600" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-pink-700">Back to Manga</span>
          </Link>
          <button
            onClick={handleShare}
            className="group flex items-center gap-3 bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-300 rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="p-2 bg-pink-100 group-hover:bg-pink-200 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-pink-600" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-pink-700">Share</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px]">
              <div className="aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                {!imageError ? (
                  <Image
                    src={manga.image}
                    alt={manga.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Image not available</p>
                      <p className="text-xs text-gray-400 mt-1">Path: {manga.image}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-4 left-4 ${getStatusColor()} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                {getStatusText()}
              </div>
              
              {/* Popular Badge */}
              {manga.isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  POPULAR
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{manga.title}</h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <User className="w-5 h-5" />
                by {manga.author}
              </p>
            </div>

            {/* Rating */}
            {manga.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(manga.rating!)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{manga.rating}</span>
                <span className="text-gray-500">(128 reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-pink-600">${manga.price.toFixed(2)}</span>
                {manga.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${manga.originalPrice.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                      -{Math.round(((manga.originalPrice - manga.price) / manga.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-xl border-2 transition-colors ${
                      isInWishlist
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{manga.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Manga Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Volumes
                  </span>
                  <span className="font-semibold text-gray-800">{manga.volumes}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor()} text-white`}>
                    {getStatusText()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Publisher</span>
                  <span className="font-semibold text-gray-800">{manga.publisher || "Shogakukan"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold text-gray-800">{manga.language || "English"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Demographics</span>
                  <span className="font-semibold text-gray-800">{manga.demographics || "Shounen"}</span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genre.map((genre) => (
                  <span
                    key={genre}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Features</h3>
              <div className="space-y-2">
                {(manga.features || ["High-quality print", "Original Japanese artwork", "Bonus content included", "Collector's edition"]).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Truck className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Fast Shipping</h4>
            <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Shield className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Authenticity Guarantee</h4>
            <p className="text-sm text-gray-600">100% authentic manga guaranteed</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <RotateCcw className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Easy Returns</h4>
            <p className="text-sm text-gray-600">30-day hassle-free returns</p>
          </div>
        </div>
      </div>
    </div>
  )
}
