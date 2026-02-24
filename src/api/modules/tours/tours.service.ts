/**
 * Tours API Service
 * Handles all tour-related API calls
 */

import { ApiResponse } from "@/api/types";
import { apiCache } from "@/lib/api-cache";
import { getGalleryImageUrl, getHeroImageUrl } from "@/lib/storage-urls";
import { supabase } from "@/lib/supabase";
import type { Tour, TourPreview } from "./tours.types";

/**
 * Get all tours (preview data for list views)
 * Fetches lightweight data optimized for list displays
 * OPTIMIZED: Cached for 10 seconds to prevent duplicate requests
 * @returns API response with array of tour previews
 */
export async function getToursPreview(): Promise<ApiResponse<TourPreview[]>> {
  return apiCache
    .get(
      "tours/preview",
      async () => {
        const { data, error } = await supabase
          .from("tours")
          .select(
            "id, title, short_desc, long_desc, hero_image, price, rating, duration, difficulty, group_size, tour_type, gallery_images, itinerary, specialities, included, requirements, featured, location, created_at",
          )
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to fetch tours");
        }

        // Transform Supabase response to match TourPreview interface
        const tours: TourPreview[] = (data || []).map((tour: any) =>
          transformTourToPreview(tour),
        );

        return tours;
      },
      { ttl: 10000 },
    )
    .then((tours) => ({
      success: true,
      message: "Tours fetched successfully",
      data: tours,
    }))
    .catch((error) => {
      console.error("Tours API error:", error);
      return {
        success: false,
        message: "Failed to fetch tours",
        error: "FETCH_ERROR",
        data: [],
      };
    });
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
        let parsed = specialty;
        if (typeof specialty === "string") {
          try {
            parsed = JSON.parse(specialty);
          } catch {
            parsed = { name: specialty, description: "", price: 0 };
          }
        }
        return {
          name: parsed.name || "N/A",
          description: parsed.description || "N/A",
          price: parsed.price || 0,
          icon: parsed.icon,
          isClimbing: parsed.isClimbing,
        };
      }),
      itinerary: (data.itinerary || []).filter(
        (item: any) => item && typeof item === "string",
      ),
      tourInclusions: (data.included || []).filter(
        (item: any) => item && typeof item === "string",
      ),
      keyRequirements: (data.requirements || []).filter(
        (item: any) => item && typeof item === "string",
      ),
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
        "id, title, short_desc, long_desc, hero_image, price, duration, difficulty, group_size, tour_type, itinerary, specialities, included, requirements, gallery_images, rating, location",
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
    console.log("Raw DB data:", {
      location: data.location,
      duration: data.duration,
      difficulty: data.difficulty,
    });

    // Transform Supabase response to match Tour interface
    const tour: Tour = {
      _id: data.id.toString(),
      title: data.title || "N/A",
      slug: {
        current: (data.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      },
      description: data.short_desc || "N/A",
      fullDescription: data.long_desc || "N/A",
      location: data.location || "N/A",
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
      galleryImages: (data.gallery_images || [])
        .map((fileName: string) => {
          try {
            return {
              asset: {
                url: fileName ? getGalleryImageUrl(fileName) : "",
              },
            };
          } catch (err) {
            console.warn(`Failed to process gallery image: ${fileName}`, err);
            return null;
          }
        })
        .filter((img: any) => img !== null),
      specialties: (data.specialities || [])
        .map((specialty: any) => {
          try {
            // Handle both plain strings and JSON strings
            if (typeof specialty === "string") {
              // Try to parse as JSON first
              try {
                const parsed = JSON.parse(specialty);
                return {
                  name: parsed.name || "N/A",
                  description: parsed.description || "N/A",
                  price: parsed.price || 0,
                  icon: parsed.icon,
                  isClimbing: parsed.isClimbing,
                };
              } catch {
                // If JSON parse fails, treat as plain string
                return {
                  name: specialty.trim(),
                  description: "N/A",
                  price: 0,
                };
              }
            }
            // If already an object (shouldn't happen, but handle it)
            return {
              name: specialty.name || "N/A",
              description: specialty.description || "N/A",
              price: specialty.price || 0,
              icon: specialty.icon,
              isClimbing: specialty.isClimbing,
            };
          } catch (err) {
            console.warn(`Failed to parse specialty:`, specialty);
            return null;
          }
        })
        .filter((spec: any) => spec !== null),
      itinerary: (data.itinerary || [])
        .map((day: any) => {
          if (typeof day === "string") {
            // Try to parse as JSON first (structured itineraries)
            try {
              const parsed = JSON.parse(day);
              return parsed.title || day.trim();
            } catch {
              // If not JSON, just return the string
              return day.trim();
            }
          }
          return null;
        })
        .filter((day: any) => day !== null),
      tourInclusions: (data.included || [])
        .map((inclusion: any) => {
          // Handle both plain strings and JSON strings
          if (typeof inclusion === "string") {
            // Try to parse as JSON first
            try {
              const parsed = JSON.parse(inclusion);
              return parsed.title || parsed;
            } catch {
              // If JSON parse fails, treat as plain string
              return inclusion.trim();
            }
          }
          return inclusion;
        })
        .filter((inc: any) => inc !== null),
      keyRequirements: (data.requirements || [])
        .map((requirement: any) => {
          // Handle both plain strings and JSON strings
          if (typeof requirement === "string") {
            // Try to parse as JSON first
            try {
              const parsed = JSON.parse(requirement);
              return parsed.title || parsed;
            } catch {
              // If JSON parse fails, treat as plain string
              return requirement.trim();
            }
          }
          return requirement;
        })
        .filter((req: any) => req !== null),
      rating: data.rating || 0,
    };

    console.log("Transformed tour:", {
      location: tour.location,
      duration: tour.duration,
      itinerary: tour.itinerary?.length,
      inclusions: tour.tourInclusions?.length,
      requirements: tour.keyRequirements?.length,
    });

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
  return apiCache
    .get(
      "tours/featured",
      async () => {
        const { data, error } = await supabase
          .from("tours")
          .select(
            "id, title, short_desc, long_desc, hero_image, price, rating, duration, difficulty, group_size, tour_type, gallery_images, itinerary, specialities, included, requirements, featured, location, created_at",
          )
          .eq("is_deleted", false)
          .eq("featured", true)
          .limit(6)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to fetch featured tours");
        }

        // Transform Supabase response to match TourPreview interface
        const tours: TourPreview[] = (data || []).map((tour: any) =>
          transformTourToPreview(tour),
        );

        return tours;
      },
      { ttl: 10000 },
    )
    .then((tours) => ({
      success: true,
      message: "Featured tours fetched successfully",
      data: tours,
    }))
    .catch((error) => {
      console.error("Tours API error:", error);
      return {
        success: false,
        message: "Failed to fetch featured tours",
        error: "FETCH_ERROR",
        data: [],
      };
    });
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
      itinerary: (tour.itinerary || []).filter(
        (day: any) => day && typeof day === "string",
      ),
      tourInclusions: (tour.included || []).filter(
        (inclusion: any) => inclusion && typeof inclusion === "string",
      ),
      keyRequirements: (tour.requirements || []).filter(
        (requirement: any) => requirement && typeof requirement === "string",
      ),
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

