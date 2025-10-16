"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Star,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/context/WishlistContext";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push('/');
  };

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
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block ml-8">
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
              <Link href="/wishlist">
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
              </Link>

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

              {/* User Account / Auth */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 group flex items-center gap-2 px-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-pink-100 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs opacity-90">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {user?.isAdmin && (
                          <>
                            <Link href="/admin" onClick={() => setShowUserMenu(false)}>
                              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
                                <LayoutDashboard className="w-5 h-5 text-pink-600" />
                                <span className="font-medium text-gray-700">Dashboard</span>
                              </button>
                            </Link>
                            <div className="border-t border-gray-200 my-2"></div>
                          </>
                        )}
                        
                        <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
                            <UserCircle className="w-5 h-5 text-pink-600" />
                            <span className="font-medium text-gray-700">My Profile</span>
                          </button>
                        </Link>

                        <Link href="/orders" onClick={() => setShowUserMenu(false)}>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
                            <Package className="w-5 h-5 text-pink-600" />
                            <span className="font-medium text-gray-700">My Orders</span>
                          </button>
                        </Link>

                        <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
                            <Settings className="w-5 h-5 text-pink-600" />
                            <span className="font-medium text-gray-700">Settings</span>
                          </button>
                        </Link>

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-600">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span className="hidden xl:inline">Login</span>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all duration-300">
                      <span className="hidden xl:inline">Sign Up</span>
                      <span className="xl:hidden">Join</span>
                    </Button>
                  </Link>
                </div>
              )}

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

            {/* Mobile Auth Section */}
            <div className="border-t border-pink-100 pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50">
                      <UserCircle className="w-5 h-5 mr-2" />
                      My Profile
                    </Button>
                  </Link>

                  <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50">
                      <Package className="w-5 h-5 mr-2" />
                      My Orders
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50">
                      <User className="w-5 h-5 mr-2" />
                      Login
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600">
                      <UserCircle className="w-5 h-5 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
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
