import { prisma } from '@/lib/db/prisma'
import type { NewsArticle } from '@/types/schema'

function toArticle(a: {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl: string | null
  category: string
  author: string
  publishDate: Date
  featured: boolean
  createdAt: Date
  updatedAt: Date
}): NewsArticle {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    excerpt: a.excerpt,
    image_url: a.imageUrl ?? '',
    category: a.category,
    author: a.author,
    publish_date: a.publishDate.toISOString(),
    featured: a.featured,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }
}

export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  const list = await prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toArticle)
}

export async function getFeaturedNewsArticles(limitCount = 3): Promise<NewsArticle[]> {
  const list = await prisma.newsArticle.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: limitCount,
  })
  return list.map(toArticle)
}

export async function getLatestNewsArticles(limitCount = 3): Promise<NewsArticle[]> {
  const list = await prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
    take: limitCount,
  })
  return list.map(toArticle)
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  const a = await prisma.newsArticle.findUnique({ where: { id } })
  return a ? toArticle(a) : null
}

export async function getNewsArticlesByCategory(category: string): Promise<NewsArticle[]> {
  const list = await prisma.newsArticle.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toArticle)
}
