import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function BannerSection() {
  const banners = [
    {
      id: 1,
      title: "Smile Baby Knee Pad",
      image: "/baby-knee-pad-crawling-protection.jpg",
      link: "/product/baby-knee-pad",
      subtitle: "Comfort & Protection",
    },
    {
      id: 2,
      title: "Remote Sticker Hook",
      image: "/remote-holder-wall-mount.jpg",
      link: "/product/remote-hook",
      subtitle: "Smart Organization",
    },
    {
      id: 3,
      title: "PU Big Jewellery Box",
      image: "/jewelry-box-organizer.jpg",
      link: "/product/jewelry-box",
      subtitle: "Elegant Storage",
    },
  ]

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {banners.map((banner) => (
            <Link key={banner.id} href={banner.link}>
              <Card className="overflow-hidden h-56 md:h-64 cursor-pointer group hover:shadow-lg transition duration-300 border-border">
                <div className="relative h-full">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-4">
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-1">{banner.subtitle}</p>
                    <h3 className="text-white font-bold text-sm md:text-base">{banner.title}</h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
