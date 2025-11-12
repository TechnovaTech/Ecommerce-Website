"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"

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
  createdAt?: string
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [loading, setLoading] = useState(true)
  const [priceRangeOpen, setPriceRangeOpen] = useState(true)
  const [colorOpen, setColorOpen] = useState(true)
  const [minPrice, setMinPrice] = useState(0)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [availabilityOpen, setAvailabilityOpen] = useState(true)
  const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set())
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  const { updateCartCount } = useCart()
  const { updateWishlistCount, isInWishlist, addToWishlistLocal } = useWishlist()

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
    const categoryMatch = selectedCategory === "All Products" || product.category === selectedCategory
    const priceMatch = product.price >= minPrice
    return categoryMatch && priceMatch
  })

  const getFilteredProducts = () => {
    if (filter === 'new-arrivals') {
      return products
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .filter(product => product.price >= minPrice)
    } else if (filter === 'best-sellers') {
      return products
        .filter(product => product.discount > 0)
        .sort((a, b) => b.discount - a.discount)
        .filter(product => product.price >= minPrice)
    }
    return filteredProducts
  }

  const displayProducts = getFilteredProducts()

  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      })

      if (response.ok) {
        updateCartCount()
      }
    } catch (error) {
      console.error('Failed to add to cart')
    }
  }

  const addToWishlist = async (product: Product) => {
    // Immediate UI update
    setLocalWishlist(prev => new Set([...prev, product._id]))
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id
        })
      })

      if (response.ok) {
        addToWishlistLocal(product._id)
        updateWishlistCount()
      }
    } catch (error) {
      console.error('Failed to add to wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mt-12 mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border lg:sticky lg:top-8">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Filters</h3>
              </div>
              


              {/* Price Range */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setPriceRangeOpen(!priceRangeOpen)}
                  className="flex items-center justify-between w-full p-4 font-medium hover:bg-gray-50"
                >
                  <span>Price Range</span>
                  <span className={`transform transition-transform ${priceRangeOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {priceRangeOpen && (
                  <div className="px-4 pb-4">
                    <div className="text-center mb-3">
                      <span className="text-sm font-medium text-red-600">Min Price: ₹{minPrice}</span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Minimum Price: ₹{minPrice}</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100000" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setAvailabilityOpen(!availabilityOpen)}
                  className="flex items-center justify-between w-full p-4 font-medium hover:bg-gray-50"
                >
                  <span>Availability</span>
                  <span className={`transform transition-transform ${availabilityOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {availabilityOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 text-red-600" />
                      <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 text-red-600" />
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <div className="p-4">
                <button
                  onClick={() => {
                    setSelectedCategory("All Products")
                    setMinPrice(0)
                    setSelectedColors([])
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">
              {filter === 'new-arrivals' ? 'New Arrivals' : 
               filter === 'best-sellers' ? 'Best Sellers' : 
               'All Products'}
            </h1>

            {/* Category Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  Showing {displayProducts.length} of {products.length} products
                  {selectedCategory !== "All Products" && ` in "${selectedCategory}"`}
                </p>
              </div>
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
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
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {displayProducts.map((product) => (
                  <Link key={product._id} href={`/product/${product._id}`}>
                    <Card className="overflow-hidden hover:shadow-xl hover:border-accent transition duration-300 h-full flex flex-col bg-card">
                      <div className="relative w-full h-48 bg-secondary overflow-hidden group">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </div>
                        )}
                        {filter === 'new-arrivals' && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </div>
                        )}
                      </div>
                      <div className="p-3 md:p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base md:text-lg font-bold text-primary">₹{product.price}</span>
                          {product.discount > 0 && (
                            <span className="text-xs md:text-sm text-muted-foreground line-through">
                              ₹{Math.round(product.price / (1 - product.discount / 100))}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">Stock: {product.stock}</div>
                        <div className="flex gap-2 mt-auto">
                          <Button 
                            className="flex-1 bg-primary hover:bg-accent text-primary-foreground text-xs md:text-sm flex items-center gap-1 justify-center"
                            onClick={(e) => {
                              e.preventDefault()
                              addToCart(product)
                            }}
                          >
                            <ShoppingCart size={14} />
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="px-2"
                            onClick={(e) => {
                              e.preventDefault()
                              addToWishlist(product)
                            }}
                          >
                            <Heart 
                              size={14} 
                              className={(isInWishlist(product._id) || localWishlist.has(product._id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                            />
                          </Button>
                        </div>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mt-12 mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded mb-4"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
