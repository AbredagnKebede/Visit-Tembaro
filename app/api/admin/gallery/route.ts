import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { saveUpload } from '@/lib/uploads'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  category: z.string(),
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
    let imageUrl = p.image_url
    if (file && file.size > 0) {
      const { url } = await saveUpload(file, 'gallery')
      imageUrl = url
    }
    const a = await prisma.galleryItem.create({
      data: {
        title: p.title,
        description: p.description,
        imageUrl,
        category: p.category,
      },
    })
    return NextResponse.json({ id: a.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
