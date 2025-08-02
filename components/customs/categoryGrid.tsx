'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

type Category = {
  id: number
  name: string
  description: string
  image: string
  itemCount: number
  gradient: string
  icon: string
}

const categories: Category[] = [
  {
    id: 1,
    name: "Action Figures",
    description: "Premium collectible figures",
    image: "/categories/figure.jpg",
    itemCount: 156,
    gradient: "from-pink-400 to-rose-500",
    icon: "🎎"
  },
  {
    id: 2,
    name: "Manga Collection",
    description: "Latest & classic manga series",
    image: "/categories/manga.jpg",
    itemCount: 89,
    gradient: "from-purple-400 to-indigo-500",
    icon: "📚"
  },
  {
    id: 3,
    name: "Plushies",
    description: "Soft & cuddly anime characters",
    image: "/categories/plushies.jpg",
    itemCount: 67,
    gradient: "from-pink-300 to-purple-400",
    icon: "🧸"
  },
  {
    id: 4,
    name: "Accessories",
    description: "Keychains, pins & more",
    image: "/categories/keychain.jpg",
    itemCount: 134,
    gradient: "from-rose-400 to-pink-500",
    icon: "✨"
  }
]

interface CategoryCardProps {
  category: Category
  index: number
  onClick: (category: Category) => void
}

function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Layout: Action Figures (large 2x3), others stack vertically on the right
  const getCardClasses = () => {
    switch(index) {
      case 0: // Action Figures - Large featured card
        return "col-span-2 row-span-3"
      case 1: // Manga - Top right
        return "col-span-1 row-span-1"
      case 2: // Plushies - Middle right  
        return "col-span-1 row-span-1"
      case 3: // Accessories - Bottom right
        return "col-span-1 row-span-1"
      default:
        return "col-span-1 row-span-1"
    }
  }

  const isLargeCard = index === 0

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${getCardClasses()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(category)}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'slideInUp 0.6s ease-out both'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          sizes={isLargeCard ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-between text-white ${
        isLargeCard ? 'p-8' : 'p-4'
      }`}>
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className={`${isLargeCard ? 'text-5xl md:text-6xl' : 'text-3xl'}`}>
            {category.icon}
          </div>
          <div className={`bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium ${
            isHovered ? 'scale-110' : 'scale-100'
          } transition-transform duration-300 ${isLargeCard ? 'px-3 text-sm' : ''}`}>
            {category.itemCount} items
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          <h3 className={`font-bold mb-2 ${
            isLargeCard ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}>
            {category.name}
          </h3>
          <p className={`opacity-90 mb-4 ${
            isLargeCard ? 'text-base md:text-lg' : 'text-xs'
          }`}>
            {category.description}
          </p>
          
          {/* Shop Now Button */}
          <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300 group/btn ${
            isHovered ? 'translate-x-2' : 'translate-x-0'
          } ${isLargeCard ? 'px-4 py-2' : 'px-3 py-1'}`}>
            <span className={isLargeCard ? 'text-base' : 'text-xs'}>Shop Now</span>
            <ArrowRight className={`transition-transform duration-300 group-hover/btn:translate-x-1 ${
              isLargeCard ? 'w-5 h-5' : 'w-3 h-3'
            }`} />
          </div>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out`} />

      {/* Border Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  )
}

export default function CategoriesGrid() {
  const [_selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCategoryClick = (category: Category) => {
    console.log('Navigate to category:', category.name)
    setSelectedCategory(category)
    // Add your navigation logic here
    // router.push(`/category/${category.id}`)
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our vast collection of anime merchandise organized by your favorite categories
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-purple-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            onClick={handleCategoryClick}
          />
        ))}
      </div>

      {/* Bottom CTA
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for?
        </p>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          <span>Browse All Products</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div> */}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}