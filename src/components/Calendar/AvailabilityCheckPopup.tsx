"use client";

import { getUnavailableDatesForMonth } from "@/api/availability/availability";
import {
  checkShiftSlotAvailability,
  createBooking,
  getDisabledShiftsForDate,
} from "@/api/bookings/bookings";
import { getAllShifts, type Shift } from "@/api/shifts/shifts";
import { getToursPreview, type TourPreview } from "@/api/tours/tours";
import { showToast } from "@/lib/toast-utils";
import { Clock, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Calendar from "./Calendar";

interface AvailabilityCheckPopupProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTour?: TourPreview | null;
}

interface SelectedBooking {
  date: string | null;
  shift: Shift | null;
  tour: TourPreview | null;
}

interface ShiftAvailability {
  shiftId: number;
  hasSlots: boolean;
  bookedCount: number;
  availableSlots: number;
}

export default function AvailabilityCheckPopup({
  isOpen,
  onClose,
  preSelectedTour,
}: AvailabilityCheckPopupProps) {
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [disabledShiftIds, setDisabledShiftIds] = useState<number[]>([]);
  const [shiftAvailability, setShiftAvailability] = useState<
    Map<number, ShiftAvailability>
  >(new Map());

  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking>({
    date: null,
    shift: null,
    tour: preSelectedTour || null,
  });

  // Fetch unavailable dates
  const fetchUnavailableDates = useCallback(async () => {
    try {
      const response = await getUnavailableDatesForMonth(
        currentYear,
        currentMonth,
      );
      if (response.success) {
        setUnavailableDates(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
      showToast("Failed to load availability", "error");
    }
  }, [currentYear, currentMonth]);

  // Fetch shifts (only once)
  const fetchShifts = useCallback(async () => {
    try {
      const response = await getAllShifts();
      if (response.success) {
        const activeShifts = (response.data || []).filter(
          (shift: Shift) => shift.isActive,
        );
        setShifts(activeShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      showToast("Failed to load shifts", "error");
    }
  }, []);

  // Fetch tours (only once)
  const fetchTours = useCallback(async () => {
    try {
      const response = await getToursPreview();
      if (response.success) {
        setTours(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      showToast("Failed to load tours", "error");
    }
  }, []);

  // Check shift availability for selected date
  const checkShiftAvailability = useCallback(
    async (date: string) => {
      try {
        const disabledResponse = await getDisabledShiftsForDate(date);
        if (disabledResponse.success) {
          setDisabledShiftIds(disabledResponse.data || []);
        }

        const availabilityMap = new Map<number, ShiftAvailability>();

        for (const shift of shifts) {
          const response = await checkShiftSlotAvailability(date, shift.id);
          if (response.success && response.data) {
            availabilityMap.set(shift.id, {
              shiftId: shift.id,
              hasSlots: response.data.hasSlots,
              bookedCount: response.data.bookedCount,
              availableSlots: response.data.availableSlots,
            });
          }
        }

        setShiftAvailability(availabilityMap);
      } catch (error) {
        console.error("Error checking shift availability:", error);
        showToast("Failed to check shift availability", "error");
      }
    },
    [shifts],
  );

  // Initial load
  useEffect(() => {
    if (isOpen && loading) {
      Promise.all([fetchUnavailableDates(), fetchShifts(), fetchTours()]).then(
        () => {
          setLoading(false);
        },
      );
    }
  }, [isOpen, loading, fetchUnavailableDates, fetchShifts, fetchTours]);

  // Fetch unavailable dates when month changes
  useEffect(() => {
    if (isOpen && !loading) {
      fetchUnavailableDates();
    }
  }, [currentYear, currentMonth, isOpen, loading, fetchUnavailableDates]);

  // Check shift availability when date is selected
  useEffect(() => {
    if (selectedDate) {
      checkShiftAvailability(selectedDate);
    }
  }, [selectedDate, checkShiftAvailability]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedBooking((prev) => ({ ...prev, date, shift: null }));
  };

  const handleShiftClick = (shift: Shift) => {
    // Don't allow clicking disabled shifts
    if (disabledShiftIds.includes(shift.id)) {
      showToast(
        "This shift is disabled because a whole day booking exists",
        "error",
      );
      return;
    }

    setSelectedBooking((prev) => ({
      ...prev,
      shift: prev.shift?.id === shift.id ? null : shift,
    }));
  };

  const handleTourSelect = (tour: TourPreview) => {
    setSelectedBooking((prev) => ({
      ...prev,
      tour: prev.tour?._id === tour._id ? null : tour,
    }));
  };

  const handleBookTour = async () => {
    if (
      !selectedBooking.date ||
      !selectedBooking.shift ||
      !selectedBooking.tour
    ) {
      showToast("Please select a date, shift, and tour", "error");
      return;
    }

    setIsBooking(true);
    try {
      // Extract tour ID from _id (format is "id")
      const tourId = parseInt(selectedBooking.tour._id, 10);

      if (isNaN(tourId)) {
        showToast("Invalid tour selected", "error");
        setIsBooking(false);
        return;
      }

      // Create booking
      const bookingResponse = await createBooking({
        tour_id: tourId,
        date: selectedBooking.date,
        shift_id: selectedBooking.shift.id,
        payment_info: "", // Will be filled during checkout
        status: "pending",
        additional_info: "",
      });

      if (bookingResponse.success) {
        showToast(
          `Booking created successfully! Booking ID: ${bookingResponse.data?.id}`,
          "success",
        );

        // Store booking data for reference
        const bookingData = {
          date: selectedBooking.date,
          shift: selectedBooking.shift,
          tour: selectedBooking.tour,
          bookingId: bookingResponse.data?.id,
        };

        localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

        // Close modal after successful booking
        const tourIdStr = selectedBooking.tour._id;
        setTimeout(() => {
          onClose();
          // Optionally navigate to tour details or booking confirmation
          window.location.href = `/tour-details/${tourIdStr}`;
        }, 1500);
      } else {
        showToast(
          bookingResponse.message || "Failed to create booking",
          "error",
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to create booking",
        "error",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  if (!isOpen) return null;

  const isDateAvailable =
    selectedDate && !unavailableDates.includes(selectedDate);
  const dateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold text-primary">
            Check Availability & Book Your Tour
          </h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-accent transition-colors p-2 hover:bg-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar - Left Column */}
            <div className="lg:col-span-2">
              <Calendar
                unavailableDates={unavailableDates}
                onDateClick={handleDateClick}
                selectedDate={selectedDate || undefined}
                currentYear={currentYear}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
              />
            </div>

            {/* Right Sidebar - Shifts & Tours */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Date Info */}
              {selectedDate && (
                <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-lg p-4 border border-accent/20">
                  <p className="text-sm text-secondary/70 mb-1">
                    Selected Date
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {dateFormatted}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      isDateAvailable
                        ? "text-green-700 bg-green-100 px-2 py-1 rounded w-fit"
                        : "text-red-700 bg-red-100 px-2 py-1 rounded w-fit"
                    }`}
                  >
                    {isDateAvailable ? "✓ Available" : "✗ Unavailable"}
                  </p>
                </div>
              )}

              {/* Shifts Section */}
              {selectedDate && isDateAvailable && (
                <div>
                  <h3 className="font-bold text-lg text-primary mb-3">
                    Available Shifts
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {shifts.length > 0 ? (
                      shifts.map((shift) => {
                        const availability = shiftAvailability.get(shift.id);
                        const isDisabled = disabledShiftIds.includes(shift.id);
                        const isSelected =
                          selectedBooking.shift?.id === shift.id;

                        return (
                          <button
                            key={shift.id}
                            onClick={() => handleShiftClick(shift)}
                            disabled={isDisabled}
                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? "border-accent bg-accent/10"
                                : isDisabled
                                  ? "border-red-300 bg-red-50 opacity-60 cursor-not-allowed"
                                  : "border-secondary/20 bg-white hover:border-secondary/40"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-accent" />
                              <span className="font-semibold text-primary">
                                {shift.name}
                              </span>
                              {isDisabled && (
                                <span className="ml-auto text-xs text-red-600 font-semibold">
                                  Whole Day Booked
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-secondary/70 ml-6">
                              {shift.startTime} - {shift.endTime}
                            </p>
                            {availability && (
                              <p
                                className={`text-xs mt-1 ml-6 font-semibold ${
                                  availability.hasSlots
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {availability.hasSlots
                                  ? `${availability.availableSlots} slots available`
                                  : "No slots available"}
                              </p>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-secondary/70 text-center py-4">
                        No shifts available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tours Selection */}
              {selectedBooking.shift && (
                <div>
                  <h3 className="font-bold text-lg text-primary mb-3">
                    Select a Tour
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tours.length > 0 ? (
                      tours.map((tour) => (
                        <button
                          key={tour._id}
                          onClick={() => handleTourSelect(tour)}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            selectedBooking.tour?._id === tour._id
                              ? "border-accent bg-accent/10"
                              : "border-secondary/20 bg-white hover:border-secondary/40"
                          }`}
                        >
                          <p className="font-semibold text-primary text-sm">
                            {tour.title}
                          </p>
                          {tour.basePrice && (
                            <p className="text-xs text-accent font-bold mt-1">
                              ${tour.basePrice}
                            </p>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-secondary/70 text-center py-4">
                        No tours available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Summary & CTA */}
              {selectedBooking.date && (
                <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-secondary/70">
                      <span className="font-semibold">Date:</span>{" "}
                      {dateFormatted}
                    </p>
                    {selectedBooking.shift && (
                      <p className="text-xs text-secondary/70">
                        <span className="font-semibold">Shift:</span>{" "}
                        {selectedBooking.shift.name}
                      </p>
                    )}
                    {selectedBooking.tour && (
                      <p className="text-xs text-secondary/70">
                        <span className="font-semibold">Tour:</span>{" "}
                        {selectedBooking.tour.title}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleBookTour}
                    disabled={
                      !selectedBooking.date ||
                      !selectedBooking.shift ||
                      !selectedBooking.tour ||
                      isBooking
                    }
                    className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:opacity-90 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>
                        Creating Booking...
                      </>
                    ) : (
                      "Book This Tour"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
