"use server";

import { client } from "./client";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

// For list views (Landing Page, Explore All Tours)
export interface TourPreview {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image: {
    asset: {
      url: string;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  rating: number;
}

export interface Activity {
  time: string;
  activity: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Specialty {
  id?: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
}

// For detail view (complete tour data)
export interface Tour extends TourPreview {
  fullDescription: string;
  location: string;
  duration: string;
  difficulty: string;
  galleryImages?: Array<{
    asset: {
      url: string;
    };
  }>;
  specialties?: Specialty[];
  itinerary?: ItineraryDay[];
}

// ============================================================================
// OPTIMIZED QUERIES
// ============================================================================

/**
 * Get lightweight tour data for list views (Landing Page, Explore All Tours)
 * Fetches ~60% less data than full queries
 *
 * Uses: title, slug, image, description, rating
 */
export async function getToursPreview(): Promise<TourPreview[]> {
  const query = `*[_type == "tour"] {
    _id,
    title,
    slug,
    description,
    image {
      asset-> {
        url
      },
      hotspot
    },
    rating
  } | order(_createdAt desc)`;

  return client.fetch(query);
}

/**
 * Get full tour data for detail page
 * Fetches complete information for: hero, info cards, specialties, itinerary, gallery
 */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const query = `*[_type == "tour" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    fullDescription,
    location,
    image {
      asset-> {
        url
      },
      hotspot
    },
    galleryImages[] {
      asset-> {
        url
      }
    },
    rating,
    duration,
    difficulty,
    specialties,
    itinerary
  }`;

  return client.fetch(query, { slug });
}

/**
 * Get all tours with full data (legacy function - use getToursPreview for list views)
 */
export async function getTours(): Promise<Tour[]> {
  const query = `*[_type == "tour"] {
    _id,
    title,
    slug,
    description,
    fullDescription,
    location,
    image {
      asset-> {
        url
      },
      hotspot
    },
    galleryImages[] {
      asset-> {
        url
      }
    },
    rating,
    duration,
    difficulty,
    specialties,
    itinerary
  } | order(_createdAt desc)`;

  return client.fetch(query);
}
