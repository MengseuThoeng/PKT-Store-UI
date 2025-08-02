"use client"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Heart, Star, Sparkles } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "Anime Figures", href: "#figures" },
    { name: "Manga Collection", href: "#manga" },
    { name: "Plushies", href: "#plushies" },
    { name: "Accessories", href: "#accessories" },
    { name: "New Releases", href: "#new-releases" },
    { name: "Pre-Orders", href: "#pre-orders" },
  ],
  support: [
    { name: "Contact Us", href: "#contact" },
    { name: "Shipping Info", href: "#shipping" },
    { name: "Returns & Exchanges", href: "#returns" },
    { name: "Size Guide", href: "#size-guide" },
    { name: "FAQ", href: "#faq" },
    { name: "Track Your Order", href: "#tracking" },
  ],
  company: [
    { name: "About PKT Store", href: "#about" },
    { name: "Our Story", href: "#story" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
    { name: "Blog", href: "#blog" },
    { name: "Reviews", href: "#reviews" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Refund Policy", href: "#refunds" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/pktstorekh", color: "hover:text-blue-600" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/pkt_anime_store/", color: "hover:text-pink-600" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/Mengseu_Thoeng", color: "hover:text-blue-400" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@sokunpidorpisey7971", color: "hover:text-red-600" },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-rose-50 border-t border-pink-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-xl flex items-center justify-center shadow-md">
                  <Image
                    src="/images/pngkt.png"
                    alt="PKT Store"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  PKT Store
                </h3>
                <p className="text-sm text-gray-600">Your Anime Paradise</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover the ultimate collection of anime figures, manga, and plushies. We bring your favorite characters
              to life with authentic, high-quality merchandise.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-pink-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-pink-500" />
                <span className="text-sm">support@pktstore.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-sm">123 Anime Street, Los Angeles, CA</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-4 h-4 text-pink-500" />
                <span className="text-sm">Mon-Sat: 10AM-8PM, Sun: 12PM-6PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-pink-500" />
                Shop
              </h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-pink-200 bg-gradient-to-r from-pink-100 to-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-gray-800 mb-2">Stay Updated!</h4>
              <p className="text-sm text-gray-600">
                Get the latest news about new releases, exclusive deals, and anime updates.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-pink-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm"
              />
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-r-full font-medium transition-all duration-300 hover:shadow-lg text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
              {footerLinks.legal.map((link, index) => (
                <span key={link.name} className="flex items-center gap-6">
                  <a href={link.href} className="hover:text-pink-600 transition-colors duration-300">
                    {link.name}
                  </a>
                  {index < footerLinks.legal.length - 1 && <span className="text-pink-300">•</span>}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>© 2025 PKT Store. Made with</span>
              <Heart className="w-3 h-3 text-pink-500 fill-current" />
              <span>for anime fans</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
