/**
 * useImageUpload Hook
 * Custom React hook for handling image uploads
 */

import type { UploadResponse } from "@/lib/supabase-storage";
import { useCallback, useState } from "react";

export interface UseImageUploadState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export interface UseImageUploadReturn extends UseImageUploadState {
  uploadImage: (
    file: File,
    folder: "hero" | "gallery",
  ) => Promise<UploadResponse>;
  uploadMultiple: (files: File[]) => Promise<UploadResponse[]>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook for uploading images
 * @returns Upload utilities and state
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setProgress(0);
  }, []);

  const uploadImage = useCallback(
    async (file: File, folder: "hero" | "gallery"): Promise<UploadResponse> => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(0);

        console.log("Starting upload:", {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          folder,
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        console.log("FormData prepared, sending request...");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          // Track upload progress
          headers: {
            // Don't set Content-Type, let the browser set it for multipart/form-data
          },
        });

        console.log("Response status:", response.status);

        const data = (await response.json()) as UploadResponse;

        console.log("Response data:", data);

        if (!response.ok) {
          const errorMessage = data.error || data.message || "Upload failed";
          setError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            error: errorMessage,
          };
        }

        setProgress(100);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        console.error("Upload error:", err);
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<UploadResponse[]> => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await Promise.all(
          files.map((file, index) => {
            setProgress(Math.round(((index + 1) / files.length) * 100));
            return uploadImage(file, "gallery");
          }),
        );

        // Check if any uploads failed
        const failures = results.filter((r) => !r.success);
        if (failures.length > 0) {
          setError(`${failures.length} image(s) failed to upload`);
        }

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Batch upload failed";
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage],
  );

  return {
    isLoading,
    error,
    progress,
    uploadImage,
    uploadMultiple,
    clearError,
    reset,
  };
}
