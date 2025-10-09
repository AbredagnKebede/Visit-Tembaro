import { prisma } from '@/lib/db/prisma'
import type { GalleryItem } from '@/types/schema'

function toItem(a: {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: Date
  updatedAt: Date
}): GalleryItem {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    image_url: a.imageUrl,
    category: a.category,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const list = await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toItem)
}
