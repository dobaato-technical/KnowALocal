/**
 * ImageUpload Component
 * Reusable component for uploading images (hero or gallery)
 * Returns filePath to store in database, not full URL
 */

"use client";

import { useImageUpload } from "@/lib/hooks/useImageUpload";
import type { UploadResponse } from "@/lib/supabase-storage";
import { useCallback, useRef, useState } from "react";

export interface ImageUploadProps {
  folder: "hero" | "gallery";
  maxFiles?: number;
  onUploadSuccess?: (filePaths: string[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  className?: string;
}

/**
 * Image Upload Component
 */
export function ImageUpload({
  folder,
  maxFiles = 1,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  className = "",
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isLoading,
    error,
    progress,
    uploadImage,
    uploadMultiple,
    clearError,
  } = useImageUpload();

  // Handle file selection
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError();
      const files = Array.from(e.target.files || []);

      // Validate file count
      if (files.length + selectedFiles.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
        onUploadError?.(errorMsg);
        return;
      }

      // Generate preview URLs
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    },
    [selectedFiles.length, maxFiles, clearError, onUploadError],
  );

  // Remove selected file
  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      onUploadError?.("No files selected");
      return;
    }

    try {
      let results: UploadResponse[] = [];

      if (multiple && selectedFiles.length > 1) {
        results = await uploadMultiple(selectedFiles);
      } else {
        const result = await uploadImage(selectedFiles[0], folder);
        results = [result];
      }

      // Check for failures
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        const errorMsg = failures.map((f) => f.error).join(", ");
        onUploadError?.(errorMsg);
        return;
      }

      // Extract successful filePaths (not URLs)
      const filePaths = results
        .filter((r) => r.success && r.filePath)
        .map((r) => r.filePath!);

      onUploadSuccess?.(filePaths);

      // Clear state
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      onUploadError?.(errorMsg);
    }
  }, [
    selectedFiles,
    folder,
    multiple,
    uploadImage,
    uploadMultiple,
    onUploadSuccess,
    onUploadError,
  ]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full text-center"
        >
          <div className="text-gray-600">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
            {maxFiles > 1 && (
              <p className="text-sm text-gray-500">
                Maximum {maxFiles} files ({selectedFiles.length} selected)
              </p>
            )}
          </div>
        </button>
      </div>

      {/* Error Message */}
      {(error || false) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Preview List */}
      {previewUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Preview:</p>
          <div
            className={`grid gap-4 ${multiple ? "grid-cols-2 md:grid-cols-3" : ""}`}
          >
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Uploading...</p>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
        >
          {isLoading
            ? "Uploading..."
            : `Upload ${selectedFiles.length} file(s)`}
        </button>
      )}
    </div>
  );
}
