"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

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

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          </div>
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

                    <Button 
                      className="w-full bg-primary hover:bg-accent text-primary-foreground text-xs md:text-sm mt-auto flex items-center gap-2 justify-center"
                      suppressHydrationWarning
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
