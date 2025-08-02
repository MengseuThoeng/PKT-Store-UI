"use client"
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/slider/S3.png",
    title: "New Manga Collection",
    subtitle: "Discover the latest chapters from your favorite series",
    cta: "Shop Manga",
    gradient: "from-pink-500/80 to-purple-600/80",
  },
  {
    id: 2,
    image: "/slider/S4.png",
    title: "Premium Figures",
    subtitle: "Collectible figures from top anime series",
    cta: "Browse Figures",
    gradient: "from-rose-500/80 to-pink-600/80",
  },
  {
    id: 3,
    image: "/slider/S2.png",
    title: "Adorable Plushies",
    subtitle: "Soft and cuddly companions for every fan",
    cta: "View Plushies",
    gradient: "from-pink-400/80 to-rose-500/80",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoplay || !instanceRef.current) return

    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoplay, instanceRef])

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index)
  }

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay)
  }

  return (
    <div className="relative group">
      <div ref={sliderRef} className="keen-slider h-screen w-full overflow-hidden">
        {slides.map((slide, i) => (
          <div key={slide.id} className="keen-slider__slide relative">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
              <div className="max-w-4xl px-6">
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in">{slide.title}</h1>
                <p className="text-xl sm:text-2xl lg:text-3xl mb-12 opacity-90 animate-fade-in-delay max-w-3xl mx-auto">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700 font-semibold px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {loaded && instanceRef.current && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-6 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 w-14 h-14"
            onClick={() => instanceRef.current?.prev()}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-6 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 w-14 h-14"
            onClick={() => instanceRef.current?.next()}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {loaded && instanceRef.current && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      )}

      {/* Autoplay Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 w-12 h-12"
        onClick={toggleAutoplay}
      >
        {isAutoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>

      {/* Slide Counter */}
      <div className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-base font-medium border border-white/20">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}
