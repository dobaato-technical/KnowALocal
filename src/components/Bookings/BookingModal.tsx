"use client";

import {
  checkShiftSlotAvailability,
  getAllShifts,
  getDisabledShiftsForDate,
  getToursPreview,
  getUnavailableDatesForMonth,
  type Shift,
  type TourPreview,
} from "@/api";
import { showToast } from "@/lib/toast-utils";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface BookingModalProps {
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

export default function BookingModal({
  isOpen,
  onClose,
  preSelectedTour,
}: BookingModalProps) {
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

  // Fetch initial data
  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [shiftsResponse, toursResponse, unavailableResponse] =
          await Promise.all([
            getAllShifts(),
            getToursPreview(),
            getUnavailableDatesForMonth(currentYear, currentMonth),
          ]);

        if (shiftsResponse.success) {
          setShifts(shiftsResponse.data || []);
        }

        if (toursResponse.success) {
          setTours(toursResponse.data || []);
        }

        if (unavailableResponse.success) {
          setUnavailableDates(unavailableResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showToast("Failed to load booking data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [isOpen, currentYear, currentMonth]);

  // Check shift availability for selected date
  const checkShiftAvailability = useCallback(
    async (date: string) => {
      try {
        const [disabledResponse, availabilityResponses] = await Promise.all([
          getDisabledShiftsForDate(date),
          Promise.all(
            shifts.map((shift) => checkShiftSlotAvailability(date, shift.id)),
          ),
        ]);

        if (disabledResponse.success) {
          setDisabledShiftIds(disabledResponse.data || []);
        }

        const availabilityMap = new Map<number, ShiftAvailability>();

        availabilityResponses.forEach((response, index) => {
          const shift = shifts[index];
          if (response.success && response.data && shift) {
            availabilityMap.set(shift.id, {
              shiftId: shift.id,
              hasSlots: response.data.hasSlots,
              bookedCount: response.data.bookedCount,
              availableSlots: response.data.availableSlots,
            });
          }
        });

        setShiftAvailability(availabilityMap);
      } catch (error) {
        console.error("Error checking shift availability:", error);
        showToast("Failed to check shift availability", "error");
      }
    },
    [shifts],
  );

  // Handle date selection
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (date && !unavailableDates.includes(date)) {
      setSelectedDate(date);
      setSelectedBooking((prev) => ({ ...prev, date, shift: null }));
      checkShiftAvailability(date);
    } else if (unavailableDates.includes(date)) {
      showToast("This date is not available", "error");
    }
  };

  const handleShiftClick = (shift: Shift) => {
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

    try {
      setIsBooking(true);

      const response = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: parseInt(selectedBooking.tour._id, 10),
          shift_id: selectedBooking.shift.id,
          date: selectedBooking.date,
          tour_price: selectedBooking.tour.basePrice,
          tour_title: selectedBooking.tour.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to proceed to payment",
        "error",
      );
      setIsBooking(false);
    }
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

  // Get minimum date (today)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold text-primary">Book Your Tour</h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-accent transition-colors p-2 hover:bg-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary/70">Loading booking data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Select a Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate || ""}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-accent focus:outline-none bg-white"
                />
                {selectedDate && (
                  <div className="mt-2 p-2 bg-gradient-to-br from-accent/10 to-primary/5 rounded border border-accent/20">
                    <p className="text-xs text-secondary/70 mb-1">
                      Selected Date
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {dateFormatted}
                    </p>
                    <p
                      className={`text-xs font-semibold mt-2 w-fit px-2 py-1 rounded ${
                        isDateAvailable
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {isDateAvailable ? "✓ Available" : "✗ Unavailable"}
                    </p>
                  </div>
                )}
              </div>

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
                              <span className="font-semibold text-primary">
                                {shift.name}
                              </span>
                              {isDisabled && (
                                <span className="ml-auto text-xs text-red-600 font-semibold">
                                  Whole Day Booked
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-secondary/70">
                              {shift.startTime} - {shift.endTime}
                            </p>
                            {availability && (
                              <p
                                className={`text-xs mt-1 font-semibold ${
                                  availability.hasSlots
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {availability.hasSlots
                                  ? "✓ Available"
                                  : "✗ Full"}
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
                    className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:opacity-90 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isBooking ? "Processing..." : "💳 Proceed to Payment"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
