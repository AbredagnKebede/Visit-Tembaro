import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { saveUpload } from '@/lib/uploads'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  category: z.string().optional(),
  is_featured: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const body = JSON.parse((formData.get('body') as string) || '{}')
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    let imageUrl: string | null | undefined = p.image_url
    if (file && file.size > 0) {
      const { url } = await saveUpload(file, 'cultural')
      imageUrl = url
    }
    await prisma.culturalItem.update({
      where: { id },
      data: {
        ...(p.title != null && { title: p.title }),
        ...(p.description != null && { description: p.description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(p.category != null && { category: p.category }),
        ...(p.is_featured != null && { isFeatured: p.is_featured }),
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update cultural item' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    await prisma.culturalItem.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete cultural item' }, { status: 500 })
  }
}
