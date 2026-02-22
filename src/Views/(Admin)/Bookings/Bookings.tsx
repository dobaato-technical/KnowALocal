"use client";

import {
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  type BookingWithDetails,
} from "@/api/bookings/bookings";
import Button from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const response = await getAllBookings();
    if (response.success) {
      setBookings(response.data || []);
    } else {
      console.error("Failed to fetch bookings:", response.message);
    }
    setLoading(false);
  };

  const handleViewDetails = async (booking: BookingWithDetails) => {
    const response = await getBookingById(booking.id);
    if (response.success && response.data) {
      setSelectedBooking(response.data);
      setShowDetails(true);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    const response = await updateBookingStatus(bookingId, newStatus);
    if (response.success) {
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      alert("Booking status updated successfully");
    } else {
      alert("Failed to update booking status");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const response = await deleteBooking(id);
      if (response.success) {
        setBookings(bookings.filter((b) => b.id !== id));
        if (selectedBooking?.id === id) {
          setShowDetails(false);
          setSelectedBooking(null);
        }
        alert("Booking deleted successfully");
      } else {
        alert("Failed to delete booking");
      }
    }
  };

  // Filter bookings based on status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-secondary/70">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Manage Bookings
          </h1>
          <p className="text-secondary/70">View and manage all tour bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-accent text-primary"
                    : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-secondary/10 p-12 text-center">
            <p className="text-secondary/70">
              No bookings found{" "}
              {filterStatus !== "all" && `with status "${filterStatus}"`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-secondary/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/5 border-b border-secondary/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Tour
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Shift
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-secondary/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-primary">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {booking.tourTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {booking.shiftName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-secondary" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete booking"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Booking Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Booking ID
                  </label>
                  <p className="text-primary font-medium">
                    #{selectedBooking.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Tour
                  </label>
                  <p className="text-primary font-medium">
                    {selectedBooking.tourTitle}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Date
                  </label>
                  <p className="text-primary font-medium">
                    {new Date(selectedBooking.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Shift
                  </label>
                  <p className="text-primary font-medium">
                    {selectedBooking.shiftName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Status
                  </label>
                  <div className="flex gap-2 mt-2">
                    {["pending", "confirmed", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusChange(selectedBooking.id, status)
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                          selectedBooking.status === status
                            ? "bg-accent text-primary"
                            : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedBooking.payment_info && (
                  <div>
                    <label className="text-sm font-semibold text-secondary/70">
                      Payment Info
                    </label>
                    <p className="text-primary text-sm break-words">
                      {selectedBooking.payment_info}
                    </p>
                  </div>
                )}

                {selectedBooking.additional_info && (
                  <div>
                    <label className="text-sm font-semibold text-secondary/70">
                      Additional Info
                    </label>
                    <p className="text-primary text-sm break-words">
                      {selectedBooking.additional_info}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-secondary/70">
                    Created
                  </label>
                  <p className="text-primary text-sm">
                    {new Date(selectedBooking.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-secondary/10 text-primary hover:bg-secondary/20"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(selectedBooking.id);
                    setShowDetails(false);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
