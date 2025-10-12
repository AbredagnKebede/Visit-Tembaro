import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const list = await prisma.attraction.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const data = list.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      short_description: a.shortDescription,
      image_url: a.imageUrl,
      location: a.location,
      category: a.category,
      difficulty: a.difficulty,
      duration: a.duration,
      accessibility: a.accessibility,
      highlights: a.highlights,
      best_time: a.bestTime,
      featured: a.featured,
      price: Number(a.price),
      created_at: a.createdAt.toISOString(),
      updated_at: a.updatedAt.toISOString(),
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch attractions' }, { status: 500 })
  }
}
