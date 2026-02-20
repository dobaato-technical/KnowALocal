"use client";

import Button from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Edit2, Plus, Trash2 } from "lucide-react";
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
}

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tours from Supabase on component mount
  const fetchTours = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tours")
        .select(
          "id, title, duration, price, group_size, featured, created_at",
        )
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
          <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors">
            <Edit2 size={16} />
          </button>
          <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors">
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
    setIsLoading(true);
    try {
      // Call backend API route to create the tour (uses service role key)
      const response = await fetch("/api/tours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Failed to create tour:", result.message);
        // TODO: Show error toast
        return;
      }

      // Refresh tours list
      await fetchTours();
      setIsModalOpen(false);
      console.log("Tour created successfully!", result.data?.id);
      // TODO: Show success toast
    } catch (error) {
      console.error("Error creating tour:", error);
      // TODO: Show error toast
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
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
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
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTour}
        isLoading={isLoading}
      />
    </div>
  );
}
