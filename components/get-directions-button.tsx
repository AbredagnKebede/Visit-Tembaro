"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface GetDirectionsButtonProps {
  latitude: number;
  longitude: number;
  isFullWidth?: boolean;
}

export default function GetDirectionsButton({ latitude, longitude, isFullWidth = false }: GetDirectionsButtonProps) {
  const handleGetDirections = () => {
    if (typeof window !== 'undefined') {
      const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(mapUrl, "_blank", "noopener noreferrer");
    }
  };

  return (
    <Button
      className={`flex items-center ${isFullWidth ? "w-full" : ""}`}
      onClick={handleGetDirections}
    >
      <MapPin className="h-4 w-4 mr-2" />
      Get Directions
    </Button>
  );
} 