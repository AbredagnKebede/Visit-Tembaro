import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllNewsArticles } from "@/lib/services/news"
import { FeaturedArticle } from "./featured-article"
import NewsList from "./news-list"

export default async function NewsPage() {
  const articles = await getAllNewsArticles()
  const featuredArticle = articles.find((article) => article.featured)
  const regularArticles = articles.filter(article => !article.featured)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-xl text-blue-100">Stay updated with the latest happenings in Tembaro</p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}

      {/* All Articles */}
      <NewsList initialArticles={regularArticles} />

      <Footer />
    </div>
  )
}
