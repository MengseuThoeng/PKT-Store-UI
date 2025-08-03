"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Star,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";

const navItems = [
  {
    name: "Figures",
    href: "/figures",
    // hasDropdown: false,
    // dropdownItems: [
    //   { name: "Action Figures", href: "#action-figures" },
    //   { name: "Scale Figures", href: "#scale-figures" },
    //   { name: "Nendoroids", href: "#nendoroids" },
    //   { name: "Limited Edition", href: "#limited" },
    // ],
  },
  { name: "Manga", href: "/manga" },
  { name: "Plushies", href: "/plushies" },
  { name: "About Us", href: "/about" },
  // { name: "Contact Us", href: "/contact-us" },
  { name: "New Releases", href: "#new", isSpecial: true },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const pathname = usePathname();

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-center py-2 text-sm font-medium text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="flex items-center justify-center gap-2 relative z-10">
          <Star className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
          <span>Free shipping on orders over $50! New arrivals weekly ✨</span>
          <Star className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-pink-100/50 border-b border-pink-100"
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl shadow-md group-hover:shadow-lg">
                  <Link href={"/"} className="flex items-center gap-2">
                    <Image
                      src="/images/pngkt.png"
                      alt="PKT Store Logo"
                      width={40}
                      height={40}
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                  </Link>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs">✨</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <div key={item.name} className="relative group">
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={`px-4 py-2 h-auto font-medium transition-all duration-300 hover:scale-105 ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                            : item.isSpecial
                            ? "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200 shadow-sm"
                            : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {item.name}

                          {item.isSpecial && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                              !
                            </span>
                          )}
                        </span>
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime figures, manga..."
                  className="w-full pl-10 pr-4 py-2.5 border border-pink-200 rounded-full bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 group-hover:shadow-md text-sm"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-pink-400 group-hover:text-pink-600 transition-colors" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 group"
              >
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 group"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-pink-600 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-xl border-t border-pink-100">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime figures, manga..."
                className="w-full pl-10 pr-4 py-2.5 border border-pink-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
            </div>

            {/* Mobile Navigation Items */}
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2 h-auto font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      : item.isSpecial
                      ? "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700"
                      : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  }`}
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${index * 50}ms both`,
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.isSpecial && <span className="ml-2">🔥</span>}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
