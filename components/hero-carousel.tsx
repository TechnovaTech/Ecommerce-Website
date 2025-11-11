"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/hero-banner-for-online-shopping-mall.jpg",
    title: "Welcome to Shukan Mall",
    description: "Best Deals Online - Express Delivery",
  },
  {
    image: "/shopping-promotion-banner.jpg",
    title: "Exclusive Offers",
    description: "Up to 70% Off on Selected Items",
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((current + 1) % slides.length)
  }

  const prev = () => {
    setCurrent((current - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div className="h-96 md:h-[32rem] lg:h-[40rem] relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">{slide.title}</h1>
                <p className="text-base md:text-xl text-white/90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-foreground rounded-full p-2 md:p-3 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-foreground rounded-full p-2 md:p-3 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition ${index === current ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
