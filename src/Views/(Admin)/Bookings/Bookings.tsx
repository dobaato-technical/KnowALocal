"use client";

import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  type BookingWithDetails,
} from "@/api/bookings/bookings";
import Button from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { showToast } from "@/lib/toast-utils";
import { Eye, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddBookingModal, {
  type BookingFormData,
} from "./components/AddBookingModal";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [statusBeingUpdated, setStatusBeingUpdated] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  // Fetch bookings on mount
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("=== fetchBookings START ===");

      const response = await getAllBookings();

      if (!response.success) {
        console.error("Failed to fetch bookings:", response.message);
        setError(response.message);
        setBookings([]);
        return;
      }

      console.log("Bookings fetched successfully:", response.data);
      setBookings(response.data || []);

      console.log("=== fetchBookings END (SUCCESS) ===");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("An error occurred while fetching bookings");
      setBookings([]);
      console.log("=== fetchBookings END (ERROR) ===");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleViewDetails = async (booking: BookingWithDetails) => {
    console.log("=== handleViewDetails START ===");
    console.log("Selected booking:", booking);

    try {
      console.log("Fetching full booking details for ID:", booking.id);

      const response = await getBookingById(booking.id);

      console.log(
        "Fetch response - data:",
        response.data,
        "error:",
        response.success ? "none" : response.message,
      );

      if (!response.success || !response.data) {
        console.error("Failed to fetch booking details");
        showToast("Failed to fetch booking details", "error");
        console.log("=== handleViewDetails END (ERROR) ===");
        return;
      }

      console.log("Booking details fetched successfully:", response.data);

      setSelectedBooking(response.data);
      setShowDetails(true);

      console.log("Modal opened with booking ID:", booking.id);
      console.log("=== handleViewDetails END (SUCCESS) ===");
    } catch (err) {
      console.error("Error fetching booking details:", err);
      console.log("=== handleViewDetails END (ERROR) ===");
      showToast("An error occurred while fetching booking details", "error");
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    console.log("=== handleStatusChange START ===");
    console.log("Booking ID:", bookingId);
    console.log("New status:", newStatus);

    try {
      setStatusBeingUpdated(newStatus);

      const response = await updateBookingStatus(bookingId, newStatus);

      console.log("Update response - success:", response.success);

      if (!response.success) {
        console.error("Failed to update booking status:", response.message);
        showToast(`Failed to update booking: ${response.message}`, "error");
        console.log("=== handleStatusChange END (ERROR) ===");
        return;
      }

      console.log("Booking status updated successfully");

      // Update bookings list
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );

      // Update selected booking if it's the one being edited
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }

      showToast("Booking status updated successfully", "success");
      console.log("=== handleStatusChange END (SUCCESS) ===");
    } catch (err) {
      console.error("Error updating booking status:", err);
      console.log("=== handleStatusChange END (ERROR) ===");
      showToast("An error occurred while updating booking status", "error");
    } finally {
      setStatusBeingUpdated(null);
    }
  };

  const handleDelete = async (bookingId: number, bookingLabel: string) => {
    if (!confirm(`Are you sure you want to delete booking ${bookingLabel}?`)) {
      return;
    }

    console.log("=== handleDelete START ===");
    console.log("Deleting booking with ID:", bookingId);

    try {
      const response = await deleteBooking(bookingId);

      console.log("Delete response - success:", response.success);

      if (!response.success) {
        console.error("Failed to delete booking:", response.message);
        showToast(`Failed to delete booking: ${response.message}`, "error");
        console.log("=== handleDelete END (ERROR) ===");
        return;
      }

      console.log("Booking deleted successfully");

      setBookings(bookings.filter((b) => b.id !== bookingId));

      if (selectedBooking?.id === bookingId) {
        setShowDetails(false);
        setSelectedBooking(null);
      }

      showToast("Booking deleted successfully", "success");
      console.log("=== handleDelete END (SUCCESS) ===");
    } catch (err) {
      console.error("Error deleting booking:", err);
      console.log("=== handleDelete END (ERROR) ===");
      showToast("An error occurred while deleting the booking", "error");
    }
  };

  const handleAddBooking = async (bookingData: BookingFormData) => {
    console.log("=== handleAddBooking START ===");
    console.log("booking data:", bookingData);

    setIsLoadingModal(true);
    try {
      console.log("Creating booking...");

      const payload = {
        tour_id: bookingData.tour_id,
        date: bookingData.date,
        shift_id: bookingData.shift_id,
        payment_info: bookingData.payment_info,
        status: bookingData.status,
        additional_info: bookingData.additional_info,
      };

      console.log("Payload:", payload);

      const response = await createBooking(payload);

      console.log("Response:", response);

      if (!response.success) {
        console.error("Failed to create booking:", response.message);
        showToast(`Failed to create booking: ${response.message}`, "error");
        console.log("=== handleAddBooking END (ERROR) ===");
        return;
      }

      console.log("Booking created successfully!");

      // Refresh bookings list
      console.log("Fetching bookings...");
      await fetchBookings();

      // Close modal
      setIsModalOpen(false);

      showToast("Booking created successfully!", "success");

      console.log("=== handleAddBooking END (SUCCESS) ===");
    } catch (error) {
      console.error("Error creating booking:", error);
      console.log("=== handleAddBooking END (ERROR) ===");
      showToast("An error occurred while creating the booking", "error");
    } finally {
      setIsLoadingModal(false);
    }
  };

  // Filter bookings based on status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const columns: Column<BookingWithDetails>[] = [
    {
      key: "id",
      label: "Booking ID",
      render: (value) => `#${value}`,
      className: "font-semibold",
    },
    {
      key: "tourTitle",
      label: "Tour",
    },
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "shiftName",
      label: "Shift",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
            value,
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id, `#${row.id}`)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
            title="Delete booking"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (row: BookingWithDetails) => {
    console.log("Row clicked:", row);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bookings Management
            </h1>
            <p className="text-gray-600">View and manage all tour bookings</p>
          </div>
        </div>

        {/* Loading State */}
        <div className="rounded-lg bg-blue-50 p-8 text-center text-blue-800">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="text-gray-600">View and manage all tour bookings</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add New Booking</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {["all", "pending", "confirmed", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ),
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
      )}

      {/* Table */}
      <Table<BookingWithDetails>
        columns={columns}
        data={filteredBookings}
        itemsPerPage={10}
        onRowClick={handleRowClick}
        emptyMessage="No bookings found."
      />

      {/* Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking Details
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Booking ID
                  </label>
                  <p className="text-gray-900 font-medium">
                    #{selectedBooking.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Tour
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedBooking.tourTitle}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Date
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(selectedBooking.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Shift
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedBooking.shiftName}
                    {selectedBooking.shiftStartTime &&
                      selectedBooking.shiftEndTime && (
                        <span className="text-gray-600 text-sm ml-2">
                          ({selectedBooking.shiftStartTime.slice(0, 5)} -{" "}
                          {selectedBooking.shiftEndTime.slice(0, 5)})
                        </span>
                      )}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Status
                </label>
                <div className="flex gap-2 mt-2">
                  {["pending", "confirmed", "completed", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusChange(selectedBooking.id, status)
                        }
                        disabled={statusBeingUpdated !== null}
                        className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors disabled:opacity-50 ${
                          selectedBooking.status === status
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {selectedBooking.payment_info && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Payment Info
                  </label>
                  <p className="text-gray-900 text-sm wrap-break-word">
                    {selectedBooking.payment_info}
                  </p>
                </div>
              )}

              {selectedBooking.additional_info && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Additional Info
                  </label>
                  <p className="text-gray-900 text-sm wrap-break-word">
                    {selectedBooking.additional_info}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Created
                </label>
                <p className="text-gray-900 text-sm">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <button
                onClick={() => {
                  handleDelete(selectedBooking.id, `#${selectedBooking.id}`);
                  setShowDetails(false);
                }}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBooking}
        isLoading={isLoadingModal}
      />
    </div>
  );
}
