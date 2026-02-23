"use client";

import { deleteTour } from "@/api";
import Button from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { getHeroImageUrl } from "@/lib/storage-urls";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast-utils";
import { Edit2, Eye, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddTourModal, { TourFormData } from "./components/AddTourModal";

interface Tour {
  id: string;
  name: string;
  location: string | null;
  duration: string;
  price: number;
  availability: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  heroImage?: string;
}

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [editingTourData, setEditingTourData] = useState<
    TourFormData | undefined
  >(undefined);
  const [isViewingTourId, setIsViewingTourId] = useState<string | null>(null);
  const [viewingTourData, setViewingTourData] = useState<
    TourFormData | undefined
  >(undefined);

  // Fetch tours from Supabase on component mount
  const fetchTours = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tours")
        .select(
          "id, title, duration, price, group_size, featured, created_at, hero_image",
        )
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Error fetching tours:", supabaseError);
        setError("Failed to fetch tours");
        setTours([]);
        return;
      }

      // Transform Supabase data to Tour interface
      const transformedTours: Tour[] = (data || []).map((tour: any) => ({
        id: tour.id?.toString() || "",
        name: tour.title || "",
        location: null,
        duration: tour.duration || "",
        price: tour.price || 0,
        availability: tour.group_size || 0,
        status: tour.featured ? "active" : "draft",
        createdAt: tour.created_at
          ? new Date(tour.created_at).toISOString().split("T")[0]
          : "",
        heroImage: tour.hero_image
          ? getHeroImageUrl(tour.hero_image)
          : undefined,
      }));

      setTours(transformedTours);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError("An error occurred while fetching tours");
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditTour = async (tour: Tour) => {
    console.log("=== handleEditTour START ===");
    console.log("Selected tour:", tour);

    try {
      console.log("Fetching full tour details for ID:", tour.id);

      // Fetch full tour details from Supabase
      const { data, error: fetchError } = await supabase
        .from("tours")
        .select(
          "id, title, short_desc, long_desc, price, duration, difficulty, tour_type, rating, group_size, featured, itinerary, specialities, included, requirements, hero_image, gallery_images",
        )
        .eq("id", tour.id)
        .single();

      console.log("Fetch response - data:", data, "error:", fetchError);

      if (fetchError || !data) {
        console.error("Failed to fetch tour details - error:", fetchError);
        showToast("Failed to fetch tour details", "error");
        return;
      }

      console.log("Tour details fetched successfully:", data);

      // Transform fetched data to TourFormData for editing
      const tourFormData: TourFormData = {
        title: data.title || "",
        location: "", // Location not stored in DB, will be empty
        description: data.short_desc || "",
        fullDescription: data.long_desc || "",
        basePrice: data.price || 0,
        duration: data.duration || "",
        difficulty:
          (data.difficulty as "Easy" | "Moderate" | "Challenging") || "Easy",
        tourType:
          (data.tour_type as "standard" | "adventure" | "hiking" | "water") ||
          "standard",
        rating: data.rating || 0,
        maxGroupSize: data.group_size
          ? parseInt(data.group_size.toString())
          : 0,
        isFeatured: data.featured || false,
        itinerary: data.itinerary || [],
        specialities: data.specialities || [],
        included: data.included || [],
        requirements: data.requirements || [],
        heroImageUrl: data.hero_image || "",
        galleryImageUrls: data.gallery_images || [],
      };

      console.log("Tour form data prepared:", tourFormData);

      setEditingTourData(tourFormData);
      setEditingTourId(tour.id);
      setIsModalOpen(true);

      console.log("Modal opened with editingTourId:", tour.id);
      console.log("=== handleEditTour END (SUCCESS) ===");
    } catch (err) {
      console.error("Error fetching tour details:", err);
      console.log("=== handleEditTour END (ERROR) ===");
      showToast("An error occurred while fetching tour details", "error");
    }
  };

  const handleViewTour = async (tour: Tour) => {
    console.log("=== handleViewTour START ===");
    console.log("Viewing tour:", tour);

    try {
      console.log("Fetching full tour details for ID:", tour.id);

      // Fetch full tour details from Supabase
      const { data, error: fetchError } = await supabase
        .from("tours")
        .select(
          "id, title, short_desc, long_desc, price, duration, difficulty, tour_type, rating, group_size, featured, itinerary, specialities, included, requirements, hero_image, gallery_images",
        )
        .eq("id", tour.id)
        .single();

      console.log("Fetch response - data:", data, "error:", fetchError);

      if (fetchError || !data) {
        console.error("Failed to fetch tour details - error:", fetchError);
        showToast("Failed to fetch tour details", "error");
        return;
      }

      console.log("Tour details fetched successfully:", data);

      // Transform fetched data to TourFormData for viewing
      const tourFormData: TourFormData = {
        title: data.title || "",
        location: "", // Location not stored in DB, will be empty
        description: data.short_desc || "",
        fullDescription: data.long_desc || "",
        basePrice: data.price || 0,
        duration: data.duration || "",
        difficulty:
          (data.difficulty as "Easy" | "Moderate" | "Challenging") || "Easy",
        tourType:
          (data.tour_type as "standard" | "adventure" | "hiking" | "water") ||
          "standard",
        rating: data.rating || 0,
        maxGroupSize: data.group_size
          ? parseInt(data.group_size.toString())
          : 0,
        isFeatured: data.featured || false,
        itinerary: data.itinerary || [],
        specialities: data.specialities || [],
        included: data.included || [],
        requirements: data.requirements || [],
        heroImageUrl: data.hero_image ? getHeroImageUrl(data.hero_image) : "",
        galleryImageUrls: data.gallery_images || [],
      };

      console.log("Tour form data prepared for viewing:", tourFormData);

      setViewingTourData(tourFormData);
      setIsViewingTourId(tour.id);
      setIsModalOpen(true);

      console.log("Modal opened in view mode with isViewingTourId:", tour.id);
      console.log("=== handleViewTour END (SUCCESS) ===");
    } catch (err) {
      console.error("Error fetching tour details:", err);
      console.log("=== handleViewTour END (ERROR) ===");
      showToast("An error occurred while fetching tour details", "error");
    }
  };

  const handleDeleteTour = async (tourId: string, tourName: string) => {
    if (!confirm(`Are you sure you want to delete "${tourName}"?`)) {
      return;
    }

    try {
      console.log("Deleting tour with ID:", tourId);
      const response = await deleteTour(tourId);

      if (response.success) {
        console.log("Tour deleted successfully");
        setTours(tours.filter((t) => t.id !== tourId));
        showToast("Tour deleted successfully", "success");
      } else {
        console.error("Failed to delete tour:", response.message);
        showToast(`Failed to delete tour: ${response.message}`, "error");
      }
    } catch (err) {
      console.error("Error deleting tour:", err);
      showToast("An error occurred while deleting the tour", "error");
    }
  };

  const columns: Column<Tour>[] = [
    {
      key: "name",
      label: "Tour Name",
      className: "font-semibold",
    },
    {
      key: "location",
      label: "Location",
      render: (value) => value || "N/A",
    },
    {
      key: "duration",
      label: "Duration",
    },
    {
      key: "price",
      label: "Price",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "availability",
      label: "Availability",
      render: (value) => (
        <span className={value === 0 ? "text-red-600 font-semibold" : ""}>
          {value} spots
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(
            value,
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewTour(row)}
            className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition-colors"
            title="View tour details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditTour(row)}
            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit tour"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteTour(row.id, row.name)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
            title="Delete tour"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (row: Tour) => {
    console.log("Row clicked:", row);
    // Navigate to tour details or edit page
  };

  const handleAddTour = async (tourData: TourFormData) => {
    console.log("=== handleAddTour START ===");
    console.log("editingTourId:", editingTourId);
    console.log("tourData:", tourData);

    setIsLoading(true);
    try {
      // Determine if we're updating or creating BEFORE we modify state
      const isUpdating = !!editingTourId;
      const endpoint = isUpdating ? "/api/tours/update" : "/api/tours/create";
      const method = isUpdating ? "PUT" : "POST";

      console.log("isUpdating:", isUpdating);
      console.log("endpoint:", endpoint);
      console.log("method:", method);

      const payload: any = {
        title: tourData.title,
        description: tourData.description,
        fullDescription: tourData.fullDescription,
        basePrice: tourData.basePrice,
        duration: tourData.duration,
        difficulty: tourData.difficulty,
        tourType: tourData.tourType,
        rating: tourData.rating,
        maxGroupSize: tourData.maxGroupSize,
        isFeatured: tourData.isFeatured,
        itinerary: tourData.itinerary,
        specialities: tourData.specialities,
        included: tourData.included,
        requirements: tourData.requirements,
        hero_image: tourData.heroImageUrl,
        gallery_images: tourData.galleryImageUrls,
      };

      // Add tourId if updating
      if (isUpdating) {
        payload.tourId = editingTourId;
        console.log("tourId to update:", editingTourId);
      }

      console.log("Full payload:", payload);

      // Call backend API route to create or update the tour
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response result:", result);

      if (!response.ok || !result.success) {
        console.error("Failed to save tour:", result.message);
        showToast(`Failed to save tour: ${result.message}`, "error");
        return;
      }

      // Refresh tours list
      console.log("Fetching tours...");
      await fetchTours();

      // Clear state
      setIsModalOpen(false);
      setEditingTourId(null);
      setEditingTourData(undefined);

      const action = isUpdating ? "updated" : "created";
      console.log(`Tour ${action} successfully!`, result.data?.id);
      showToast(`Tour ${action} successfully!`, "success");

      console.log("=== handleAddTour END (SUCCESS) ===");
    } catch (error) {
      console.error("Error saving tour:", error);
      console.log("=== handleAddTour END (ERROR) ===");
      showToast("An error occurred while saving the tour", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours Management</h1>
          <p className="text-gray-600">Manage and view all tours</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTourId(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={20} />
          <span>Add New Tour</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg bg-blue-50 p-8 text-center text-blue-800">
          Loading tours...
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <Table<Tour>
          columns={columns}
          data={tours}
          itemsPerPage={10}
          onRowClick={handleRowClick}
          emptyMessage="No tours found. Create your first tour to get started."
        />
      )}

      {/* Add Tour Modal */}
      <AddTourModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTourId(null);
          setEditingTourData(undefined);
          setIsViewingTourId(null);
          setViewingTourData(undefined);
        }}
        onSubmit={handleAddTour}
        isLoading={isLoading}
        editingData={isViewingTourId ? viewingTourData : editingTourData}
        readOnly={!!isViewingTourId}
      />
    </div>
  );
}
