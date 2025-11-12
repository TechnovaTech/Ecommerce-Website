"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    images: string[]
    stock: number
    discount: number
  }
}

export default function WishlistPage() {
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setWishlistItems(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        fetchWishlist()
        toast({
          title: "✅ Removed from Wishlist",
          description: "Item has been removed from your wishlist.",
          duration: 3000,
        })
      } else {
        toast({
          title: "❌ Removal Failed",
          description: "Failed to remove item from wishlist. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Removal Failed",
        description: "An error occurred while removing the item. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      })

      if (response.ok) {
        toast({
          title: "🛍️ Added to Cart!",
          description: "Item has been successfully added to your cart.",
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-22 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-4">Save items you love for later</p>
            <Link href="/products">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <Card key={item.productId._id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.productId.images?.[0] || '/placeholder.svg'}
                    alt={item.productId.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link href={`/product/${item.productId._id}`}>
                      <h3 className="font-semibold mb-2 hover:text-teal-600">{item.productId.name}</h3>
                    </Link>
                    <p className="font-bold mb-1" style={{color: 'lab(52.12% 47.1194 27.3658)'}}>₹{item.productId.price}</p>
                    {item.productId.discount > 0 && (
                      <p className="text-sm text-gray-400 line-through mb-1">
                        ₹{Math.round(item.productId.price / (1 - item.productId.discount / 100))}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">Stock: {item.productId.stock}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="text-white" 
                      style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}
                      onClick={() => addToCart(item.productId._id)}
                      disabled={item.productId.stock === 0}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.productId._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}