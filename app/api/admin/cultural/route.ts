import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { saveUpload } from '@/lib/uploads'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string(),
  description: z.string(),
  image_url: z.string().optional(),
  category: z.string(),
  is_featured: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const body = JSON.parse((formData.get('body') as string) || '{}')
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    let imageUrl = p.image_url || ''
    if (file && file.size > 0) {
      const { url } = await saveUpload(file, 'cultural')
      imageUrl = url
    }
    const a = await prisma.culturalItem.create({
      data: {
        title: p.title,
        description: p.description,
        imageUrl: imageUrl || null,
        category: p.category,
        isFeatured: p.is_featured ?? false,
      },
    })
    return NextResponse.json({ id: a.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create cultural item' }, { status: 500 })
  }
}
