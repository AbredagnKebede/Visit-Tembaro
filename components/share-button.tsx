'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

export function ShareButton({ title, url: path }: { title: string; url: string }) {
  async function handleShare() {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
          text: title,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') copyToClipboard(fullUrl)
      }
    } else {
      copyToClipboard(fullUrl)
    }
  }

  function copyToClipboard(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  return (
    <Button variant="ghost" className="flex items-center" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  )
}
