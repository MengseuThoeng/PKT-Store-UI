"use client"
import { useState } from "react"
import { MessageCircle, Star, Users, TrendingUp, ShieldCheck } from "lucide-react"
import TestimonialCard from "@/components/ui/testimonialCard"
import { testimonials } from "@/lib/data/testimonial-data"

export default function Testimonials() {
  const [visibleCount, setVisibleCount] = useState(6)

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, testimonials.length))
  }

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <MessageCircle className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Don&apos;t just take our word for it - hear from thousands of satisfied anime fans who love shopping with us
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center bg-white rounded-xl p-6 shadow-md border border-pink-100/50">
          <div className="text-2xl font-bold text-pink-600 mb-2">10K+</div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Users className="w-4 h-4" />
            Happy Customers
          </div>
        </div>
        <div className="text-center bg-white rounded-xl p-6 shadow-md border border-pink-100/50">
          <div className="text-2xl font-bold text-rose-600 mb-2 flex items-center justify-center gap-1">
            {averageRating.toFixed(1)}
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="text-center bg-white rounded-xl p-6 shadow-md border border-pink-100/50">
          <div className="text-2xl font-bold text-pink-600 mb-2">99%</div>
          <div className="text-sm text-gray-600">Satisfaction Rate</div>
        </div>
        <div className="text-center bg-white rounded-xl p-6 shadow-md border border-pink-100/50">
          <div className="text-2xl font-bold text-rose-600 mb-2 flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5" />
            24/7
          </div>
          <div className="text-sm text-gray-600">Customer Support</div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {testimonials.slice(0, visibleCount).map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < testimonials.length && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Load More Reviews</span>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          </button>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 bg-white rounded-2xl p-6 shadow-lg border border-pink-100/50">
          <div className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">Trusted Store</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <Users className="w-5 h-5" />
            <span className="font-medium">10K+ Customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