/**
 * Helper function to transform raw tour data to TourPreview format
 * @param tour - Raw tour data from Supabase
 * @returns Transformed TourPreview object
 */
function transformTourToPreview(tour: any): TourPreview {
  try {
    return {
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
      fullDescription: tour.long_desc || "N/A",
      location: tour.location || "N/A",
      duration: tour.duration || "N/A",
      difficulty: tour.difficulty || "N/A",
      tourType:
        (tour.tour_type as "standard" | "adventure" | "hiking" | "water") ||
        "standard",
      maxGroupSize: tour.group_size ? parseInt(tour.group_size.toString()) : 0,
      galleryImages: (Array.isArray(tour.gallery_images)
        ? tour.gallery_images
        : []
      )
        .map((img: string) => {
          try {
            return {
              asset: {
                url: getGalleryImageUrl(img),
              },
            };
          } catch (err) {
            console.warn(`Failed to process gallery image: ${img}`, err);
            return {
              asset: {
                url: "",
              },
            };
          }
        })
        .filter((img: any) => img.asset.url),
      specialties: Array.isArray(tour.specialities) ? tour.specialities : [],
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
      tourInclusions: Array.isArray(tour.included) ? tour.included : [],
      keyRequirements: Array.isArray(tour.requirements)
        ? tour.requirements
        : [],
    };
  } catch (err) {
    console.error(`Failed to transform tour:`, tour, err);
    return {
      _id: tour.id?.toString() || "unknown",
      title: tour.title || "Unknown Tour",
      slug: { current: "unknown" },
      description: "Tour data is corrupted",
      image: { asset: { url: "" } },
      rating: 0,
      basePrice: 0,
    };
  }
}
