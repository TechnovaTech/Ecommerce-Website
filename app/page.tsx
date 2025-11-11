import HeroCarousel from "@/components/hero-carousel"
import ProductSection from "@/components/product-section"
import BannerSection from "@/components/banner-section"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroCarousel />
        <ProductSection title="Best Deal Mobile and Computer Accessories" category="home-kitchen" link="/category/Home-Kitchen" />
        <BannerSection />
        <ProductSection title="Top Deals" category="top-deals" link="/deals" />
        <ProductSection title="Hot Selling" category="hot-selling" link="/hot-selling" />
      </main>
      <Footer />
    </>
  )
}