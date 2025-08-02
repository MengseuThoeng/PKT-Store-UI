"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Package,
  Calendar,
  Ruler,
  Factory,
  Info,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { featuredProducts } from "@/lib/data/figure-data"
import type { Figure } from "@/lib/types/figure"

export default function FigureDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [figure, setFigure] = useState<Figure | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const figureId = parseInt(params.id as string)
    const foundFigure = featuredProducts.find(f => f.id === figureId)
    setFigure(foundFigure || null)
    setIsLoading(false)
  }, [params.id])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (figure?.stockCount || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} of ${figure?.name} to cart`)
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: figure?.name,
        text: figure?.description,
        url: window.location.href,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!figure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Figure Not Found</h1>
          <Link
            href="/figures"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Figures
          </Link>
        </div>
      </div>
    )
  }

  const images = figure.images && figure.images.length > 0 ? figure.images : [figure.image]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image - FIXED SIZE */}
            <div className="relative w-full h-[700px] bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
              <Image
                src={images[selectedImageIndex]}
                alt={figure.name}
                fill
                className="object-contain p-6"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {figure.isNew && (
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    NEW
                  </div>
                )}
                {figure.originalPrice && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{Math.round(((figure.originalPrice - figure.price) / figure.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all disabled:opacity-50"
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all disabled:opacity-50"
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails - FIXED SIZE */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-pink-500 shadow-md' 
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${figure.name} view ${index + 1}`}
                      fill
                      className="object-contain bg-white p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{figure.name}</h1>
              
              {/* Rating */}
              {figure.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(figure.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">({figure.rating})</span>
                </div>
              )}
              
              {/* Series */}
              {figure.series && (
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                  <Package className="w-4 h-4" />
                  {figure.series}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl font-bold text-pink-600">${figure.price.toFixed(2)}</span>
                {figure.originalPrice && (
                  <div>
                    <span className="text-xl text-gray-400 line-through">${figure.originalPrice.toFixed(2)}</span>
                    <div className="text-sm text-green-600 font-semibold">
                      Save ${(figure.originalPrice - figure.price).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {figure.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">In Stock</span>
                    {figure.stockCount && (
                      <span className="text-gray-500">({figure.stockCount} available)</span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{figure.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-pink-500" />
                Specifications
              </h3>
              <div className="space-y-3">
                {figure.character && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Character:</span>
                    <span className="font-medium text-gray-900">{figure.character}</span>
                  </div>
                )}
                {figure.manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="font-medium text-gray-900">{figure.manufacturer}</span>
                  </div>
                )}
                {figure.scale && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scale:</span>
                    <span className="font-medium text-gray-900">{figure.scale}</span>
                  </div>
                )}
                {figure.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium text-gray-900">{figure.dimensions}</span>
                  </div>
                )}
                {figure.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900">{figure.material}</span>
                  </div>
                )}
                {figure.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Release Date:</span>
                    <span className="font-medium text-gray-900">{figure.releaseDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {figure.features && figure.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {figure.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= (figure.stockCount || 10)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                  disabled={!figure.inStock}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart - ${(figure.price * quantity).toFixed(2)}
                </button>
                
                <button
                  onClick={handleToggleWishlist}
                  className={`w-full border-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50 text-gray-700 hover:text-pink-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
