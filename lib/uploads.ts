import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function saveUpload(
  file: File,
  folder: string
): Promise<{ url: string; path: string }> {
  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Maximum size is 5MB.')
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF.')
  }

  const ext = path.extname(file.name) || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
  const dir = path.join(UPLOAD_DIR, folder)
  await mkdir(dir, { recursive: true })
  const filePath = path.join(dir, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  const url = `/uploads/${folder}/${filename}`
  return { url, path: filePath }
}

export function getUploadUrl(folder: string, filename: string): string {
  return `/uploads/${folder}/${filename}`
}
