"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { NewsArticle } from "@/types/schema"

interface FeaturedArticleProps {
  article: NewsArticle
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
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
                src={article.image_url || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h3>
              <p className="text-gray-600 mb-6">{article.excerpt}</p>
              <Link
                href={`/news/${article.id}`}
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
  )
} 