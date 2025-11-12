"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface ProductSectionProps {
  title: string
  category: string
  link: string
}

export default function ProductSection({ title, category, link }: ProductSectionProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        let filteredProducts = data
        
        if (category === 'new-arrivals') {
          // Show latest 4 products (sorted by creation date)
          filteredProducts = data
            .sort((a: Product, b: Product) => 
              new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
            )
            .slice(0, 4)
        } else if (category === 'best-sellers') {
          // Show products with highest discount (most selling)
          filteredProducts = data
            .filter((product: Product) => product.discount > 0)
            .sort((a: Product, b: Product) => b.discount - a.discount)
            .slice(0, 4)
        }
        
        setProducts(filteredProducts)
      }
    } catch (error) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "🔒 Login Required",
          description: "Please login to add items to your cart.",
          variant: "destructive",
          duration: 3000,
        })
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
        toast({
          title: "🛍️ Added to Cart!",
          description: `${product.name} has been added to your cart.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "❌ Failed to Add",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Failed to Add",
        description: "An error occurred while adding to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const addToWishlist = async (product: Product) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "🔒 Login Required",
          description: "Please login to add items to your wishlist.",
          variant: "destructive",
          duration: 3000,
        })
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
        toast({
          title: "❤️ Added to Wishlist!",
          description: `${product.name} has been added to your wishlist.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "❌ Failed to Add",
          description: "Failed to add item to wishlist. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Failed to Add",
        description: "An error occurred while adding to wishlist. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            {title.split(' ').map((word, index) => (
              index === title.split(' ').length - 1 ? (
                <span key={index} className="text-4xl md:text-5xl font-bold text-red-700 mb-4 tracking-tight">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            ))}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {category === 'new-arrivals' ? 'Latest products just for you' : 'Most popular items'}
          </p>
        </div>
        <div className="flex justify-end mb-8">
          <Link href={link} className="text-primary hover:text-accent font-semibold text-sm md:text-base transition">
            See All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-xl hover:border-accent transition duration-300 h-full flex flex-col bg-card cursor-pointer" onClick={() => window.location.href = `/product/${product._id}`}>
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
                    {category === 'new-arrivals' && (
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
                        Cart
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
                        <Heart size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
