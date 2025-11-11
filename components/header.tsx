"use client"

import Link from "next/link"
import { Search, LogIn, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  const brandColor = "#d97706" // Converting lab color to hex equivalent

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
              <Link 
                href="/products" 
                className="text-sm font-medium hover:text-orange-600 transition-colors" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                Products
              </Link>
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

              {/* Login */}
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-orange-600 hover:opacity-80 transition-opacity"
              >
                <LogIn size={18} />
                <span className="text-sm font-semibold">Login</span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <ShoppingCart size={22} className="text-orange-600 hover:opacity-80 transition-opacity" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
