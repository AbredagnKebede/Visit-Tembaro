'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type AttractionMapProps = {
  latitude: number
  longitude: number
  name: string
}

export default function AttractionMap({ latitude, longitude, name }: AttractionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView([latitude, longitude], 13)
      
      // Add the OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      
      // Add a marker for the attraction
      const marker = L.marker([latitude, longitude]).addTo(map)
      marker.bindPopup(`<b>${name}</b>`).openPopup()
      
      // Clean up on unmount
      return () => {
        map.remove()
      }
    }
  }, [latitude, longitude, name])
  
  return <div ref={mapRef} className="h-full w-full" />
}