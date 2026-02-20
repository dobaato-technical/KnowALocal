/**
 * Supabase Storage URL utilities
 * Constructs public URLs for files stored in Supabase Storage
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Get the full public URL for a tours storage file
 * @param folder - Folder path within tours bucket (e.g., "hero", "gallery")
 * @param fileName - Name of the file (with or without folder prefix)
 * @returns Full public URL to the file
 */
export function getTourStorageUrl(folder: string, fileName: string): string {
  if (!SUPABASE_URL || !fileName) {
    return "";
  }

  // Remove folder prefix if it already exists in fileName
  // e.g., "hero/image.jpg" -> "image.jpg"
  const cleanFileName = fileName.startsWith(`${folder}/`)
    ? fileName.substring(`${folder}/`.length)
    : fileName;

  return `${SUPABASE_URL}/storage/v1/object/public/know-a-local/${folder}/${cleanFileName}`;
}

/**
 * Get hero image URL
 * @param fileName - Name of the hero image file
 * @returns Full public URL to the hero image
 */
export function getHeroImageUrl(fileName: string): string {
  return getTourStorageUrl("hero", fileName);
}

/**
 * Get gallery image URL
 * @param fileName - Name of the gallery image file (with or without "gallery/" prefix)
 * @returns Full public URL to the gallery image
 */
export function getGalleryImageUrl(fileName: string): string {
  return getTourStorageUrl("gallery", fileName);
}

/**
 * Get multiple gallery image URLs
 * @param fileNames - Array of gallery image file names
 * @returns Array of full public URLs
 */
export function getGalleryImageUrls(fileNames: string[]): string[] {
  return fileNames.map((fileName) => getGalleryImageUrl(fileName));
}
