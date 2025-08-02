"use client"
import { useState } from "react"
import Image from "next/image"
import { Star, ShieldCheck, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types/testimonial"

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export default function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100/50 p-6 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-pink-200">
        <Quote className="w-8 h-8" />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Image
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            width={60}
            height={60}
            className="rounded-full border-2 border-pink-200"
          />
          {testimonial.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500">{testimonial.username}</p>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4 line-clamp-4 leading-relaxed">{testimonial.review}</p>

      {/* Product & Date */}
      <div className="flex items-center justify-between text-sm">
        <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">{testimonial.product}</div>
        <span className="text-gray-500">{testimonial.date}</span>
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 rounded-xl border-2 border-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />
    </div>
  )
}
