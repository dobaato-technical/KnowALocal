"use client";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface AddTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tourData: TourFormData) => void;
  isLoading?: boolean;
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
};

export default function AddTourModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddTourModalProps) {
  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialFormData);
      setErrors({});
    }
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
          <h2 className="text-xl font-bold text-gray-900">Create New Tour</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
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
              {isLoading ? "Creating..." : "Create Tour"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
