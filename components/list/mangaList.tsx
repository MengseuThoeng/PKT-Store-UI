"use client"
import { useState, useMemo } from "react"
import { Search, Filter, Grid3X3, List, Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import MangaCard from "@/components/ui/mangaCard"
import { featuredManga } from "@/lib/data/manga-data"
import type { Manga } from "@/lib/types/manga"

type SortOption = "title" | "price-low" | "price-high" | "rating" | "popular" | "author" | "volumes"
type ViewMode = "grid" | "list"
type StatusFilter = "all" | "ongoing" | "completed" | "new"

export default function MangaListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)
  const [showOnSale, setShowOnSale] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  // Get unique genres and authors for filters
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>()
    featuredManga.forEach(manga => manga.genre.forEach(g => genres.add(g)))
    return Array.from(genres).sort()
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = featuredManga.filter((manga) => {
      const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           manga.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           manga.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPopular = !showOnlyPopular || manga.isPopular
      const matchesOnSale = !showOnSale || (manga.originalPrice && manga.originalPrice > manga.price)
      const matchesStatus = statusFilter === "all" || manga.status === statusFilter
      const matchesGenre = genreFilter === "all" || manga.genre.includes(genreFilter)
      
      return matchesSearch && matchesPopular && matchesOnSale && matchesStatus && matchesGenre
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "popular":
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
        case "author":
          return a.author.localeCompare(b.author)
        case "volumes":
          return b.volumes - a.volumes
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, showOnlyPopular, showOnSale, statusFilter, genreFilter])

  // Pagination calculations
  const totalItems = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredAndSortedProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, showOnlyPopular, showOnSale, statusFilter, genreFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleAddToCart = (manga: Manga) => {
    console.log("Added to cart:", manga)
    alert(`${manga.title} added to cart!`)
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-4">
            Manga Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our extensive collection of manga from legendary classics to the latest releases
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search manga, authors, or genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
                <option value="author">Author A-Z</option>
                <option value="volumes">Most Volumes</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="new">New Release</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Filters */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyPopular}
                  onChange={(e) => setShowOnlyPopular(e.target.checked)}
                  className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">Popular Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} manga
          </p>
          {totalPages > 1 && (
            <p className="text-gray-600 text-sm mt-2 sm:mt-0">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Products Grid/List */}
        {currentItems.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {currentItems.map((manga) => (
              <MangaCard
                key={manga.id}
                manga={manga}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={wishlist.has(manga.id)}
                className={viewMode === "list" ? "flex flex-row" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No manga found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-300 hover:border-pink-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        page === currentPage
                          ? "bg-pink-500 text-white"
                          : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-300 hover:border-pink-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="text-gray-400">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-300 hover:border-pink-300"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pink-500 mb-2">
                {featuredManga.length}+
              </div>
              <div className="text-gray-600">Manga Titles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-500 mb-2">
                {featuredManga.filter(m => m.isPopular).length}
              </div>
              <div className="text-gray-600">Popular Series</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-500 mb-2">
                {uniqueGenres.length}
              </div>
              <div className="text-gray-600">Different Genres</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-500 mb-2">
                {featuredManga.filter(m => m.originalPrice && m.originalPrice > m.price).length}
              </div>
              <div className="text-gray-600">On Sale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
