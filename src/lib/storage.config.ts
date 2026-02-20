/**
 * Storage Configuration Constants
 * Centralized configuration for Supabase Storage
 */

/**
 * Supabase Storage Configuration
 */
export const STORAGE_CONFIG = {
  // Bucket name in Supabase
  BUCKET_NAME: "know-a-local" as const,

  // Maximum file size (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ] as const,

  // Allowed file extensions
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"] as const,

  // Cache control header value
  CACHE_CONTROL: "3600", // 1 hour

  // Folders within bucket
  FOLDERS: {
    HERO: "hero" as const,
    GALLERY: "gallery" as const,
  },

  // API endpoint for uploads
  API_ENDPOINT: "/api/upload",

  // Maximum number of gallery images per tour
  MAX_GALLERY_IMAGES: 10,

  // Enable/disable features
  FEATURES: {
    AUTO_DELETE_ON_REPLACE: true,
    BATCH_UPLOADS: true,
    PROGRESS_TRACKING: true,
    COMPRESSION: false, // TODO: Implement
  },
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
  INVALID_FILE_TYPE: `Invalid file type. Allowed types: ${STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(", ")}`,
  INVALID_EXTENSION: `Invalid file extension. Allowed: ${STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(", ")}`,
  UPLOAD_FAILED: "Failed to upload image",
  DELETE_FAILED: "Failed to delete image",
  UPLOAD_CANCELLED: "Upload was cancelled",
  NO_FILE_SELECTED: "No file selected",
  BATCH_UPLOAD_FAILED: "One or more files failed to upload",
  UNAUTHORIZED: "You don't have permission to upload files",
  SERVER_ERROR: "Server error occurred during upload",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: "Image uploaded successfully",
  BATCH_UPLOAD_SUCCESS: "Images uploaded successfully",
  DELETE_SUCCESS: "Image deleted successfully",
  BATCH_DELETE_SUCCESS: "Images deleted successfully",
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

/**
 * Get display name for folder
 */
export function getFolderDisplayName(
  folder: (typeof STORAGE_CONFIG.FOLDERS)[keyof typeof STORAGE_CONFIG.FOLDERS],
): string {
  const names: Record<string, string> = {
    hero: "Hero Image",
    gallery: "Gallery Image",
  };
  return names[folder] || "Image";
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get file size error message
 */
export function getFileSizeErrorMessage(fileSize: number): string {
  return `File size (${formatFileSize(fileSize)}) exceeds limit (${formatFileSize(STORAGE_CONFIG.MAX_FILE_SIZE)})`;
}

/**
 * Validate configuration at runtime
 */
export function validateConfiguration(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!STORAGE_CONFIG.BUCKET_NAME) {
    errors.push("BUCKET_NAME is not configured");
  }

  if (STORAGE_CONFIG.MAX_FILE_SIZE <= 0) {
    errors.push("MAX_FILE_SIZE must be greater than 0");
  }

  if ((STORAGE_CONFIG.ALLOWED_TYPES as readonly string[]).length === 0) {
    errors.push("At least one ALLOWED_TYPE must be configured");
  }

  if ((STORAGE_CONFIG.ALLOWED_EXTENSIONS as readonly string[]).length === 0) {
    errors.push("At least one ALLOWED_EXTENSION must be configured");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export type-safe folder names
 */
export type StorageFolder =
  (typeof STORAGE_CONFIG.FOLDERS)[keyof typeof STORAGE_CONFIG.FOLDERS];
export type AllowedMimeType = (typeof STORAGE_CONFIG.ALLOWED_TYPES)[number];
export type AllowedExtension =
  (typeof STORAGE_CONFIG.ALLOWED_EXTENSIONS)[number];
