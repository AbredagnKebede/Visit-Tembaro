'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedCulturalItems } from "@/lib/services/cultural";
import { CulturalItem } from "@/types/schema";

export function CulturalHighlights() {
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCulturalItems() {
      try {
        const data = await getFeaturedCulturalItems(4);
        setCulturalItems(data);
      } catch (err) {
        console.error('Error loading cultural items:', err);
        setError('Failed to load cultural items');
      } finally {
        setLoading(false);
      }
    }

    loadCulturalItems();
  }, []);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Cultural Heritage</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most significant cultural treasures of the Tembaro people
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : culturalItems.length > 0 ? (
            culturalItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image 
                    src={item.image_url || "/placeholder.svg"} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-4 text-center py-10">
              <p className="text-gray-500">No featured cultural items available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 