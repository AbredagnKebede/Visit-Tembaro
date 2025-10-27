export const dynamic = 'force-dynamic'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { FeaturedAttractions } from "@/components/featured-attractions"
import { CulturalHighlights } from "@/components/cultural-highlights"
import { LatestNews } from "@/components/latest-news"
import { CallToAction } from "@/components/call-to-action"
import { getFeaturedAttractions } from "@/lib/services/attractions"

export default async function HomePage() {
  const featuredAttractions = await getFeaturedAttractions(3)
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedAttractions initialAttractions={featuredAttractions} />
      <CulturalHighlights />
      <LatestNews />
      <CallToAction />
      <Footer />
    </div>
  )
}
