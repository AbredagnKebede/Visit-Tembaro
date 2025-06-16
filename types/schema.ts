// Attraction Schema
export interface Attraction {
  id: string;
  name: string;
  description: string;
  short_description: string;
  image_url: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  category: string;
  difficulty: string;
  duration: string;
  accessibility: string;
  highlights: string[];
  best_time: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// News Article Schema
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  author: string;
  publish_date: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Gallery Item Schema
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Contact Message Schema
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Cultural Item Schema
export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
}