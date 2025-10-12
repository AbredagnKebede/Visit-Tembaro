import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const list = await prisma.newsArticle.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const data = list.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      excerpt: a.excerpt,
      image_url: a.imageUrl,
      category: a.category,
      author: a.author,
      publish_date: a.publishDate.toISOString(),
      featured: a.featured,
      created_at: a.createdAt.toISOString(),
      updated_at: a.updatedAt.toISOString(),
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
