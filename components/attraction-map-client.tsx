"use client"

import dynamic from "next/dynamic"

// Dynamically import the map component with no SSR to avoid hydration issues
const AttractionMap = dynamic(() => import("@/components/attraction-map"), { ssr: false })

interface AttractionMapClientProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function AttractionMapClient({ latitude, longitude, name }: AttractionMapClientProps) {
  return (
    <AttractionMap
      latitude={latitude}
      longitude={longitude}
      name={name}
    />
  )
} 