"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { getAllNewsArticles } from "@/lib/services/news"
import { NewsArticle } from "@/types/schema"
import { Skeleton } from "@/components/ui/skeleton"

const categories = ["All", "Events", "Tourism", "Community", "Culture", "Agriculture"]

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getAllNewsArticles()
        setArticles(data)
      } catch (err) {
        console.error('Error loading news articles:', err)
        setError('Failed to load news articles')
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  const featuredArticle = articles.find((article) => article.featured)
  const filteredArticles = selectedCategory === "All" 
    ? articles.filter(article => !article.featured)
    : articles.filter(article => !article.featured && article.category === selectedCategory)

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-10 text-red-500">{error}</div>
        <Footer />
      </div>
    )
  }

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
      {loading ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-10 w-48 mb-4" />
            </div>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <Skeleton className="h-64 lg:h-full" />
                <div className="p-8">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </Card>
          </div>
        </section>
      ) : featuredArticle ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Badge className="bg-red-600 hover:bg-red-700 mb-4">Featured</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
            </div>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredArticle.imageUrl || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <Badge variant="outline">{featuredArticle.category}</Badge>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(featuredArticle.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {featuredArticle.author}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredArticle.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
                  <Link
                    href={`/news/${featuredArticle.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      ) : null}

      {/* All Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image 
                      src={article.imageUrl || "/placeholder.svg"} 
                      alt={article.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    <Link
                      href={`/news/${article.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
