import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Visit Tembaro - Discover the Hidden Wonders of Southern Ethiopia",
  description:
    "Explore the natural attractions, cultural heritage, and rich traditions of Tembaro Special Wereda in Southern Ethiopia. Plan your visit to this hidden gem.",
  keywords: "Tembaro, Ethiopia, tourism, Southern Ethiopia, cultural heritage, natural attractions, travel",
  openGraph: {
    title: "Visit Tembaro - Discover the Hidden Wonders",
    description: "Explore the natural attractions and cultural heritage of Tembaro Special Wereda",
    images: ["/hero-image.jpg"],
  },
  metadataBase: new URL("http://localhost:3000"),
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
