"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRangeOpen, setPriceRangeOpen] = useState(true)
  const [colorOpen, setColorOpen] = useState(true)

  const categories = ["All Products", "Home & Kitchen", "Electronics", "Beauty", "Sports", "Toys"]

  // Mock products
  const productImages = [
    "/phone-stand.jpg", "/portable-phone-stand-holder.jpg", "/hand-chopper.jpg", "/kitchen-organizer.png",
    "/muffin-tray.jpg", "/bathroom-storage.jpg", "/car-bumper-guard.jpg", "/chair-leg-cover.jpg",
    "/food-storage-bag.jpg", "/gnat-trap.jpg", "/jewelry-box-organizer.jpg", "/magic-stick-toy.jpg",
    "/baby-knee-pad.jpg", "/bathroom-storage-organizer-box.jpg", "/chair-leg-protector-furniture-pad.jpg",
    "/gnat-trap-insect-catcher.jpg", "/hand-chopper-food-processor.jpg", "/muffin-tray-baking-pan.jpg",
    "/remote-holder-wall-mount.jpg", "/remote-sticker-hook-accessories.jpg", "/tumbling-monkey-toy.jpg",
    "/baby-knee-pad-crawling-protection.jpg", "/baby-knee-pad-products.jpg", "/hero-banner-for-online-shopping-mall.jpg"
  ]
  
  const allProducts = Array.from({ length: 24 }, (_, i) => ({
    id: `product-${i}`,
    name: `Product ${i + 1}`,
    price: 200 + (i * 17) % 400,
    originalPrice: 400 + (i * 23) % 500,
    image: productImages[i],
    category: categories[((i * 3) % (categories.length - 1)) + 1],
  }))

  const filteredProducts =
    selectedCategory === "all" ? allProducts : allProducts.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-0 lg:sticky lg:top-8">
              
              {/* Price Range */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setPriceRangeOpen(!priceRangeOpen)}
                  className="flex items-center justify-between w-full p-3 lg:p-4 font-medium hover:bg-gray-100"
                >
                  <span className="text-sm lg:text-base">Price Range</span>
                  <span className={`transform transition-transform ${priceRangeOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {priceRangeOpen && (
                  <div className="px-3 lg:px-4 pb-3 lg:pb-4">
                    <div className="text-center mb-3">
                      <span className="text-xs lg:text-sm font-medium">₹10 - ₹260</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: 'linear-gradient(to right, #14b8a6 0%, #14b8a6 30%, #e5e7eb 30%, #e5e7eb 100%)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>



              {/* Color */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setColorOpen(!colorOpen)}
                  className="flex items-center justify-between w-full p-3 lg:p-4 font-medium hover:bg-gray-100"
                >
                  <span className="text-sm lg:text-base">Color</span>
                  <span className={`transform transition-transform ${colorOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {colorOpen && (
                  <div className="px-3 lg:px-4 pb-3 lg:pb-4 space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-xs lg:text-sm">Black</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-xs lg:text-sm">White</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-xs lg:text-sm">Blue</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-xs lg:text-sm">Red</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">All Products</h1>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-3 lg:p-4">
                      <h3 className="text-xs lg:text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-3">
                        <span className="text-sm lg:text-lg font-bold" style={{color: 'lab(52.12% 47.1194 27.3658)'}}>₹{product.price}</span>
                        <span className="text-xs lg:text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      </div>
                      <Button className="w-full text-white text-xs lg:text-sm py-2 hover:opacity-90" style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}>Add to Cart</Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
