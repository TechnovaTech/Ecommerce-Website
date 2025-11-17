"use client"

import { useState, useEffect, useRef } from "react"

interface Banner {
  _id: string
  title: string
  description: string
  image: string
  link: string
  active: boolean
}

export default function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Default banners if none from API
  const defaultBanners = [
    {
      _id: '1',
      title: 'Banner 1',
      description: '',
      image: '/hero-banner-for-online-shopping-mall.jpg',
      link: '/products',
      active: true
    },
    {
      _id: '2', 
      title: 'Banner 2',
      description: '',
      image: '/shopping-promotion-banner.jpg',
      link: '/products',
      active: true
    },
    {
      _id: '3',
      title: 'Banner 3',
      description: '',
      image: '/shukan-mall-online-shopping-express-delivery.jpg',
      link: '/products',
      active: true
    }
  ]

  const displayBanners = banners.length > 0 ? banners : defaultBanners
  const duplicatedBanners = [...displayBanners, ...displayBanners]

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error('Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 1

    const animate = () => {
      scrollPosition += scrollSpeed
      
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => animationId = requestAnimationFrame(animate)

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [displayBanners])

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading banners...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full overflow-hidden bg-gray-50 pt-32 pb-4">
        <div 
          ref={scrollRef}
          className="flex gap-4 h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedBanners.map((banner, index) => (
            <div 
              key={`${banner._id}-${index}`}
              className="flex-shrink-0 w-96 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <img 
                src={banner.image || "/placeholder.svg"} 
                alt={banner.title || 'Banner'} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">10+ Happy Customer's</h3>
              <p className="text-gray-600">Delighted to have made our millions customer smile!</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Encrypt financial data to ensure secure payment</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lowest Price</h3>
              <p className="text-gray-600">Best quality product at best rates</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Top App Download</h3>
              <p className="text-gray-600">In top 30 for shopping app category</p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) 
}
