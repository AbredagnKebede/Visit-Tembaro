import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const a = await prisma.attraction.findUnique({ where: { id } })
    if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({
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
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch attraction' }, { status: 500 })
  }
}
