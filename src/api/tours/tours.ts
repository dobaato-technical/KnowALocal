/**
 * Tours API
 * Handles all tour-related API calls
 */

import { getHeroImageUrl } from "@/lib/storage-urls";
import { supabase } from "@/lib/supabase";
import { ApiResponse, Tour, TourPreview } from "../types";

// Re-export types for convenience
export type { ApiResponse, Tour, TourPreview };

/**
 * Get all tours (preview data for list views)
 * Fetches lightweight data optimized for list displays
 * @returns API response with array of tour previews
 */
export async function getToursPreview(): Promise<ApiResponse<TourPreview[]>> {
  try {
    const { data, error } = await supabase
      .from("tours")
      .select("id, title, short_desc, hero_image, price, rating")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch tours",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    // Transform Supabase response to match TourPreview interface
    const tours: TourPreview[] = (data || []).map((tour: any) => ({
      _id: tour.id.toString(),
      title: tour.title || "N/A",
      slug: {
        current: (tour.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      },
      description: tour.short_desc || "N/A",
      image: {
        asset: {
          url: tour.hero_image ? getHeroImageUrl(tour.hero_image) : "",
        },
      },
      rating: tour.rating || 0,
      basePrice: tour.price || 0,
    }));

    return {
      success: true,
      message: "Tours fetched successfully",
      data: tours,
    };
  } catch (error) {
    console.error("Tours API error:", error);
    return {
      success: false,
      message: "Failed to fetch tours",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Get a single tour by slug
 * Fetches complete tour data including itinerary, gallery, specialties
 * @param slug - Tour slug (from URL)
 * @returns API response with full tour data
 */
export async function getTourBySlug(
  slug: string,
): Promise<ApiResponse<Tour | null>> {
  try {
    if (!slug || typeof slug !== "string") {
      return {
        success: false,
        message: "Invalid slug provided",
        error: "INVALID_SLUG",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from("tours")
      .select(
        "id, title, short_desc, long_desc, hero_image, price, duration, difficulty, group_size, tour_type, itinerary, specialities, included, requirements, gallery_images, rating",
      )
      .eq("is_deleted", false)
      .ilike("title", slug.replace(/-/g, " "))
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Tour not found",
        error: "NOT_FOUND",
        data: null,
      };
    }

    // Transform Supabase response to match Tour interface
    const tour: Tour = {
      _id: data.id.toString(),
      title: data.title || "N/A",
      slug: {
        current: (data.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      },
      description: data.short_desc || "N/A",
      fullDescription: data.long_desc || "N/A",
      image: {
        asset: {
          url: data.hero_image ? getHeroImageUrl(data.hero_image) : "",
        },
      },
      duration: data.duration || "N/A",
      difficulty: data.difficulty || "N/A",
      tourType: (data.tour_type as any) || "N/A",
      basePrice: data.price || 0,
      maxGroupSize: data.group_size ? parseInt(data.group_size) : undefined,
      galleryImages: (data.gallery_images || []).map((fileName: string) => ({
        asset: {
          url: fileName ? getGalleryImageUrl(fileName) : "",
        },
      })),
      specialties: (data.specialities || []).map((specialty: any) => ({
        id: specialty.id,
        name: specialty.name || "N/A",
        description: specialty.description || "N/A",
        price: specialty.price || 0,
        icon: specialty.icon,
        isClimbing: specialty.isClimbing,
      })),
      itinerary: (data.itinerary || []).map((day: any) => ({
        title: day.title || "N/A",
        activities: (day.activities || []).map((activity: any) => ({
          activity: activity.activity || "N/A",
        })),
      })),
      tourInclusions: (data.included || []).map((inclusion: any) => ({
        title: inclusion.title || "N/A",
        description: inclusion.description || "N/A",
      })),
      keyRequirements: (data.requirements || []).map((requirement: any) => ({
        title: requirement.title || "N/A",
        description: requirement.description || "N/A",
        severity: requirement.severity || "info",
        icon: requirement.icon,
      })),
      rating: data.rating || 0,
    };

    return {
      success: true,
      message: "Tour fetched successfully",
      data: tour,
    };
  } catch (error) {
    console.error("Tours API error:", error);
    return {
      success: false,
      message: "Failed to fetch tour",
      error: "FETCH_ERROR",
      data: null,
    };
  }
}

/**
 * Get featured tours for homepage
 * @returns API response with array of featured tours
 */
export async function getFeaturedTours(): Promise<ApiResponse<TourPreview[]>> {
  try {
    const { data, error } = await supabase
      .from("tours")
      .select("id, title, short_desc, hero_image, price, rating")
      .eq("is_deleted", false)
      .limit(6) // Top 6 tours for homepage
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch featured tours",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    // Transform Supabase response to match TourPreview interface
    const tours: TourPreview[] = (data || []).map((tour: any) => ({
      _id: tour.id.toString(),
      title: tour.title || "N/A",
      slug: {
        current: (tour.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      },
      description: tour.short_desc || "N/A",
      image: {
        asset: {
          url: tour.hero_image ? getHeroImageUrl(tour.hero_image) : "",
        },
      },
      rating: tour.rating || 0,
      basePrice: tour.price || 0,
    }));

    return {
      success: true,
      message: "Featured tours fetched successfully",
      data: tours,
    };
  } catch (error) {
    console.error("Tours API error:", error);
    return {
      success: false,
      message: "Failed to fetch featured tours",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Get all tours with complete data
 * Note: Use getToursPreview() for list views - this is for when you need all tour details
 * @returns API response with array of full tours
 */
export async function getAllTours(): Promise<ApiResponse<Tour[]>> {
  try {
    const { data, error } = await supabase
      .from("tours")
      .select(
        "id, title, short_desc, long_desc, hero_image, price, duration, difficulty, group_size, tour_type, itinerary, specialities, included, requirements, gallery_images, rating",
      )
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch tours",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    // Transform Supabase response to match Tour interface
    const tours: Tour[] = (data || []).map((tour: any) => ({
      _id: tour.id.toString(),
      title: tour.title || "N/A",
      slug: {
        current: (tour.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      },
      description: tour.short_desc || "N/A",
      fullDescription: tour.long_desc || "N/A",
      image: {
        asset: {
          url: tour.hero_image ? getHeroImageUrl(tour.hero_image) : "",
        },
      },
      duration: tour.duration || "N/A",
      difficulty: tour.difficulty || "N/A",
      tourType: (tour.tour_type as any) || "N/A",
      basePrice: tour.price || 0,
      maxGroupSize: tour.group_size ? parseInt(tour.group_size) : undefined,
      galleryImages: (tour.gallery_images || []).map((fileName: string) => ({
        asset: {
          url: fileName
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/know-a-local/gallery/${fileName}`
            : "",
        },
      })),
      specialties: (tour.specialities || []).map((specialty: any) => ({
        id: specialty.id,
        name: specialty.name || "N/A",
        description: specialty.description || "N/A",
        price: specialty.price || 0,
        icon: specialty.icon,
        isClimbing: specialty.isClimbing,
      })),
      itinerary: (tour.itinerary || []).map((day: any) => ({
        title: day.title || "N/A",
        activities: (day.activities || []).map((activity: any) => ({
          activity: activity.activity || "N/A",
        })),
      })),
      tourInclusions: (tour.included || []).map((inclusion: any) => ({
        title: inclusion.title || "N/A",
        description: inclusion.description || "N/A",
      })),
      keyRequirements: (tour.requirements || []).map((requirement: any) => ({
        title: requirement.title || "N/A",
        description: requirement.description || "N/A",
        severity: requirement.severity || "info",
        icon: requirement.icon,
      })),
      rating: tour.rating || 0,
    }));

    return {
      success: true,
      message: "All tours fetched successfully",
      data: tours,
    };
  } catch (error) {
    console.error("Tours API error:", error);
    return {
      success: false,
      message: "Failed to fetch tours",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}
