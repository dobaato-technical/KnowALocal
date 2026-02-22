"use client";

import { ImageUpload } from "@/components/common/ImageUpload";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/TagInput";
import { getPublicImageUrl } from "@/lib/storage-config";
import { X } from "lucide-react";
import React, { useState } from "react";

interface AddTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tourData: TourFormData) => void;
  isLoading?: boolean;
  editingData?: TourFormData;
}

export interface TourFormData {
  title: string;
  location: string;
  description: string;
  fullDescription: string;
  basePrice: number;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  tourType: "standard" | "adventure" | "hiking" | "water";
  rating: number;
  maxGroupSize: number;
  isFeatured: boolean;
  itinerary: string[];
  specialities: string[];
  included: string[];
  requirements: string[];
  heroImageUrl?: string;
  galleryImageUrls?: string[];
}

const initialFormData: TourFormData = {
  title: "",
  location: "",
  description: "",
  fullDescription: "",
  basePrice: 0,
  duration: "2 Hours",
  difficulty: "Easy",
  tourType: "standard",
  rating: 0,
  maxGroupSize: 0,
  isFeatured: true,
  itinerary: [],
  specialities: [],
  included: [],
  requirements: [],
  heroImageUrl: "",
  galleryImageUrls: [],
};

export default function AddTourModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editingData,
}: AddTourModalProps) {
  const [formData, setFormData] = useState<TourFormData>(
    editingData || initialFormData,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when editingData changes
  React.useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Short description is required";
    }
    if (formData.description.length > 200) {
      newErrors.description =
        "Short description must be less than 200 characters";
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = "Full description is required";
    }
    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Price must be greater than 0";
    }
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    if (!formData.heroImageUrl) {
      newErrors.heroImageUrl = "Hero image is required";
    }
    if (!formData.galleryImageUrls || formData.galleryImageUrls.length === 0) {
      newErrors.galleryImageUrls = "At least one gallery image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("=== AddTourModal handleSubmit START ===");
    console.log("editingData:", editingData);
    console.log("formData:", formData);

    e.preventDefault();

    if (validateForm()) {
      console.log("Form validation passed");
      console.log("Calling onSubmit with formData:", formData);
      onSubmit(formData);
      setFormData(initialFormData);
      setErrors({});
    } else {
      console.log("Form validation failed - errors:", errors);
    }
    console.log("=== AddTourModal handleSubmit END ===");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let newValue: any =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
          ? parseFloat(value) || 0
          : value;

    // Validate rating - can't exceed 5
    if (name === "rating" && newValue > 5) {
      newValue = 5;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (
    fieldName: "itinerary" | "specialities" | "included" | "requirements",
    tags: string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: tags,
    }));

    // Clear error when tags are updated
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl transition-all duration-300">
        {/* Hide number input spinners */}
        <style>{`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingData ? "Edit Tour" : "Create New Tour"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[85vh]">
          <div className="space-y-6 px-6 py-6">
            {/* Title and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tour Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Whale Watching Tour"
                  disabled={isLoading}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Location *
                </label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Brier Island"
                  disabled={isLoading}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Short Description * ({formData.description.length}/200)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the tour..."
                disabled={isLoading}
                rows={2}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Description *
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Detailed description of the tour experience..."
                disabled={isLoading}
                rows={4}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 ${
                  errors.fullDescription ? "border-red-500" : ""
                }`}
              />
              {errors.fullDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullDescription}
                </p>
              )}
            </div>

            {/* Itinerary */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Itinerary
                <span className="text-gray-500 text-xs ml-2">
                  (Type and press Enter to add each day)
                </span>
              </label>
              <TagInput
                tags={formData.itinerary}
                onTagsChange={(tags) => handleTagsChange("itinerary", tags)}
                placeholder="e.g., Day 1: Arrival and orientation"
                disabled={isLoading}
              />
              {errors.itinerary && (
                <p className="mt-1 text-sm text-red-600">{errors.itinerary}</p>
              )}
            </div>

            {/* Specialities and Requirements Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Specialities
                  <span className="text-gray-500 text-xs ml-2">
                    (Type and press Enter)
                  </span>
                </label>
                <TagInput
                  tags={formData.specialities}
                  onTagsChange={(tags) =>
                    handleTagsChange("specialities", tags)
                  }
                  placeholder="e.g., Expert guides, Small groups, Photography focus"
                  disabled={isLoading}
                />
                {errors.specialities && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.specialities}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Requirements
                  <span className="text-gray-500 text-xs ml-2">
                    (Type and press Enter)
                  </span>
                </label>
                <TagInput
                  tags={formData.requirements}
                  onTagsChange={(tags) =>
                    handleTagsChange("requirements", tags)
                  }
                  placeholder="e.g., Moderate fitness, Hiking boots, Age 12+"
                  disabled={isLoading}
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.requirements}
                  </p>
                )}
              </div>
            </div>

            {/* Included Services */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Included Services (Optional Additional Charges)
                <span className="text-gray-500 text-xs ml-2">
                  (Type and press Enter)
                </span>
              </label>
              <TagInput
                tags={formData.included}
                onTagsChange={(tags) => handleTagsChange("included", tags)}
                placeholder="e.g., Hotel pickup (+$20), Meals included, Photography service"
                disabled={isLoading}
              />
              {errors.included && (
                <p className="mt-1 text-sm text-red-600">{errors.included}</p>
              )}
            </div>

            {/* Price, Duration, Rating Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice || ""}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  disabled={isLoading}
                  className={errors.basePrice ? "border-red-500" : ""}
                />
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.basePrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Duration
                </label>
                <Input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 2 Hours"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rating (0-5) *
                </label>
                <Input
                  type="number"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleChange}
                  placeholder="Enter rating"
                  min="0"
                  max="5"
                  disabled={isLoading}
                  className={errors.rating ? "border-red-500" : ""}
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
              </div>
            </div>

            {/* Difficulty, Tour Type, Max Group Size Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tour Type
                </label>
                <select
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
                >
                  <option value="standard">Standard</option>
                  <option value="adventure">Adventure</option>
                  <option value="hiking">Hiking</option>
                  <option value="water">Water</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max Group Size
                </label>
                <Input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize || ""}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label className="text-sm font-medium text-gray-900">
                Featured Tour (can appear on landing page)
              </label>
            </div>

            {/* Image Uploads Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Images
              </h3>

              {/* Hero Image Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Hero Image *{" "}
                  <span className="text-gray-500">(Single image)</span>
                </label>
                {!formData.heroImageUrl ? (
                  <ImageUpload
                    folder="hero"
                    maxFiles={1}
                    onUploadSuccess={(urls) => {
                      setFormData((prev) => ({
                        ...prev,
                        heroImageUrl: urls[0],
                      }));
                      // Clear error when image is uploaded
                      if (errors.heroImageUrl) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.heroImageUrl;
                          return newErrors;
                        });
                      }
                    }}
                    onUploadError={(error) => {
                      setErrors((prev) => ({
                        ...prev,
                        heroImageUrl: error,
                      }));
                    }}
                    className="mb-4"
                  />
                ) : (
                  <div>
                    <img
                      src={getPublicImageUrl(formData.heroImageUrl)}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          heroImageUrl: "",
                        }))
                      }
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Change hero image
                    </button>
                  </div>
                )}
                {errors.heroImageUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.heroImageUrl}
                  </p>
                )}
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Gallery Images *{" "}
                  <span className="text-gray-500">(Up to 5 images)</span>
                </label>
                {(!formData.galleryImageUrls ||
                  formData.galleryImageUrls.length < 5) && (
                  <ImageUpload
                    folder="gallery"
                    maxFiles={5}
                    multiple={true}
                    onUploadSuccess={(urls) => {
                      setFormData((prev) => ({
                        ...prev,
                        galleryImageUrls: [
                          ...(prev.galleryImageUrls || []),
                          ...urls,
                        ].slice(0, 5),
                      }));
                      // Clear error when images are uploaded
                      if (errors.galleryImageUrls) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.galleryImageUrls;
                          return newErrors;
                        });
                      }
                    }}
                    onUploadError={(error) => {
                      setErrors((prev) => ({
                        ...prev,
                        galleryImageUrl: error,
                      }));
                    }}
                    className="mb-4"
                  />
                )}

                {formData.galleryImageUrls &&
                  formData.galleryImageUrls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {formData.galleryImageUrls.length} image(s) selected
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {formData.galleryImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getPublicImageUrl(url)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  galleryImageUrls: (
                                    prev.galleryImageUrls || []
                                  ).filter((_, i) => i !== index),
                                }));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {errors.galleryImageUrls && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.galleryImageUrls}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading
                ? editingData
                  ? "Updating..."
                  : "Creating..."
                : editingData
                  ? "Update Tour"
                  : "Create Tour"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
