"use client"

import Link from "next/link"
import { Search, LogIn, ShoppingCart, User, ChevronDown, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import RealTimeNotifications from "./real-time-notifications"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false)

  const brandColor = "#d97706" // Converting lab color to hex equivalent

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch user data
      fetchUserData()
      fetchCartCount()
      fetchWishlistCount()
    }
    // Fetch categories and subcategories
    fetchCategories()
    fetchSubcategories()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const count = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartCount(count)
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  }

  const fetchWishlistCount = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setWishlistCount(data.items?.length || 0)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist count:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories')
      if (response.ok) {
        const data = await response.json()
        setSubcategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setShowProfileDropdown(false)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = brandColor
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = ""
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white text-center py-2 text-sm fixed top-0 left-0 right-0 z-50">
        Welcome to our online store !! Express delivery
      </div>

      {/* Main Header */}
      <div className="bg-white fixed top-6 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-center">
                <div className="text-xl font-bold" style={{color: brandColor}}>SHUKAN</div>
                <div className="text-sm" style={{color: brandColor}}>MALL</div>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex gap-6">
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-orange-600 transition-colors" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                Home
              </Link>
              {/* Products with Categories Dropdown */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  className="flex items-center gap-1 text-sm font-medium hover:text-orange-600 transition-colors"
                  suppressHydrationWarning
                >
                  Products
                  <ChevronDown size={14} />
                </button>
                
                {showCategoriesDropdown && (
                  <div 
                    className="absolute left-0 top-full mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                    onMouseLeave={() => setShowCategoriesDropdown(false)}
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <div key={category._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <Link 
                              href={`/category/${category.name}`}
                              className="flex items-center gap-3 text-sm font-semibold text-gray-900 hover:text-orange-600 mb-3"
                              onClick={() => setShowCategoriesDropdown(false)}
                            >
                              {category.image && (
                                <img src={category.image} alt={category.name} className="w-8 h-8 object-cover rounded-lg" />
                              )}
                              {category.name}
                            </Link>
                            <div className="space-y-2">
                              {subcategories
                                .filter(sub => sub.parentCategory === category.name)
                                .map(subcategory => (
                                  <Link 
                                    key={subcategory._id}
                                    href={`/products?subcategory=${encodeURIComponent(subcategory.name)}`}
                                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-600 block pl-2"
                                    onClick={() => setShowCategoriesDropdown(false)}
                                  >
                                    {subcategory.image && (
                                      <img src={subcategory.image} alt={subcategory.name} className="w-4 h-4 object-cover rounded" />
                                    )}
                                    {subcategory.name}
                                  </Link>
                                ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link 
                href="/category/E-Commerce-Product-Supplier" 
                className="text-sm font-medium hover:text-orange-600 transition-colors" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                E Commerce Product Supplier
              </Link>
              <Link 
                href="/category/China-Products" 
                className="text-sm font-medium hover:text-orange-600 transition-colors" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                China Products
              </Link>
            </nav>

            {/* Right Side - Search, Login, Cart */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 rounded-l-md border-orange-600"
                />
                <button className="text-white px-3 rounded-r-md bg-orange-600 hover:bg-orange-700 transition-colors" suppressHydrationWarning>
                  <Search size={16} />
                </button>
              </div>

              {/* Real-time Notifications */}
              <RealTimeNotifications />

              {/* Login/Profile */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 text-orange-600 hover:opacity-80 transition-opacity"
                    suppressHydrationWarning
                  >
                    <User size={18} />
                    <span className="text-sm font-semibold">{user.fullName || user.email}</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          My Orders
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          suppressHydrationWarning
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 text-orange-600 hover:opacity-80 transition-opacity"
                >
                  <LogIn size={18} />
                  <span className="text-sm font-semibold">Login</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <Heart size={22} className="text-orange-600 hover:opacity-80 transition-opacity" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <ShoppingCart size={22} className="text-orange-600 hover:opacity-80 transition-opacity" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
