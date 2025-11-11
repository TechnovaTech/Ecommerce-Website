"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
  discount: number
  description: string
  images: string[]
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [loading, setLoading] = useState(true)
  const [priceRangeOpen, setPriceRangeOpen] = useState(true)
  const [colorOpen, setColorOpen] = useState(true)
  const [priceRange, setPriceRange] = useState({ min: 10, max: 1000 })
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        const categoryNames = data.map((cat: any) => cat.name)
        setCategories(["All Products", ...categoryNames])
      }
    } catch (error) {
      console.error('Failed to fetch categories')
    }
  }

  const filteredProducts = products.filter((product) => {
    // Category filter
    const categoryMatch = selectedCategory === "All Products" || product.category === selectedCategory
    
    // Price filter
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max
    
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mt-12 mx-auto px-4 py-8 pt-24">
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
                      <span className="text-xs lg:text-sm font-medium">₹{priceRange.min} - ₹{priceRange.max}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600">Min Price</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="1000" 
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Max Price</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="1000" 
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
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
                    {['Black', 'White', 'Blue', 'Red'].map((color) => (
                      <label key={color} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={selectedColors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColors([...selectedColors, color])
                            } else {
                              setSelectedColors(selectedColors.filter(c => c !== color))
                            }
                          }}
                        />
                        <span className="text-xs lg:text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">All Products</h1>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {filteredProducts.map((product) => (
                  <Link key={product._id} href={`/product/${product._id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                      <div className="relative w-full h-48 bg-gray-100">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-3 lg:p-4">
                        <h3 className="text-xs lg:text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-3">
                          <span className="text-sm lg:text-lg font-bold text-red-600">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-xs lg:text-sm text-gray-400 line-through">
                              ₹{Math.round(product.price / (1 - product.discount / 100))}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Stock: {product.stock}</div>
                        <Button className="w-full bg-primary hover:bg-accent text-primary-foreground text-xs lg:text-sm py-2 flex items-center gap-2 justify-center" suppressHydrationWarning>
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
