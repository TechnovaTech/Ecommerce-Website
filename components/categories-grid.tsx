import Link from "next/link"
import {
  ShoppingBag,
  Leaf,
  Smartphone,
  UtensilsCrossed,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  BookOpen,
  Palette,
  Hammer,
  Briefcase,
  Package,
} from "lucide-react"

const categories = [
  { name: "Health & Care", slug: "Health-Personal-Care", icon: ShoppingBag },
  { name: "Garden & Outdoor", slug: "Garden-Outdoor", icon: Leaf },
  { name: "Mobile & Computer", slug: "Mobile-Computer-Accessories", icon: Smartphone },
  { name: "Home & Kitchen", slug: "Home-Kitchen", icon: UtensilsCrossed },
  { name: "Toys & Games", slug: "Toys-Games", icon: Gamepad2 },
  { name: "Gym & Sports", slug: "Gym-Sports", icon: Dumbbell },
  { name: "Beauty", slug: "Beauty-Products", icon: Sparkles },
  { name: "Baby Products", slug: "Baby-Products", icon: Baby },
  { name: "Office & Stationery", slug: "Office-Stationery", icon: BookOpen },
  { name: "Cosmetics", slug: "Cosmetic-item", icon: Palette },
  { name: "Home Improvement", slug: "Home-Improvement", icon: Hammer },
  { name: "Bags", slug: "Bags", icon: Briefcase },
  { name: "Packing Materials", slug: "Packing-Materials", icon: Package },
]

export default function CategoriesGrid() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Shop by Categories</h2>
          <p className="text-muted-foreground">Explore our wide range of products across different categories</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.slug} href={`/category/${category.slug}`} className="text-center group">
                <div className="bg-gradient-to-br from-secondary via-white to-secondary rounded-2xl p-4 md:p-6 mb-3 flex items-center justify-center mx-auto aspect-square border border-border hover:shadow-lg hover:border-accent transition duration-300">
                  <IconComponent size={32} className="text-primary group-hover:text-accent transition duration-300" />
                </div>
                <p className="text-xs md:text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition">
                  {category.name}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
