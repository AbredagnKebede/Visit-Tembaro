import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getCulturalItemById, getFeaturedCulturalItems } from "@/lib/services/culture"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Share2, Calendar } from "lucide-react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const culturalItem = await getCulturalItemById(params.id)
  
  if (!culturalItem) {
    return {
      title: 'Cultural Item Not Found - Visit Tembaro',
    }
  }
  
  return {
    title: `${culturalItem.title} - Visit Tembaro`,
    description: culturalItem.description.substring(0, 160),
  }
}

export default async function CulturalItemPage({ params }: Props) {
  const culturalItem = await getCulturalItemById(params.id)
  
  if (!culturalItem) {
    notFound()
  }
  
  // Get related cultural items (excluding current one)
  const relatedItems = await getFeaturedCulturalItems(4)
  const filteredRelatedItems = relatedItems.filter(item => item.id !== params.id).slice(0, 3)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Cultural Item Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/culture" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Cultural Heritage
            </Link>
            
            <Badge className="mb-4">{culturalItem.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{culturalItem.title}</h1>
          </div>
          
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image 
              src={culturalItem.imageUrl || "/placeholder.svg"} 
              alt={culturalItem.title} 
              fill 
              className="object-cover" 
            />
          </div>
          
          <div className="prose prose-lg max-w-none mb-8">
            {culturalItem.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex justify-between items-center border-t border-b border-gray-200 py-4 my-8">
            <div className="text-sm text-gray-500">Share this cultural item</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                Plan Visit
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Related Cultural Items */}
      {filteredRelatedItems.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore More Cultural Heritage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelatedItems.map((relatedItem) => (
                <Card key={relatedItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image 
                      src={relatedItem.imageUrl || "/placeholder.svg"} 
                      alt={relatedItem.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {relatedItem.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{relatedItem.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedItem.description.substring(0, 120)}...
                    </p>
                    <Link
                      href={`/culture/${relatedItem.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn More
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