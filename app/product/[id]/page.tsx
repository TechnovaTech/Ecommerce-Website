"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
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
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id)
      const response = await fetch(`/api/products/${id}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Product data:', data)
        setProduct(data)
        fetchRelatedProducts(data.category)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string) => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        const related = data
          .filter((p: Product) => p.category === category && p._id !== id)
          .slice(0, 4)
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error)
    }
  }

  const addToCart = async () => {
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
          productId: product?._id,
          quantity: quantity
        })
      })

      if (response.ok) {
        toast({
          title: "🛍️ Added to Cart!",
          description: `Successfully added ${quantity} item(s) to your cart.`,
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

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "🔒 Login Required",
          description: "Please login to manage your wishlist.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      const method = isInWishlist ? 'DELETE' : 'POST'
      const response = await fetch('/api/wishlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product?._id
        })
      })

      if (response.ok) {
        setIsInWishlist(!isInWishlist)
        toast({
          title: isInWishlist ? "❤️ Removed from Wishlist" : "❤️ Added to Wishlist!",
          description: isInWishlist ? "Item removed from your wishlist." : "Item added to your wishlist successfully.",
          duration: 3000,
        })
      } else {
        toast({
          title: "❌ Wishlist Update Failed",
          description: "Failed to update wishlist. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Wishlist Update Failed",
        description: "An error occurred while updating wishlist. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const buyNow = async () => {
    await addToCart()
    // Redirect to cart or checkout
    window.location.href = '/cart'
  }

  const addToCartRelated = async (relatedProduct: Product) => {
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
          productId: relatedProduct._id,
          quantity: 1
        })
      })

      if (response.ok) {
        toast({
          title: "🛍️ Added to Cart!",
          description: `${relatedProduct.name} has been added to your cart.`,
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

  const addToWishlistRelated = async (relatedProduct: Product) => {
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
          productId: relatedProduct._id
        })
      })

      if (response.ok) {
        toast({
          title: "❤️ Added to Wishlist!",
          description: `${relatedProduct.name} has been added to your wishlist.`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                <div className="bg-gray-200 h-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/products" className="text-red-600 hover:underline">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto mt-12 px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Home</Link> &gt; 
          <Link href="/products" className="hover:text-red-600 ml-1">Products</Link> &gt; 
          <span className="ml-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="bg-white p-8 rounded-lg">
            <div className="relative mb-4">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full max-h-96 object-contain rounded-lg bg-gray-50"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.slice(0, 5).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setSelectedImage(i)}
                    className={`w-full h-16 object-contain rounded border-2 cursor-pointer hover:border-red-600 bg-gray-50 ${
                      selectedImage === i ? 'border-red-600' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            
            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
                    <span className="text-sm">/Pcs</span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{Math.round(product.price / (1 - product.discount / 100))}
                    </span>
                    <span className="text-lg font-bold text-red-600 ml-2">({product.discount}% Off)</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
                    <span className="text-sm">/Pcs</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">GST Applicable: 18%</p>
            </div>

            {/* Product Info */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <p className="text-sm"><strong>Category:</strong> {product.category}</p>
              <p className="text-sm"><strong>Stock:</strong> {product.stock} units</p>
              <p className="text-sm"><strong>Status:</strong> {product.status}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                  max={product.stock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </Button>
                <span className="text-sm text-gray-600">Max: {product.stock}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button 
                className="w-32 bg-primary hover:bg-accent text-primary-foreground text-sm py-2 flex items-center gap-2 justify-center"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={16} />
                Add To Cart
              </Button>
              <Button 
                className="w-32 bg-black hover:bg-gray-800 text-white text-sm py-2"
                onClick={buyNow}
                disabled={product.stock === 0}
              >
                ⚡ Buy Now
              </Button>
              <Button 
                variant="outline"
                className="px-4"
                onClick={toggleWishlist}
              >
                <Heart size={16} className={isInWishlist ? 'fill-red-500 text-red-500' : ''} />
              </Button>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>



        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} href={`/product/${relatedProduct._id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                      {relatedProduct.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {relatedProduct.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{relatedProduct.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{relatedProduct.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-red-600">₹{relatedProduct.price}</span>
                        {relatedProduct.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through ml-1">
                            ₹{Math.round(relatedProduct.price / (1 - relatedProduct.discount / 100))}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">Stock: {relatedProduct.stock}</div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-primary hover:bg-accent text-primary-foreground text-xs flex items-center gap-1 justify-center"
                          onClick={(e) => {
                            e.preventDefault()
                            addToCartRelated(relatedProduct)
                          }}
                        >
                          <ShoppingCart size={12} />
                          Cart
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="px-2"
                          onClick={(e) => {
                            e.preventDefault()
                            addToWishlistRelated(relatedProduct)
                          }}
                        >
                          <Heart size={12} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}