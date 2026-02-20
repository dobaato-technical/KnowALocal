/**
 * Storage Configuration
 * Centralized storage settings and utility functions
 */

// Supabase storage configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: "know-a-local",
  SUPABASE_URL: "https://nmbcunlrijwkvqoakqkr.supabase.co",
};

/**
 * Generate public URL from file path
 * @param filePath - File path in storage (e.g., "hero/1708456789123-abc123-image.jpg")
 * @returns Full public URL
 */
export function getPublicImageUrl(filePath: string | null | undefined): string {
  if (!filePath) return "";
  console.log(
    "Generating public URL for file path:",
    STORAGE_CONFIG.BUCKET_NAME,
  );
  return `${STORAGE_CONFIG.SUPABASE_URL}/storage/v1/object/public/${STORAGE_CONFIG.BUCKET_NAME}`;
}

/**
 * Generate public URLs for multiple file paths
 * @param filePaths - Array of file paths
 * @returns Array of full public URLs
 */
export function getPublicImageUrls(
  filePaths: (string | null | undefined)[],
): string[] {
  return filePaths
    .filter((path): path is string => !!path)
    .map((path) => getPublicImageUrl(path));
}
