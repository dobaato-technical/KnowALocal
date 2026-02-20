/**
 * Example: Tour Creation Form with Image Upload
 * This demonstrates how to integrate ImageUpload component with a tour form
 */

"use client";

import { createTourWithImages } from "@/api/tours/tours-with-images";
import { ImageUpload } from "@/components/common/ImageUpload";
import { useState } from "react";

interface TourFormData {
  title: string;
  short_desc: string;
  long_desc: string;
  price: string;
  duration: string;
  difficulty: string;
  group_size: string;
  tour_type: string;
  location: string;
  heroImageFile?: File;
  galleryImageFiles: File[];
}

export function TourCreationForm() {
  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    short_desc: "",
    long_desc: "",
    price: "",
    duration: "",
    difficulty: "moderate",
    group_size: "",
    tour_type: "standard",
    location: "",
    heroImageFile: undefined,
    galleryImageFiles: [],
  });

  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHeroImageSuccess = (urls: string[]) => {
    setHeroImageUrl(urls[0]);
    setMessage({ type: "success", text: "Hero image uploaded successfully" });
  };

  const handleGalleryImagesSuccess = (urls: string[]) => {
    setGalleryImageUrls((prev) => [...prev, ...urls]);
    setMessage({
      type: "success",
      text: `${urls.length} gallery image(s) uploaded successfully`,
    });
  };

  const handleUploadError = (error: string) => {
    setMessage({ type: "error", text: error });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setMessage({ type: "error", text: "Title is required" });
        setIsSubmitting(false);
        return;
      }

      if (!heroImageUrl) {
        setMessage({ type: "error", text: "Hero image is required" });
        setIsSubmitting(false);
        return;
      }

      if (galleryImageUrls.length === 0) {
        setMessage({
          type: "error",
          text: "At least one gallery image is required",
        });
        setIsSubmitting(false);
        return;
      }

      // Create tour with images
      const response = await createTourWithImages({
        title: formData.title,
        short_desc: formData.short_desc,
        long_desc: formData.long_desc,
        price: parseFloat(formData.price) || 0,
        duration: formData.duration,
        difficulty: formData.difficulty,
        group_size: formData.group_size,
        tour_type: formData.tour_type,
        location: formData.location,
        // Note: In this example, images are already uploaded
        // So we pass URLs instead of files
        heroImage: undefined,
        galleryImages: [],
      });

      // For production, you'd save the URLs separately
      // or modify createTourWithImages to accept URLs

      if (response.success) {
        setMessage({
          type: "success",
          text: `Tour created successfully! Tour ID: ${response.tourId}`,
        });

        // Reset form
        setFormData({
          title: "",
          short_desc: "",
          long_desc: "",
          price: "",
          duration: "",
          difficulty: "moderate",
          group_size: "",
          tour_type: "standard",
          location: "",
          heroImageFile: undefined,
          galleryImageFiles: [],
        });
        setHeroImageUrl("");
        setGalleryImageUrls([]);
      } else {
        setMessage({ type: "error", text: response.error || response.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Tour</h1>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tour title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description *
            </label>
            <textarea
              name="short_desc"
              value={formData.short_desc}
              onChange={handleInputChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Long Description *
            </label>
            <textarea
              name="long_desc"
              value={formData.long_desc}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tour location"
            />
          </div>
        </div>

        {/* Tour Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tour Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Group Size *
              </label>
              <input
                type="text"
                name="group_size"
                value={formData.group_size}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2-6"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Tour Type *
              </label>
              <select
                name="tour_type"
                value={formData.tour_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="adventure">Adventure</option>
                <option value="hiking">Hiking</option>
                <option value="water">Water</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Images</h2>

          {/* Hero Image */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2">Hero Image *</h3>
            <p className="text-sm text-gray-600 mb-4">
              Main image for the tour
            </p>
            {!heroImageUrl ? (
              <ImageUpload
                folder="hero"
                maxFiles={1}
                onUploadSuccess={handleHeroImageSuccess}
                onUploadError={handleUploadError}
              />
            ) : (
              <div>
                <img
                  src={heroImageUrl}
                  alt="Hero"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <button
                  type="button"
                  onClick={() => setHeroImageUrl("")}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Change image
                </button>
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2">Gallery Images *</h3>
            <p className="text-sm text-gray-600 mb-4">
              Additional tour images (up to 10)
            </p>

            {galleryImageUrls.length < 10 && (
              <div className="mb-6">
                <ImageUpload
                  folder="gallery"
                  maxFiles={10}
                  multiple={true}
                  onUploadSuccess={handleGalleryImagesSuccess}
                  onUploadError={handleUploadError}
                />
              </div>
            )}

            {galleryImageUrls.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  {galleryImageUrls.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {galleryImageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Creating tour..." : "Create Tour"}
          </button>
        </div>
      </form>
    </div>
  );
}
