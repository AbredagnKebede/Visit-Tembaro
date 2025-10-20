const api = (path: string, options?: RequestInit) =>
  fetch(path, { ...options, credentials: 'include', headers: { ...options?.headers } })

export async function fetchContactMessages(): Promise<unknown> {
  const res = await api('/api/admin/contact')
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

export async function fetchNews(): Promise<unknown> {
  const res = await api('/api/news')
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}

export async function fetchAttractions(): Promise<unknown> {
  const res = await api('/api/attractions')
  if (!res.ok) throw new Error('Failed to fetch attractions')
  return res.json()
}

export async function fetchGallery(): Promise<unknown> {
  const res = await api('/api/gallery')
  if (!res.ok) throw new Error('Failed to fetch gallery')
  return res.json()
}

export async function fetchCultural(): Promise<unknown> {
  const res = await api('/api/cultural')
  if (!res.ok) throw new Error('Failed to fetch cultural items')
  return res.json()
}

export async function markMessageAsRead(id: string) {
  const res = await api(`/api/admin/contact/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) })
  if (!res.ok) throw new Error('Failed to mark as read')
}

export async function deleteContactMessage(id: string) {
  const res = await api(`/api/admin/contact/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete message')
}

export async function createNewsArticle(body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api('/api/admin/news', { method: 'POST', body: form })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error((e as { error?: string }).error || 'Failed to create article')
  }
  return res.json()
}

export async function updateNewsArticle(id: string, body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api(`/api/admin/news/${id}`, { method: 'PUT', body: form })
  if (!res.ok) throw new Error('Failed to update article')
  return res.json()
}

export async function deleteNewsArticle(id: string) {
  const res = await api(`/api/admin/news/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete article')
}

export async function createAttraction(body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api('/api/admin/attractions', { method: 'POST', body: form })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error((e as { error?: string }).error || 'Failed to create attraction')
  }
  return res.json()
}

export async function updateAttraction(id: string, body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api(`/api/admin/attractions/${id}`, { method: 'PUT', body: form })
  if (!res.ok) throw new Error('Failed to update attraction')
  return res.json()
}

export async function deleteAttraction(id: string) {
  const res = await api(`/api/admin/attractions/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete attraction')
}

export async function createGalleryItem(body: Record<string, unknown>, imageFile: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  form.set('image', imageFile)
  const res = await api('/api/admin/gallery', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to create gallery item')
  return res.json()
}

export async function updateGalleryItem(id: string, body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api(`/api/admin/gallery/${id}`, { method: 'PUT', body: form })
  if (!res.ok) throw new Error('Failed to update gallery item')
  return res.json()
}

export async function deleteGalleryItem(id: string) {
  const res = await api(`/api/admin/gallery/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete gallery item')
}

export async function createCulturalItem(body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api('/api/admin/cultural', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to create cultural item')
  return res.json()
}

export async function updateCulturalItem(id: string, body: Record<string, unknown>, imageFile?: File) {
  const form = new FormData()
  form.set('body', JSON.stringify(body))
  if (imageFile) form.set('image', imageFile)
  const res = await api(`/api/admin/cultural/${id}`, { method: 'PUT', body: form })
  if (!res.ok) throw new Error('Failed to update cultural item')
  return res.json()
}

export async function deleteCulturalItem(id: string) {
  const res = await api(`/api/admin/cultural/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete cultural item')
}
