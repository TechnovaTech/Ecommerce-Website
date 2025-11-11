"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Header from "@/components/header"

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
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

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
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
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
                className="w-full h-96 object-cover rounded-lg"
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
                    className={`w-full h-16 object-cover rounded border-2 cursor-pointer hover:border-red-600 ${
                      selectedImage === i ? 'border-red-600' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
                <span className="text-sm">/Pcs</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100))}
                    </span>
                    <span className="text-lg font-bold text-red-600">({product.discount}% Off)</span>
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

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white py-3">
                🛒 Add To Cart
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white py-3">
                ⚡ Buy Now
              </Button>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="font-bold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>



        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
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
                          <span className="text-sm text-gray-400 line-through">
                            ₹{Math.round(relatedProduct.price / (1 - relatedProduct.discount / 100))}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">Stock: {relatedProduct.stock}</div>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm" suppressHydrationWarning>
                        Add To Cart
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}