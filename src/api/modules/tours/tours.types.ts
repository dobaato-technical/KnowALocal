/**
 * Tours module types
 */

export interface Activity {
  activity: string;
}

export interface ItineraryDay {
  title: string;
  activities: Activity[];
}

export interface Specialty {
  id?: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
  isClimbing?: boolean;
}

export interface Inclusion {
  title: string;
  description: string;
}

export interface SafetyWarning {
  title: string;
  description: string;
}

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
  basePrice?: number;
  fullDescription?: string;
  location?: string;
  duration?: string;
  difficulty?: string;
  tourType?: "standard" | "adventure" | "hiking" | "water";
  maxGroupSize?: number;
  galleryImages?: Array<{
    asset: {
      url: string;
    };
  }>;
  specialties?: any[];
  itinerary?: string[];
  tourInclusions?: string[];
  keyRequirements?: string[];
}

export interface Tour extends TourPreview {
  fullDescription: string;
  location?: string;
  duration: string;
  difficulty: string;
  tourType?: "standard" | "adventure" | "hiking" | "water";
  basePrice?: number;
  maxGroupSize?: number;
  tourNote?: string;
  galleryImages?: Array<{
    asset: {
      url: string;
    };
  }>;
  specialties?: any[];
  itinerary?: string[];
  tourInclusions?: string[];
  keyRequirements?: string[];
}

export interface CreateTourWithImagesInput {
  title: string;
  short_desc: string;
  long_desc: string;
  price: number;
  duration: string;
  difficulty: string;
  group_size: string;
  tour_type: string;
  location: string;
  heroImage?: File;
  galleryImages?: File[];
  itinerary?: string[];
  specialitites?: any[];
  included?: any[];
  requirements?: any[];
}

export interface UpdateTourWithImagesInput extends Partial<CreateTourWithImagesInput> {
  id: number;
  currentHeroImagePath?: string;
  currentGalleryImagePaths?: string[];
}
