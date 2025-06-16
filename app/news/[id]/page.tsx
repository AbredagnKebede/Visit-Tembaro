import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getNewsArticleById, getLatestNewsArticles } from "@/lib/services/news"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const article = await getNewsArticleById(id)
  
  if (!article) {
    return {
      title: 'Article Not Found - Visit Tembaro',
    }
  }
  
  return {
    title: `${article.title} - Visit Tembaro`,
    description: article.excerpt,
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const article = await getNewsArticleById(id)
  
  if (!article) {
    notFound()
  }
  
  // Get related articles (excluding current one)
  const relatedArticles = await getLatestNewsArticles(4)
  const filteredRelatedArticles = relatedArticles.filter(item => item.id !== id).slice(0, 3)

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      // Split the date string by '-' to get year, month, and day components
      const [year, month, day] = dateString.split('-').map(Number);
      // Create a new Date object. Month is 0-indexed in JavaScript Date objects.
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Article Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/news" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to News
            </Link>
            
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publish_date)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </div>
            </div>
          </div>
          
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image 
              src={article.image_url || "/placeholder.svg"} 
              alt={article.title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>
          
          <div className="prose prose-lg max-w-none mb-8">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex justify-between items-center border-t border-b border-gray-200 py-4 my-8">
            <div className="text-sm text-gray-500">Share this article</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" variant="ghost">
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Related Articles */}
      {filteredRelatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image 
                      src={relatedArticle.image_url || "/placeholder.svg"} 
                      alt={relatedArticle.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {relatedArticle.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(relatedArticle.publish_date)}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{relatedArticle.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedArticle.excerpt}</p>
                    <Link
                      href={`/news/${relatedArticle.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  )
}