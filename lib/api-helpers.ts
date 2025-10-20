import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}

export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
    out[key] = v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)
      ? toSnakeCase(v as Record<string, unknown>)
      : v
  }
  return out
}
