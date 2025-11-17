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
        // Filter active categories and ensure they have names
        const activeCategories = data.filter((cat: Category) => 
          cat.status === 'active' && cat.name && cat.name.trim() !== ''
        )
        setCategories(activeCategories)
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
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Shop By <span className="text-4xl md:text-5xl font-bold text-red-700 mb-4 tracking-tight">Categories</span>
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse our product categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-md p-4">
                <div className="bg-gray-200 rounded-xl aspect-square mb-4"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            Shop By <span className="text-4xl md:text-5xl font-bold text-red-700 mb-4 tracking-tight">Categories</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our product categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/category/${category.name}`} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4">
                <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-red-50 group-hover:to-red-100 transition-all duration-300">
                      <Package size={40} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-black text-center group-hover:text-red-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
