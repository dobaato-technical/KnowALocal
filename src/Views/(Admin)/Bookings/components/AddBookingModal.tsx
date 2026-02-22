"use client";

import { getAllShifts, type Shift } from "@/api/shifts/shifts";
import { getToursPreview } from "@/api/tours/tours";
import Button from "@/components/ui/button";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  isLoading?: boolean;
}

export interface BookingFormData {
  tour_id: number;
  date: string;
  shift_id: number;
  payment_info: string;
  status: string;
  additional_info: string;
}

const initialFormData: BookingFormData = {
  tour_id: 0,
  date: "",
  shift_id: 0,
  payment_info: "",
  status: "pending",
  additional_info: "",
};

export default function AddBookingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddBookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [tours, setTours] = useState<any[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch tours and shifts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTours();
      fetchShifts();
    }
  }, [isOpen]);

  const fetchTours = async () => {
    setLoadingTours(true);
    try {
      const response = await getToursPreview();
      if (response.success) {
        setTours(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
    } finally {
      setLoadingTours(false);
    }
  };

  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const response = await getAllShifts();
      if (response.success) {
        setShifts(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching shifts:", err);
    } finally {
      setLoadingShifts(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tour_id) {
      newErrors.tour_id = "Please select a tour";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    if (!formData.shift_id) {
      newErrors.shift_id = "Please select a shift";
    }
    if (!formData.status) {
      newErrors.status = "Please select a status";
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "tour_id" || name === "shift_id") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tour Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tour *
            </label>
            {loadingTours ? (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                Loading tours...
              </div>
            ) : (
              <select
                name="tour_id"
                value={formData.tour_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tour_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select a tour...</option>
                {tours.map((tour) => (
                  <option key={tour._id} value={tour._id}>
                    {tour.title}
                  </option>
                ))}
              </select>
            )}
            {errors.tour_id && (
              <p className="text-red-500 text-sm mt-1">{errors.tour_id}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Shift Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shift *
            </label>
            {loadingShifts ? (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                Loading shifts...
              </div>
            ) : (
              <select
                name="shift_id"
                value={formData.shift_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shift_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select a shift...</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </option>
                ))}
              </select>
            )}
            {errors.shift_id && (
              <p className="text-red-500 text-sm mt-1">{errors.shift_id}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Payment Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Info
            </label>
            <input
              type="text"
              name="payment_info"
              value={formData.payment_info}
              onChange={handleInputChange}
              placeholder="Enter payment information"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Info
            </label>
            <textarea
              name="additional_info"
              value={formData.additional_info}
              onChange={handleInputChange}
              placeholder="Enter any additional information"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || loadingTours || loadingShifts}
            >
              {isLoading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
