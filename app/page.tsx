import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { FeaturedAttractions } from "@/components/featured-attractions"
import { CulturalHighlights } from "@/components/cultural-highlights"
import { LatestNews } from "@/components/latest-news"
import { CallToAction } from "@/components/call-to-action"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedAttractions />
      <CulturalHighlights />
      <LatestNews />
      <CallToAction />
      <Footer />
    </div>
  )
}
