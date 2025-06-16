'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getFeaturedAttractions } from '@/lib/services/attractions';
import { Attraction } from '@/types/schema';

export function FeaturedAttractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttractions() {
      try {
        const data = await getFeaturedAttractions(3);
        setAttractions(data);
      } catch (err) {
        console.error('Error loading attractions:', err);
        setError('Failed to load attractions');
      } finally {
        setLoading(false);
      }
    }

    loadAttractions();
  }, []);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Attractions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the most popular destinations in Tembaro that you shouldn't miss during your visit.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {loading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[200px] w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            attractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden">
                <div className="relative h-[200px] w-full">
                  <Image 
                    src={attraction.image_url || '/placeholder.jpg'} 
                    alt={attraction.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{attraction.name}</CardTitle>
                  <CardDescription>{attraction.location.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{attraction.short_description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/attractions/${attraction.id}`} className="w-full">
                    <Button className="w-full">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/attractions">
            <Button variant="outline" size="lg">View All Attractions</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
