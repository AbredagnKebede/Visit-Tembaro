import { prisma } from '@/lib/db/prisma'
import type { CulturalItem } from '@/types/schema'

function toItem(a: {
  id: string
  title: string
  description: string
  imageUrl: string | null
  category: string
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}): CulturalItem {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    image_url: a.imageUrl ?? '',
    category: a.category,
    is_featured: a.isFeatured,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }
}

export async function getAllCulturalItems(): Promise<CulturalItem[]> {
  const list = await prisma.culturalItem.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toItem)
}

export async function getCulturalItemById(id: string): Promise<CulturalItem | null> {
  const a = await prisma.culturalItem.findUnique({ where: { id } })
  return a ? toItem(a) : null
}

export async function getFeaturedCulturalItems(limitCount = 4): Promise<CulturalItem[]> {
  const list = await prisma.culturalItem.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: limitCount,
  })
  return list.map(toItem)
}
