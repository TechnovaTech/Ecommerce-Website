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
              <div className="">
                <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                      <Package size={32} className="text-gray-400 group-hover:text-red-500" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-black text-center group-hover:text-red-600 group-hover:underline group-hover:underline-offset-2 transition-all duration-300 ease-out">
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
