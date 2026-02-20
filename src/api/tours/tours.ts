/**
 * Tours API
 * Handles all tour-related API calls
 */

import {
  getFeaturedTours as sanityGetFeaturedTours,
  getTourBySlug as sanityGetTourBySlug,
  getTours as sanityGetTours,
  getToursPreview as sanityGetToursPreview,
} from "@/sanity/lib/queries";
import { ApiResponse, Tour, TourPreview } from "../types";

/**
 * Get all tours (preview data for list views)
 * Fetches lightweight data optimized for list displays
 * @returns API response with array of tour previews
 */
export async function getToursPreview(): Promise<ApiResponse<TourPreview[]>> {
  try {
    const tours = await sanityGetToursPreview();

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

    const tour = await sanityGetTourBySlug(slug);

    if (!tour) {
      return {
        success: false,
        message: "Tour not found",
        error: "NOT_FOUND",
        data: null,
      };
    }

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
    const tours = await sanityGetFeaturedTours();

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
    const tours = await sanityGetTours();

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
