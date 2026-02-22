/**
 * Tours API
 * Handles all tour-related API calls
 */

import { getGalleryImageUrl, getHeroImageUrl } from "@/lib/storage-urls";
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

    console.log(`🔍 [getTourBySlug] Looking for tour with slug: "${slug}"`);

    // First, check what tours exist
    const { data: allTours, error: errorAll } = await supabase
      .from("tours")
      .select("id, title, is_deleted")
      .eq("is_deleted", false);

    if (allTours) {
      console.log(`📋 Available tours (${allTours.length}):`);
      allTours.forEach((t: any) => {
        console.log(`   - "${t.title}"`);
      });
    }

    // Now search for the specific tour
    const searchTerm = slug.replace(/-/g, " ");
    console.log(`🔎 Searching with term: "${searchTerm}"`);

    const { data, error } = await supabase
      .from("tours")
      .select(
        "id, title, short_desc, long_desc, hero_image, price, duration, difficulty, group_size, tour_type, itinerary, specialities, included, requirements, gallery_images, rating",
      )
      .eq("is_deleted", false)
      .ilike("title", searchTerm)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return {
        success: false,
        message: "Tour not found",
        error: "NOT_FOUND",
        data: null,
      };
    }

    if (!data) {
      console.error(`❌ No tour found for slug: ${slug}`);
      return {
        success: false,
        message: "Tour not found",
        error: "NOT_FOUND",
        data: null,
      };
    }

    console.log(`✅ Found tour: "${data.title}"`);

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
      specialties: (data.specialities || []).map((specialty: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof specialty === "string" ? JSON.parse(specialty) : specialty;
        return {
          name: parsed.name || "N/A",
          description: parsed.description || "N/A",
          price: parsed.price || 0,
          icon: parsed.icon,
          isClimbing: parsed.isClimbing,
        };
      }),
      itinerary: (data.itinerary || []).map((day: any) => {
        // Handle both stringified JSON and objects
        const parsed = typeof day === "string" ? JSON.parse(day) : day;
        return {
          title: parsed.title || "N/A",
          activities: (parsed.activities || []).map((activity: any) => ({
            activity: activity.activity || "N/A",
          })),
        };
      }),
      tourInclusions: (data.included || []).map((inclusion: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof inclusion === "string" ? JSON.parse(inclusion) : inclusion;
        return {
          title: parsed.title || "N/A",
          description: parsed.description || "N/A",
        };
      }),
      keyRequirements: (data.requirements || []).map((requirement: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof requirement === "string"
            ? JSON.parse(requirement)
            : requirement;
        return {
          title: parsed.title || "N/A",
          description: parsed.description || "N/A",
          severity: parsed.severity || "info",
          icon: parsed.icon,
        };
      }),
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
 * Get a single tour by ID
 * Fetches complete tour data using the tour ID
 * @param id - Tour ID from database
 * @returns API response with full tour data
 */
export async function getTourById(
  id: string | number,
): Promise<ApiResponse<Tour | null>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "Invalid ID provided",
        error: "INVALID_ID",
        data: null,
      };
    }

    console.log(`🔍 [getTourById] Looking for tour with ID: ${id}`);

    const { data, error } = await supabase
      .from("tours")
      .select(
        "id, title, short_desc, long_desc, hero_image, price, duration, difficulty, group_size, tour_type, itinerary, specialities, included, requirements, gallery_images, rating",
      )
      .eq("is_deleted", false)
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`❌ Tour not found with ID: ${id}`, error);
      return {
        success: false,
        message: "Tour not found",
        error: "NOT_FOUND",
        data: null,
      };
    }

    console.log(`✅ Found tour: "${data.title}"`);

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
      specialties: (data.specialities || []).map((specialty: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof specialty === "string" ? JSON.parse(specialty) : specialty;
        return {
          name: parsed.name || "N/A",
          description: parsed.description || "N/A",
          price: parsed.price || 0,
          icon: parsed.icon,
          isClimbing: parsed.isClimbing,
        };
      }),
      itinerary: (data.itinerary || []).map((day: any) => {
        // Handle both stringified JSON and objects
        const parsed = typeof day === "string" ? JSON.parse(day) : day;
        return {
          title: parsed.title || "N/A",
          activities: (parsed.activities || []).map((activity: any) => ({
            activity: activity.activity || "N/A",
          })),
        };
      }),
      tourInclusions: (data.included || []).map((inclusion: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof inclusion === "string" ? JSON.parse(inclusion) : inclusion;
        return {
          title: parsed.title || "N/A",
          description: parsed.description || "N/A",
        };
      }),
      keyRequirements: (data.requirements || []).map((requirement: any) => {
        // Handle both stringified JSON and objects
        const parsed =
          typeof requirement === "string"
            ? JSON.parse(requirement)
            : requirement;
        return {
          title: parsed.title || "N/A",
          description: parsed.description || "N/A",
          severity: parsed.severity || "info",
          icon: parsed.icon,
        };
      }),
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

/**
 * Delete a tour by setting is_deleted to true (soft delete)
 * @param tourId - Tour ID to delete
 * @returns API response with success status
 */
export async function deleteTour(tourId: string): Promise<ApiResponse<null>> {
  try {
    if (!tourId) {
      return {
        success: false,
        message: "Invalid tour ID",
        error: "INVALID_ID",
        data: null,
      };
    }

    const { error } = await supabase
      .from("tours")
      .update({ is_deleted: true })
      .eq("id", tourId);

    if (error) {
      console.error("Supabase error deleting tour:", error);
      return {
        success: false,
        message: "Failed to delete tour",
        error: "DELETE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Tour deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Tours API error:", error);
    return {
      success: false,
      message: "Failed to delete tour",
      error: "DELETE_ERROR",
      data: null,
    };
  }
}
