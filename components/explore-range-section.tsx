"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
}

interface PriceRange {
  price: string
  image: string
  link: string
  product?: Product
}

export default function ExploreRangeSection() {
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([
    { price: "9", image: "/baby-knee-pad.jpg", link: "/products?maxPrice=9" },
    { price: "29", image: "/muffin-tray.jpg", link: "/products?maxPrice=29" },
    { price: "49", image: "/gnat-trap.jpg", link: "/products?maxPrice=49" },
    { price: "149", image: "/magic-stick-toy.jpg", link: "/products?maxPrice=149" },
    { price: "249", image: "/kitchen-organizer.png", link: "/products?maxPrice=249" }
  ])

  useEffect(() => {
    fetchProductsForRanges()
  }, [])

  const fetchProductsForRanges = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const products: Product[] = await response.json()
        
        const updatedRanges = priceRanges.map((range, index) => {
          const maxPrice = parseInt(range.price)
          const minPrice = index === 0 ? 0 : parseInt(priceRanges[index - 1].price) + 1
          
          const productsInRange = products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
          )
          
          const productInRange = productsInRange.length > 0 
            ? productsInRange[Math.floor(Math.random() * productsInRange.length)]
            : undefined
          
          return {
            ...range,
            image: productInRange?.images[0] || range.image,
            product: productInRange
          }
        })
        
        setPriceRanges(updatedRanges)
      }
    } catch (error) {
      // Silently fail - use default images
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            Shop by <span className="text-4xl md:text-5xl font-bold text-red-700 mb-4 tracking-tight">Budget</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Find products within your price range
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="col-span-full flex justify-center mb-8">
            <div className="w-full bg-gradient-to-r from-yellow-700 to-yellow-800 h-4 rounded-full relative">
              {priceRanges.map((_, index) => (
                <div key={index} className="absolute top-0 w-2 h-6 bg-gray-400 rounded-full" style={{left: `${10 + index * 18}%`, transform: 'translateX(-50%)'}}></div>
              ))}
            </div>
          </div>
          {priceRanges.map((range, index) => (
            <Link key={index} href={range.link} className="group">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-red-700 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow h-32">
                  <div className="flex items-center gap-3 h-full">
                    <div className="text-white flex-shrink-0">
                      <div className="text-lg font-black">UNDER</div>
                      <div className="text-2xl font-black">₹{range.price}</div>
                    </div>
                    <div className="bg-white rounded-lg w-32 h-20 overflow-hidden flex-shrink-0 ml-auto">
                      <img 
                        src={range.image} 
                        alt={range.product?.name || `Under ₹${range.price}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}