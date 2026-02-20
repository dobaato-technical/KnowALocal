/**
 * Tours API - Image Integration
 * Handles tour creation/updates with image uploads
 * This shows how to integrate the image upload system with tours
 */

import { supabase } from "@/lib/supabase";
import { deleteImage, uploadImage } from "@/lib/supabase-storage";

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
  itinerary?: any[];
  specialitites?: any[];
  included?: any[];
  requirements?: any[];
}

export interface UpdateTourWithImagesInput extends Partial<CreateTourWithImagesInput> {
  id: number;
  currentHeroImagePath?: string;
  currentGalleryImagePaths?: string[];
}

/**
 * Create a tour with image uploads
 * @param input - Tour data with image files
 * @returns Success status with tour data or error
 */
export async function createTourWithImages(
  input: CreateTourWithImagesInput,
): Promise<{
  success: boolean;
  message: string;
  tourId?: number;
  error?: string;
}> {
  let heroImageUrl: string | null = null;
  let galleryImageUrls: string[] = [];

  try {
    // Upload hero image if provided
    if (input.heroImage) {
      const heroResult = await uploadImage(input.heroImage, "hero");
      if (!heroResult.success) {
        return {
          success: false,
          message: "Failed to upload hero image",
          error: heroResult.error,
        };
      }
      // Store only filePath (not full URL)
      heroImageUrl = heroResult.filePath || null;
    }

    // Upload gallery images if provided
    if (input.galleryImages && input.galleryImages.length > 0) {
      const uploadPromises = input.galleryImages.map((file) =>
        uploadImage(file, "gallery"),
      );
      const results = await Promise.all(uploadPromises);

      // Check for failures
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        // Cleanup uploaded hero image on failure
        if (heroImageUrl) {
          const heroPath = heroImageUrl.split("/").pop();
          if (heroPath) {
            await deleteImage(`hero/${heroPath}`);
          }
        }

        return {
          success: false,
          message: `Failed to upload ${failures.length} gallery image(s)`,
          error: failures.map((f) => f.error).join(", "),
        };
      }

      // Store only filePaths (not full URLs)
      galleryImageUrls = results
        .map((r) => r.filePath)
        .filter((path) => path !== undefined) as string[];
    }

    // Create tour in database
    const { data, error } = await supabase
      .from("tours")
      .insert({
        title: input.title,
        short_desc: input.short_desc,
        long_desc: input.long_desc,
        price: input.price,
        duration: input.duration,
        difficulty: input.difficulty,
        group_size: input.group_size,
        tour_type: input.tour_type,
        location: input.location,
        hero_image: heroImageUrl,
        gallery_images: galleryImageUrls,
        itinerary: input.itinerary || [],
        specialitites: input.specialitites || [],
        included: input.included || [],
        requirements: input.requirements || [],
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      // Cleanup uploaded images on database error
      if (heroImageUrl) {
        const heroPath = heroImageUrl.split("/").pop();
        if (heroPath) {
          await deleteImage(`hero/${heroPath}`);
        }
      }
      for (const url of galleryImageUrls) {
        const path = url.split("/").pop();
        if (path) {
          await deleteImage(`gallery/${path}`);
        }
      }

      return {
        success: false,
        message: "Failed to create tour in database",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Tour created successfully with images",
      tourId: data.id,
    };
  } catch (err) {
    console.error("Create tour error:", err);
    return {
      success: false,
      message: "An error occurred while creating the tour",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update a tour with new images
 * @param input - Tour update data with optional new images
 * @returns Success status or error
 */
export async function updateTourWithImages(
  input: UpdateTourWithImagesInput,
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  const updateData: Record<string, any> = {};

  try {
    // Handle hero image replacement
    if (input.heroImage) {
      // Delete old hero image if it exists
      if (input.currentHeroImagePath) {
        await deleteImage(input.currentHeroImagePath);
      }

      const heroResult = await uploadImage(input.heroImage, "hero");
      if (!heroResult.success) {
        return {
          success: false,
          message: "Failed to upload new hero image",
          error: heroResult.error,
        };
      }
      // Store only filePath (not full URL)
      updateData.hero_image = heroResult.filePath;
    }

    // Handle gallery images replacement
    if (input.galleryImages && input.galleryImages.length > 0) {
      // Delete old gallery images
      if (
        input.currentGalleryImagePaths &&
        input.currentGalleryImagePaths.length > 0
      ) {
        const deleteResults = await Promise.all(
          input.currentGalleryImagePaths.map((path) => deleteImage(path)),
        );

        const failures = deleteResults.filter((r) => !r.success);
        if (failures.length > 0) {
          console.warn(
            `Failed to delete ${failures.length} old gallery image(s)`,
          );
        }
      }

      // Upload new gallery images
      const uploadPromises = input.galleryImages.map((file) =>
        uploadImage(file, "gallery"),
      );
      const results = await Promise.all(uploadPromises);

      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        return {
          success: false,
          message: `Failed to upload ${failures.length} gallery image(s)`,
          error: failures.map((f) => f.error).join(", "),
        };
      }

      // Store only filePaths (not full URLs)
      updateData.gallery_images = results
        .map((r) => r.filePath)
        .filter((path) => path !== undefined);
    }

    // Add other update fields
    if (input.title) updateData.title = input.title;
    if (input.short_desc) updateData.short_desc = input.short_desc;
    if (input.long_desc) updateData.long_desc = input.long_desc;
    if (input.price) updateData.price = input.price;
    if (input.duration) updateData.duration = input.duration;
    if (input.difficulty) updateData.difficulty = input.difficulty;
    if (input.group_size) updateData.group_size = input.group_size;
    if (input.tour_type) updateData.tour_type = input.tour_type;
    if (input.location) updateData.location = input.location;
    if (input.itinerary) updateData.itinerary = input.itinerary;
    if (input.specialitites) updateData.specialitites = input.specialitites;
    if (input.included) updateData.included = input.included;
    if (input.requirements) updateData.requirements = input.requirements;

    // Update tour in database
    const { error } = await supabase
      .from("tours")
      .update(updateData)
      .eq("id", input.id);

    if (error) {
      return {
        success: false,
        message: "Failed to update tour in database",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Tour updated successfully",
    };
  } catch (err) {
    console.error("Update tour error:", err);
    return {
      success: false,
      message: "An error occurred while updating the tour",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Delete tour and associated images
 * @param tourId - ID of tour to delete
 * @param heroImagePath - Path to hero image to delete
 * @param galleryImagePaths - Paths to gallery images to delete
 * @returns Success status or error
 */
export async function deleteTourWithImages(
  tourId: number,
  heroImagePath?: string,
  galleryImagePaths?: string[],
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    // Delete images from storage
    if (heroImagePath) {
      await deleteImage(heroImagePath);
    }

    if (galleryImagePaths && galleryImagePaths.length > 0) {
      await Promise.all(galleryImagePaths.map((path) => deleteImage(path)));
    }

    // Delete tour from database
    const { error } = await supabase.from("tours").delete().eq("id", tourId);

    if (error) {
      return {
        success: false,
        message: "Failed to delete tour from database",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Tour and associated images deleted successfully",
    };
  } catch (err) {
    console.error("Delete tour error:", err);
    return {
      success: false,
      message: "An error occurred while deleting the tour",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
