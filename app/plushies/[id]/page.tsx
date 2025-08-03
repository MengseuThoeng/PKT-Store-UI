"use client"
import { notFound } from "next/navigation"
import { ArrowLeft, Share2, ShoppingCart, Heart, Star, Ruler, Package, User, Calendar, Weight, Shield, Truck, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { featuredPlushies } from "@/lib/data/plushie-data"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function PlushieDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)

  const plushie = featuredPlushies.find((p) => p.id === parseInt(params.id as string))

  if (!plushie) {
    notFound()
  }

  console.log('Plushie image path:', plushie.image) // Debug log

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${plushie.name} to cart`)
  }

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    console.log(`${isInWishlist ? "Removed from" : "Added to"} wishlist: ${plushie.name}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: plushie.name,
        text: `Check out this adorable plushie: ${plushie.character} from ${plushie.series}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/plushies" 
            className="group flex items-center gap-3 bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-300 rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="p-2 bg-pink-100 group-hover:bg-pink-200 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 text-pink-600" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-pink-700">Back to Plushies</span>
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
                    src={plushie.image}
                    alt={plushie.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Image not available</p>
                      <p className="text-xs text-gray-400 mt-1">Path: {plushie.image}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* New Badge */}
              {plushie.isNew && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  NEW ARRIVAL
                </div>
              )}
              
              {/* Size Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 shadow-lg">
                <Ruler className="w-4 h-4" />
                {plushie.size}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-lg text-pink-600 font-semibold mb-1">{plushie.series}</p>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{plushie.character}</h1>
              <p className="text-lg text-gray-600">{plushie.name}</p>
            </div>

            {/* Rating */}
            {plushie.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(plushie.rating!)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{plushie.rating}</span>
                <span className="text-gray-500">(89 reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-pink-600">${plushie.price.toFixed(2)}</span>
                {plushie.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${plushie.originalPrice.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                      -{Math.round(((plushie.originalPrice - plushie.price) / plushie.originalPrice) * 100)}% OFF
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
              <p className="text-gray-600 leading-relaxed">
                {plushie.description || `This adorable ${plushie.character} plushie from ${plushie.series} is perfect for fans and collectors alike. Made with premium materials and attention to detail, this ${plushie.size.toLowerCase()} plushie brings your favorite character to life in the softest, most huggable way possible.`}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Size
                  </span>
                  <span className="font-semibold text-gray-800">{plushie.size}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Material
                  </span>
                  <span className="font-semibold text-gray-800">{plushie.material || "Premium Plush"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Series</span>
                  <span className="font-semibold text-gray-800">{plushie.series}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Character</span>
                  <span className="font-semibold text-gray-800">{plushie.character}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Manufacturer</span>
                  <span className="font-semibold text-gray-800">{plushie.manufacturer || "PKT Store"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Age Range</span>
                  <span className="font-semibold text-gray-800">{plushie.ageRange || "3+ years"}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Features</h3>
              <div className="space-y-2">
                {(plushie.features || ["Super soft and cuddly", "High-quality stitching", "Collectible design", "Perfect for gifting"]).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Care Instructions</h3>
              <div className="space-y-2 text-gray-600">
                <p>• {plushie.careInstructions || "Surface wash only with mild soap"}</p>
                <p>• Air dry completely before use</p>
                <p>• Do not machine wash or tumble dry</p>
                <p>• Keep away from direct sunlight for extended periods</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Truck className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Fast Shipping</h4>
            <p className="text-sm text-gray-600">Free shipping on orders over $35</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Shield className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Authentic Products</h4>
            <p className="text-sm text-gray-600">100% genuine licensed merchandise</p>
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
