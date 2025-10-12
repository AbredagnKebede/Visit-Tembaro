import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const a = await prisma.galleryItem.findUnique({ where: { id } })
    if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({
      id: a.id,
      title: a.title,
      description: a.description,
      image_url: a.imageUrl,
      category: a.category,
      created_at: a.createdAt.toISOString(),
      updated_at: a.updatedAt.toISOString(),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
