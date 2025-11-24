import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@visit-tembaro.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log('Admin user already exists:', adminEmail)
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Created admin user:', adminEmail)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
