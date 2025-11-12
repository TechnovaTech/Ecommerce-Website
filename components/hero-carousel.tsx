"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Banner {
  _id: string
  title: string
  description: string
  image: string
  link: string
  active: boolean
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

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

  const next = () => {
    setCurrent((current + 1) % banners.length)
  }

  const prev = () => {
    setCurrent((current - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(next, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length, current])

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="h-96 md:h-[32rem] lg:h-[40rem] bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading banners...</p>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="h-96 md:h-[32rem] lg:h-[40rem] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No banners available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div className="h-96 md:h-[32rem] lg:h-[40rem] relative overflow-hidden">
        {banners.map((banner, index) => {
          const BannerContent = () => (
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={banner.image || "/placeholder.svg"} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
              {(banner.title || banner.description) && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    {banner.title && <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">{banner.title}</h1>}
                    {banner.description && <p className="text-base md:text-xl text-white/90">{banner.description}</p>}
                  </div>
                </div>
              )}
            </div>
          )

          return banner.link && banner.link.trim() ? (
            <a 
              key={banner._id} 
              href={banner.link} 
              className="cursor-pointer block"
              target={banner.link.startsWith('http') ? '_blank' : '_self'}
              rel={banner.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <BannerContent />
            </a>
          ) : (
            <div key={banner._id}>
              <BannerContent />
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-foreground rounded-full p-2 md:p-3 transition"
            suppressHydrationWarning
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-foreground rounded-full p-2 md:p-3 transition"
            suppressHydrationWarning
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition ${index === current ? "bg-white" : "bg-white/50"}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
