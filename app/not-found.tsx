"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Home, Search, Package, Heart, Star, Sparkles, ArrowRight, ShoppingBag, Coffee, Gamepad2 } from "lucide-react"

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const quickLinks = [
    { title: "Popular Figures", href: "/figures", icon: Package, color: "from-pink-400 to-rose-500" },
    { title: "Latest Manga", href: "/manga", icon: Coffee, color: "from-purple-400 to-pink-500" },
    { title: "Cute Plushies", href: "/plushies", icon: Heart, color: "from-rose-400 to-pink-500" },
  ]

  const featuredItems = [
    { name: "Gojo Satoru", image: "/figures/GOjo.jpg", category: "figures", price: "$44.99" },
    { name: "Attack on Titan", image: "/manga/aot.jpg", category: "manga", price: "$13.25" },
    { name: "Pikachu Plushie", image: "/plushie/pikachu.png", category: "plushies", price: "$24.99" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-rose-300/15 to-pink-300/15 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Floating Anime Elements */}
        <div className="absolute top-1/4 left-1/6 text-6xl opacity-10 animate-float">🌸</div>
        <div className="absolute top-1/3 right-1/5 text-5xl opacity-15 animate-float delay-1000">⭐</div>
        <div className="absolute bottom-1/4 right-1/3 text-7xl opacity-10 animate-float delay-500">🎌</div>
        <div className="absolute bottom-1/3 left-1/5 text-4xl opacity-15 animate-float delay-700">💫</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Main 404 Hero Section */}
          <div className="text-center mb-12">
            {/* 404 Number with Glitch Effect */}
            <div className="relative mb-8">
              <div className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent select-none relative">
                4<span className="animate-pulse">0</span>4
                <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-pink-200/30 animate-ping">404</div>
              </div>
            </div>

            {/* Main Message */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-100/50 mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-pink-500 animate-spin" />
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Oops! Lost in the Anime Verse
                </h1>
                <Sparkles className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Looks like this page went on an adventure to another dimension! 🌌<br/>
                Don&apos;t worry, we&apos;ll help you find your way back to the otaku paradise.
              </p>

              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-2xl mx-auto group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-full shadow-lg border-2 border-pink-200 overflow-hidden">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for figures, manga, plushies..."
                      className="w-full pl-14 pr-32 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 rounded-full"
                    />
                    <Search className="absolute left-4 top-4 h-6 w-6 text-pink-400" />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                    >
                      Search
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Back to Home
                </Link>
                
                <Link
                  href="/figures"
                  className="inline-flex items-center gap-3 bg-white border-2 border-pink-300 text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 hover:border-pink-400 transform hover:scale-105 transition-all duration-300 group"
                >
                  <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-pink-100/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <link.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{link.title}</h3>
                <div className="flex items-center justify-center text-pink-500 group-hover:text-purple-500 transition-colors">
                  <span className="text-sm font-medium">Explore Now</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Featured Items Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-pink-100/50 mb-8">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Popular Right Now</h2>
              <Star className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredItems.map((item, index) => (
                <Link
                  key={index}
                  href={`/${item.category}`}
                  className="group bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-pink-100"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{item.name}</h4>
                  <p className="text-pink-600 font-bold text-lg">{item.price}</p>
                  <div className="mt-3 flex items-center justify-center text-purple-500 group-hover:text-pink-500 transition-colors">
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Anime Quote */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 shadow-xl">
              <p className="text-white text-lg font-medium mb-2">
                &quot;Even the strongest heroes sometimes take a wrong turn!&quot;
              </p>
              <p className="text-pink-100 text-sm">
                - Every anime protagonist ever 🌟
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-2px, -2px); }
          20% { transform: translate(2px, 2px); }
          30% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          90% { transform: translate(-2px, 1px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-glitch {
          animation: glitch 2s infinite;
        }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  )
}
