/**
 * Supabase Storage Utilities
 * Handles all image uploads, deletions, and URL generation for the know-a-local-bucket
 */

import { STORAGE_CONFIG } from "./storage-config";
import { supabase } from "./supabase";
import { getSupabaseAdmin } from "./supabase-admin";

// Configuration
const BUCKET_NAME = STORAGE_CONFIG.BUCKET_NAME;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Upload response interface
 * Now returns only filePath (store this in database)
 * Use getPublicImageUrl() to construct full URL when needed
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  error?: string;
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @returns ValidationResult
 */
export function validateImage(file: File): ValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 15MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext),
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Generate unique file path with timestamp
 * @param folder - Folder name (e.g., "hero", "gallery")
 * @param fileName - Original file name
 * @returns Unique file path
 */
export function generateFilePath(folder: string, fileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = fileName.substring(fileName.lastIndexOf("."));
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

  return `${folder}/${timestamp}-${randomString}-${nameWithoutExt}${extension}`;
}

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param folder - Folder name ("hero" or "gallery")
 * @returns UploadResponse with filePath only (store this in database)
 */
export async function uploadImage(
  file: File,
  folder: "hero" | "gallery",
): Promise<UploadResponse> {
  try {
    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      return {
        success: false,
        message: "Invalid file",
        error: validation.error,
      };
    }

    // Generate unique file path
    const filePath = generateFilePath(folder, file.name);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return {
        success: false,
        message: "Failed to upload image",
        error: error.message,
      };
    }

    // Return only filePath (construct URL when needed with getPublicImageUrl)
    return {
      success: true,
      message: "Image uploaded successfully",
      filePath: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: "An error occurred during upload",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload image to Supabase Storage (Server-side, uses admin client)
 * Use this in API routes to bypass RLS policies
 * @param file - File to upload
 * @param folder - Folder name ("hero" or "gallery")
 * @returns UploadResponse with public URL
 */
export async function uploadImageAdmin(
  file: File,
  folder: "hero" | "gallery",
): Promise<UploadResponse> {
  try {
    // Check if admin client is properly configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        success: false,
        message: "Upload service not configured",
        error:
          "SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file. Get it from: Supabase Dashboard → Project Settings → API → Service Role Secret Key",
      };
    }

    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      return {
        success: false,
        message: "Invalid file",
        error: validation.error,
      };
    }

    // Generate unique file path
    const filePath = generateFilePath(folder, file.name);

    // Convert File to Buffer for admin upload
    const buffer = await file.arrayBuffer();

    // Get admin client
    const supabaseAdmin = getSupabaseAdmin();

    // Upload to Supabase using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return {
        success: false,
        message: "Failed to upload image",
        error: error.message,
      };
    }

    // Return only filePath (construct URL when needed with getPublicImageUrl)
    return {
      success: true,
      message: "Image uploaded successfully",
      filePath: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: "An error occurred during upload",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Upload multiple images (for gallery)
 * @param files - Files to upload
 * @returns Array of UploadResponse
 */
export async function uploadMultipleImages(
  files: File[],
): Promise<UploadResponse[]> {
  return Promise.all(files.map((file) => uploadImage(file, "gallery")));
}

/**
 * Delete image from Supabase Storage
 * @param filePath - Path of file to delete
 * @returns UploadResponse
 */
export async function deleteImage(filePath: string): Promise<UploadResponse> {
  try {
    if (!filePath) {
      return {
        success: false,
        message: "File path is required",
        error: "Missing file path",
      };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Supabase storage delete error:", error);
      return {
        success: false,
        message: "Failed to delete image",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Image deleted successfully",
      filePath,
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      message: "An error occurred during deletion",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete multiple images
 * @param filePaths - Array of file paths to delete
 * @returns UploadResponse
 */
export async function deleteMultipleImages(
  filePaths: string[],
): Promise<UploadResponse> {
  try {
    if (!filePaths || filePaths.length === 0) {
      return {
        success: false,
        message: "File paths are required",
        error: "Empty file paths array",
      };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (error) {
      console.error("Supabase storage delete error:", error);
      return {
        success: false,
        message: "Failed to delete images",
        error: error.message,
      };
    }

    return {
      success: true,
      message: `${filePaths.length} image(s) deleted successfully`,
      filePath: filePaths.join(","),
    };
  } catch (error) {
    console.error("Batch delete error:", error);
    return {
      success: false,
      message: "An error occurred during batch deletion",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get public URL for a file
 * @param filePath - Path of the file
 * @returns Public URL
 */
export function getPublicUrl(filePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return publicUrl;
}

/**
 * List all files in a folder
 * @param folder - Folder name ("hero" or "gallery")
 * @returns Array of file names
 */
export async function listImages(
  folder: "hero" | "gallery",
): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) {
      console.error("Supabase list error:", error);
      return [];
    }

    return data.map((file) => file.name);
  } catch (error) {
    console.error("List error:", error);
    return [];
  }
}
