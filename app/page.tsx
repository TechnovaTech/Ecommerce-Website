import HeroCarousel from "@/components/hero-carousel"
import ProductSection from "@/components/product-section"
import BannerSection from "@/components/banner-section"
import CategoriesGrid from "@/components/categories-grid"
import ExploreRangeSection from "@/components/explore-range-section"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroCarousel />
        <CategoriesGrid />
        {/* <BannerSection /> */}
        <ProductSection title="New Arrivals" category="new-arrivals" link="/products?filter=new-arrivals" />
        <ExploreRangeSection />
        <ProductSection title="Best Sellers" category="best-sellers" link="/products?filter=best-sellers" />
      </main>
      <Footer />
    </>
  )
}