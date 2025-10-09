import { prisma } from '@/lib/db/prisma'
import type { ContactMessage } from '@/types/schema'

function toMessage(m: {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
}): ContactMessage {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    read: m.read,
    created_at: m.createdAt.toISOString(),
  }
}

export async function saveContactMessage(
  message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>
): Promise<string> {
  const m = await prisma.contactMessage.create({
    data: {
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    },
  })
  return m.id
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const list = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toMessage)
}

export async function getUnreadContactMessages(): Promise<ContactMessage[]> {
  const list = await prisma.contactMessage.findMany({
    where: { read: false },
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toMessage)
}

export async function markMessageAsRead(id: string): Promise<void> {
  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  })
}

export async function deleteContactMessage(id: string): Promise<void> {
  await prisma.contactMessage.delete({ where: { id } })
}

export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  const m = await prisma.contactMessage.findUnique({ where: { id } })
  return m ? toMessage(m) : null
}
