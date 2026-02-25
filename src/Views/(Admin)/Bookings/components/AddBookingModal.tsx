"use client";

import {
  checkDateAvailability,
  checkShiftConflicts,
  getAllShifts,
  getToursPreview,
  type SelectedSpecialty,
  type Shift,
  type TourPreview,
} from "@/api";
import Button from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";
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
  booking_status: string;
  additional_info: string;
  customer_name: string;
  customer_email: string;
  guest_number: number;
  tour_price: number;
  selected_specialties: SelectedSpecialty[];
}

const initialFormData: BookingFormData = {
  tour_id: 0,
  date: "",
  shift_id: 0,
  payment_info: "",
  booking_status: "confirmed",
  additional_info: "",
  customer_name: "",
  customer_email: "",
  guest_number: 1,
  tour_price: 0,
  selected_specialties: [],
};

export default function AddBookingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddBookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateAvailability, setDateAvailability] = useState<{
    isChecking: boolean;
    isAvailable: boolean;
    reason?: string;
  }>({ isChecking: false, isAvailable: true });
  const [shiftAvailability, setShiftAvailability] = useState<{
    isChecking: boolean;
    isAvailable: boolean;
    reason?: string;
  }>({ isChecking: false, isAvailable: true });

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

  const checkAvailability = async (date: string) => {
    if (!date) {
      setDateAvailability({ isChecking: false, isAvailable: true });
      return;
    }

    setDateAvailability((prev) => ({ ...prev, isChecking: true }));
    try {
      const response = await checkDateAvailability(date);

      if (response.success && response.data) {
        setDateAvailability({
          isChecking: false,
          isAvailable: response.data.isAvailable,
          reason: response.data.reason,
        });
      } else {
        setDateAvailability({
          isChecking: false,
          isAvailable: false,
          reason: "Failed to check availability",
        });
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setDateAvailability({
        isChecking: false,
        isAvailable: false,
        reason: "Error checking availability",
      });
    }
  };

  const checkShiftAvailability = async (date: string, shiftId: number) => {
    if (!date || !shiftId) {
      setShiftAvailability({ isChecking: false, isAvailable: true });
      return;
    }

    setShiftAvailability((prev) => ({ ...prev, isChecking: true }));
    try {
      const response = await checkShiftConflicts(date, shiftId);

      if (response.success && response.data) {
        const hasConflict = response.data.hasConflict;
        const reasonMap: Record<string, string> = {
          CONFLICT_WITH_EXISTING_BOOKING:
            "Cannot book whole day - another booking already exists for this date",
          DATE_ALREADY_BOOKED:
            "This date is no longer available - a booking already exists",
          INVALID_SHIFT: "Invalid shift selected",
        };

        setShiftAvailability({
          isChecking: false,
          isAvailable: !hasConflict,
          reason: hasConflict
            ? reasonMap[response.data.reason || ""] ||
              "This shift is not available"
            : undefined,
        });
      } else {
        setShiftAvailability({
          isChecking: false,
          isAvailable: false,
          reason: "Failed to check shift availability",
        });
      }
    } catch (err) {
      console.error("Error checking shift availability:", err);
      setShiftAvailability({
        isChecking: false,
        isAvailable: false,
        reason: "Error checking shift availability",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tour_id) newErrors.tour_id = "Please select a tour";
    if (!formData.date) newErrors.date = "Please select a date";
    if (!dateAvailability.isAvailable)
      newErrors.date = `This date is not available: ${dateAvailability.reason || "No bookings allowed"}`;
    if (!formData.shift_id) newErrors.shift_id = "Please select a shift";
    if (!shiftAvailability.isAvailable)
      newErrors.shift_id = `This shift is not available: ${shiftAvailability.reason || "Conflict with existing booking"}`;
    if (!formData.booking_status)
      newErrors.booking_status = "Please select a status";
    if (!formData.customer_name.trim())
      newErrors.customer_name = "Customer name is required";
    if (
      !formData.customer_email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)
    )
      newErrors.customer_email = "Valid email is required";
    if (formData.guest_number < 1)
      newErrors.guest_number = "At least 1 guest required";

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

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "tour_id" || name === "shift_id" || name === "guest_number") {
      const numVal = Number(value);
      if (name === "tour_id") {
        // Reset specialties + set base price when tour changes
        const tour = tours.find((t) => t._id === value);
        setFormData({
          ...formData,
          tour_id: numVal,
          tour_price: tour?.basePrice || 0,
          selected_specialties: [],
        });
      } else {
        setFormData({ ...formData, [name]: numVal });
      }
      if (name === "shift_id" && formData.date && Number(value)) {
        checkShiftAvailability(formData.date, Number(value));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "date") {
      checkAvailability(value);
      if (formData.shift_id) {
        checkShiftAvailability(value, formData.shift_id);
      }
    }
  };

  const selectedTour = tours.find((t) => t._id === formData.tour_id.toString());
  const tourSpecialties =
    selectedTour?.specialties?.filter((s) => s.name?.trim()) || [];

  const handleSpecialtyToggle = (spec: SelectedSpecialty) => {
    setFormData((prev) => {
      const isSelected = prev.selected_specialties.some(
        (s) => s.name === spec.name,
      );
      return {
        ...prev,
        selected_specialties: isSelected
          ? prev.selected_specialties.filter((s) => s.name !== spec.name)
          : [...prev.selected_specialties, spec],
      };
    });
  };

  const specialtiesTotal = formData.selected_specialties.reduce(
    (sum, s) => sum + (s.price || 0),
    0,
  );
  const totalPrice = formData.tour_price + specialtiesTotal;

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
                    {tour.basePrice ? ` — $${tour.basePrice}` : ""}
                  </option>
                ))}
              </select>
            )}
            {errors.tour_id && (
              <p className="text-red-500 text-sm mt-1">{errors.tour_id}</p>
            )}
          </div>

          {/* Optional Add-ons (specialties) */}
          {tourSpecialties.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add-ons{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="space-y-2">
                {tourSpecialties.map((spec) => {
                  const isSelected = formData.selected_specialties.some(
                    (s) => s.name === spec.name,
                  );
                  return (
                    <button
                      key={spec.name}
                      type="button"
                      onClick={() =>
                        handleSpecialtyToggle({
                          name: spec.name,
                          price: spec.price,
                          description: spec.description,
                        })
                      }
                      className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 shrink-0"
                        />
                      ) : (
                        <Circle size={16} className="text-gray-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-800">
                          {spec.name}
                        </span>
                        {spec.description && (
                          <span className="text-xs text-gray-500 ml-2">
                            {spec.description}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 shrink-0">
                        {spec.price > 0 ? `+$${spec.price}` : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

            {/* Availability Status */}
            {formData.date && (
              <div className="mt-2 flex items-center gap-2">
                {dateAvailability.isChecking ? (
                  <p className="text-gray-600 text-sm">
                    Checking availability...
                  </p>
                ) : dateAvailability.isAvailable ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="text-green-600 text-sm font-medium">
                      Available for booking
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-red-600 text-sm font-medium">
                      Not available: {dateAvailability.reason}
                    </p>
                  </div>
                )}
              </div>
            )}

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

            {/* Shift Availability Status */}
            {formData.shift_id && formData.date && (
              <div className="mt-2 flex items-center gap-2">
                {shiftAvailability.isChecking ? (
                  <p className="text-gray-600 text-sm">
                    Checking shift availability...
                  </p>
                ) : shiftAvailability.isAvailable ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="text-green-600 text-sm font-medium">
                      ✓ Available for booking
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-red-600 text-sm font-medium">
                      ✗ Not available: {shiftAvailability.reason}
                    </p>
                  </div>
                )}
              </div>
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
              name="booking_status"
              value={formData.booking_status}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.booking_status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.booking_status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.booking_status}
              </p>
            )}
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                placeholder="Full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.customer_email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer_email}
                </p>
              )}
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Guests *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    guest_number: Math.max(1, p.guest_number - 1),
                  }))
                }
                disabled={formData.guest_number <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 font-bold text-lg hover:border-blue-400 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-gray-900">
                {formData.guest_number}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    guest_number: p.guest_number + 1,
                  }))
                }
                className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 font-bold text-lg hover:border-blue-400"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                {formData.guest_number === 1 ? "person" : "people"}
              </span>
            </div>
            {errors.guest_number && (
              <p className="text-red-500 text-sm mt-1">{errors.guest_number}</p>
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
              placeholder="Any special requests or notes"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Price Summary */}
          {formData.tour_price > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tour base price</span>
                <span className="font-medium">${formData.tour_price}</span>
              </div>
              {formData.selected_specialties.map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="text-gray-600">+ {s.name}</span>
                  <span className="font-medium">${s.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span className="text-blue-600">${totalPrice}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                isLoading ||
                loadingTours ||
                loadingShifts ||
                !dateAvailability.isAvailable
              }
            >
              {isLoading
                ? "Creating..."
                : `Create Booking${totalPrice > 0 ? ` — $${totalPrice}` : ""}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
