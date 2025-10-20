import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const list = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const data = list.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: m.read,
      created_at: m.createdAt.toISOString(),
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
