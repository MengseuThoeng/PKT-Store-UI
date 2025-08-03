'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
    name: "Figures",
    description: "Premium collectible anime figures from your favorite series",
    image: "/categories/figure.jpg",
    itemCount: 156,
    gradient: "from-pink-400 to-rose-500",
    icon: "🎎"
  },
  {
    id: 2,
    name: "Manga",
    description: "Latest releases and classic manga collections",
    image: "/categories/manga.jpg",
    itemCount: 89,
    gradient: "from-purple-400 to-indigo-500",
    icon: "📚"
  },
  {
    id: 3,
    name: "Plushies",
    description: "Soft and cuddly anime character plushies",
    image: "/categories/plushies.jpg",
    itemCount: 67,
    gradient: "from-pink-300 to-purple-400",
    icon: "🧸"
  }
]

interface CategoryCardProps {
  category: Category
  index: number
  onClick: (category: Category) => void
}

function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(category)}
      style={{ 
        animationDelay: `${index * 150}ms`,
        animation: 'slideInUp 0.8s ease-out both'
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
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-75 group-hover:opacity-85 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between text-white p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="text-5xl animate-bounce">
            {category.icon}
          </div>
          <div className={`bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium ${
            isHovered ? 'scale-110' : 'scale-100'
          } transition-transform duration-300`}>
            {category.itemCount} items
          </div>
        </div>

        {/* Center Section - Category Name */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
            {category.name}
          </h3>
          <div className="w-16 h-1 bg-white/50 mx-auto rounded-full"></div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-white/90 mb-4 text-sm leading-relaxed">
            {category.description}
          </p>
          
          {/* Shop Now Button */}
          <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full px-6 py-3 transition-all duration-300 group/btn ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
          }`}>
            <span className="font-semibold">Shop Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Border Glow Effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: `${index * 200}ms` }}></div>
      <div className="absolute bottom-8 left-6 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: `${index * 300}ms` }}></div>
    </div>
  )
}

export default function CategoriesGrid() {
  const [_selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCategoryClick = (category: Category) => {
    console.log('Navigate to category:', category.name)
    setSelectedCategory(category)
    // Navigation will be handled by Link wrapper
  }

  const getCategoryHref = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'figures':
        return '/figures'
      case 'manga':
        return '/manga'
      case 'plushies':
        return '/plushies'
      default:
        return '/'
    }
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Discover amazing anime merchandise in our carefully curated categories
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-pink-300 to-purple-400 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Categories Grid - Perfect 3 Column Layout */}
      <div className="grid md:grid-cols-3 gap-8 md:gap-6">
        {categories.map((category, index) => (
          <Link key={category.id} href={getCategoryHref(category.name)}>
            <CategoryCard
              category={category}
              index={index}
              onClick={handleCategoryClick}
            />
          </Link>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-pink-600">
              {categories.reduce((total, cat) => total + cat.itemCount, 0)}+
            </div>
            <div className="text-gray-600 font-medium">Total Products</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-600">3</div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-rose-600">5★</div>
            <div className="text-gray-600 font-medium">Customer Rating</div>
          </div>
        </div>
      </div>

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