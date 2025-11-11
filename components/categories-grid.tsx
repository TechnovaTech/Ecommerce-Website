"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Package } from "lucide-react"

interface Category {
  _id: string
  name: string
  status: string
  image?: string
}

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.filter((cat: Category) => cat.status === 'active'))
      }
    } catch (error) {
      console.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-24 mb-3"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Shop by Categories
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover amazing products across our carefully curated categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {categories.map((category, index) => (
            <Link key={category._id} href={`/category/${category.name}`} className="group">
              <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-gray-100 hover:border-transparent overflow-hidden h-80">
                {/* Full Card Image Background */}
                <div className="absolute inset-0">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center">
                      <Package size={64} className="text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500"></div>
                
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {/* Category Name */}
                  <h3 className="font-bold text-white text-xl md:text-2xl mb-3 drop-shadow-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-300 group-hover:to-yellow-300 group-hover:bg-clip-text transition-all duration-500">
                    {category.name}
                  </h3>
                  
                  {/* Hover Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <div className="inline-flex items-center text-white font-semibold">
                      <span className="mr-2">Explore</span>
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Bottom Decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
