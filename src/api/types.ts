/**
 * Common API types and interfaces
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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

export interface Requirement {
  title: string;
  description: string;
  severity?: "info" | "warning" | "critical";
  icon?: string;
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
}

export interface Tour extends TourPreview {
  fullDescription: string;
  location?: string; // Optional - not currently in Supabase table
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
  specialties?: Specialty[];
  itinerary?: ItineraryDay[];
  tourInclusions?: Inclusion[];
  keyRequirements?: SafetyWarning[];
}
