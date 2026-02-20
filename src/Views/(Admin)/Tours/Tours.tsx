"use client";

import Button from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import AddTourModal, { TourFormData } from "./components/AddTourModal";

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  availability: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}

// Sample data - replace with API call later
const sampleTours: Tour[] = [
  {
    id: "1",
    name: "Whale Watching Tour",
    location: "Brier Island",
    duration: "4 hours",
    price: 79.99,
    availability: 12,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Beach Exploration",
    location: "Port Maitland",
    duration: "3 hours",
    price: 49.99,
    availability: 8,
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Lake Adventures",
    location: "Lake District",
    duration: "5 hours",
    price: 89.99,
    availability: 0,
    status: "inactive",
    createdAt: "2024-01-17",
  },
  {
    id: "4",
    name: "Cape Forchu Hiking",
    location: "Cape Forchu",
    duration: "2 hours",
    price: 39.99,
    availability: 15,
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: "5",
    name: "Art & Culture Walk",
    location: "Downtown",
    duration: "3.5 hours",
    price: 59.99,
    availability: 5,
    status: "draft",
    createdAt: "2024-01-19",
  },
  {
    id: "6",
    name: "Sunset Boat Cruise",
    location: "Harbor",
    duration: "2.5 hours",
    price: 69.99,
    availability: 6,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "7",
    name: "Local Cuisine Tour",
    location: "Market Square",
    duration: "3 hours",
    price: 64.99,
    availability: 10,
    status: "active",
    createdAt: "2024-01-21",
  },
  {
    id: "8",
    name: "Photography Walking Tour",
    location: "Historic Area",
    duration: "4 hours",
    price: 74.99,
    availability: 4,
    status: "active",
    createdAt: "2024-01-22",
  },
];

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>(sampleTours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Replace with actual API call to Sanity
      console.log("Creating tour with data:", tourData);

      // Example API structure:
      // const response = await fetch('/api/admin/tours', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(tourData),
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to local state (replace with actual data from Sanity)
      const newTour: Tour = {
        id: Date.now().toString(),
        name: tourData.title,
        location: tourData.location,
        duration: tourData.duration,
        price: tourData.basePrice,
        availability: tourData.maxGroupSize,
        status: tourData.isFeatured ? "active" : "draft",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setTours((prev) => [newTour, ...prev]);
      setIsModalOpen(false);
      // TODO: Show success toast
      console.log("Tour created successfully!");
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

      {/* Table */}
      <Table<Tour>
        columns={columns}
        data={tours}
        itemsPerPage={10}
        onRowClick={handleRowClick}
        emptyMessage="No tours found. Create your first tour to get started."
      />

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
