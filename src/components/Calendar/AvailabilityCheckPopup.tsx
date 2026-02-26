"use client";

import {
  checkShiftSlotAvailability,
  getAllShifts,
  getDisabledShiftsForDate,
  getToursPreview,
  getUnavailableDatesForMonth,
  type SelectedSpecialty,
  type Shift,
  type TourPreview,
} from "@/api";
import CustomerInfoModal from "@/components/Bookings/CustomerInfoModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast-utils";
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Lock,
  Minus,
  Plus,
  Users,
  X,
} from "lucide-react";
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
  bookedCount?: number;
  availableSlots?: number;
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
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [disabledShiftIds, setDisabledShiftIds] = useState<number[]>([]);
  const [shiftAvailability, setShiftAvailability] = useState<
    Map<number, ShiftAvailability>
  >(new Map());

  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking>({
    date: null,
    shift: null,
    tour: preSelectedTour || null,
  });
  const [guestNumber, setGuestNumber] = useState(1);
  const [selectedSpecialties, setSelectedSpecialties] = useState<
    SelectedSpecialty[]
  >([]);

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

  // Dropdown handler for shift select
  const handleShiftSelect = (shiftIdStr: string) => {
    const shift = shifts.find((s) => String(s.id) === shiftIdStr);
    if (!shift) return;
    if (disabledShiftIds.includes(shift.id)) {
      showToast(
        "This shift is disabled because a whole day booking exists",
        "error",
      );
      return;
    }
    const avail = shiftAvailability.get(shift.id);
    if (avail && !avail.hasSlots) {
      showToast("This shift is already fully booked", "error");
      return;
    }
    setSelectedBooking((prev) => ({ ...prev, shift }));
  };

  // Dropdown handler for tour select
  const handleTourSelectById = (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId);
    if (tour) {
      setSelectedBooking((prev) => ({ ...prev, tour }));
      setSelectedSpecialties([]); // reset add-ons when tour changes
      setGuestNumber(1); // reset guest count when tour changes
    }
  };

  const handleSpecialtyToggle = (specialty: SelectedSpecialty) => {
    setSelectedSpecialties((prev) => {
      const isSelected = prev.some((s) => s.name === specialty.name);
      return isSelected
        ? prev.filter((s) => s.name !== specialty.name)
        : [...prev, specialty];
    });
  };

  const handleProceed = async () => {
    if (
      !selectedBooking.date ||
      !selectedBooking.shift ||
      !selectedBooking.tour
    ) {
      showToast("Please select a date, shift, and tour", "error");
      return;
    }

    // Re-check availability right before proceeding to avoid stale UI state
    try {
      setIsCheckingAvailability(true);
      const [disabledRes, availRes] = await Promise.all([
        getDisabledShiftsForDate(selectedBooking.date),
        checkShiftSlotAvailability(
          selectedBooking.date,
          selectedBooking.shift.id,
        ),
      ]);

      if (
        disabledRes.success &&
        (disabledRes.data || []).includes(selectedBooking.shift.id)
      ) {
        showToast(
          "This shift is no longer available — a whole-day booking exists for this date.",
          "error",
        );
        await checkShiftAvailability(selectedBooking.date);
        setSelectedBooking((prev) => ({ ...prev, shift: null }));
        return;
      }

      if (availRes.success && availRes.data && !availRes.data.hasSlots) {
        showToast(
          "This shift was just booked. Please select a different option.",
          "error",
        );
        await checkShiftAvailability(selectedBooking.date);
        setSelectedBooking((prev) => ({ ...prev, shift: null }));
        return;
      }
    } catch {
      showToast("Failed to verify availability. Please try again.", "error");
      return;
    } finally {
      setIsCheckingAvailability(false);
    }

    setShowCustomerModal(true);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const maxGuests = selectedBooking.tour?.maxGroupSize || 99;
  const specialtiesTotal = selectedSpecialties.reduce(
    (sum, s) => sum + (s.price || 0) * guestNumber,
    0,
  );
  const totalPrice = (selectedBooking.tour?.basePrice || 0) + specialtiesTotal;

  if (!isOpen) return null;

  // Step 2: show customer info modal
  if (
    showCustomerModal &&
    selectedBooking.date &&
    selectedBooking.shift &&
    selectedBooking.tour
  ) {
    return (
      <CustomerInfoModal
        selectedDate={selectedBooking.date}
        selectedShift={selectedBooking.shift}
        selectedTour={selectedBooking.tour}
        selectedSpecialties={selectedSpecialties}
        guestNumber={guestNumber}
        onClose={onClose}
        onBack={() => setShowCustomerModal(false)}
      />
    );
  }

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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-linear-to-r from-primary/5 to-accent/5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary leading-tight">
              Book Your Tour
            </h2>
            <p className="text-xs text-secondary/60 mt-0.5 hidden sm:block">
              Pick a date &rarr; choose a shift &rarr; confirm details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-primary hover:text-accent transition-colors p-2 hover:bg-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
              {/* Empty state — prompt user to pick a date */}
              {!selectedDate && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Clock className="w-7 h-7 text-accent" />
                  </div>
                  <p className="font-semibold text-primary mb-1">
                    Pick a date to start
                  </p>
                  <p className="text-sm text-secondary/60">
                    Select an available date on the calendar to see shift
                    options.
                  </p>
                </div>
              )}

              {/* Selected Date Info */}
              {selectedDate && (
                <div className="bg-linear-to-br from-accent/10 to-primary/5 rounded-lg p-4 border border-accent/20">
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
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Clock className="w-4 h-4 text-accent" />
                    Choose a Shift
                  </label>
                  {shifts.length > 0 ? (
                    <>
                      <Select
                        value={
                          selectedBooking.shift
                            ? String(selectedBooking.shift.id)
                            : ""
                        }
                        onValueChange={handleShiftSelect}
                      >
                        <SelectTrigger className="w-full border-secondary/30 focus:ring-accent h-11">
                          <SelectValue placeholder="Select a shift…" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map((shift) => {
                            const isDisabled = disabledShiftIds.includes(
                              shift.id,
                            );
                            const avail = shiftAvailability.get(shift.id);
                            const noSlots = avail && !avail.hasSlots;
                            return (
                              <SelectItem
                                key={shift.id}
                                value={String(shift.id)}
                                disabled={isDisabled || !!noSlots}
                                className="py-2.5"
                              >
                                <span className="flex flex-col">
                                  <span className="font-medium">
                                    {shift.name} — {shift.startTime} →{" "}
                                    {shift.endTime}
                                    {isDisabled && (
                                      <span className="ml-2 text-xs text-red-500">
                                        (Whole Day Booked)
                                      </span>
                                    )}
                                    {!isDisabled && noSlots && (
                                      <span className="ml-2 text-xs text-red-500">
                                        (Fully Booked)
                                      </span>
                                    )}
                                  </span>
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {/* Availability helper text */}
                      {selectedBooking.shift &&
                        (() => {
                          const avail = shiftAvailability.get(
                            selectedBooking.shift.id,
                          );
                          const isDisabled = disabledShiftIds.includes(
                            selectedBooking.shift.id,
                          );
                          if (isDisabled) {
                            return (
                              <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                                ✗ Whole day is booked — please pick another
                                date.
                              </p>
                            );
                          }
                          if (!avail) return null;
                          return (
                            <p
                              className={`text-xs font-semibold px-3 py-2 rounded-md border ${
                                avail.hasSlots
                                  ? "text-green-700 bg-green-50 border-green-200"
                                  : "text-red-600 bg-red-50 border-red-200"
                              }`}
                            >
                              {avail.hasSlots
                                ? `✓ ${avail.availableSlots} slot${avail.availableSlots === 1 ? "" : "s"} available`
                                : "✗ No slots available — shift is fully booked"}
                            </p>
                          );
                        })()}
                    </>
                  ) : (
                    <p className="text-sm text-secondary/70 text-center py-3 bg-gray-50 rounded-md">
                      No shifts available for this date.
                    </p>
                  )}
                </div>
              )}

              {/* Tours Selection */}
              {selectedBooking.shift && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                    {preSelectedTour ? (
                      <Lock className="w-4 h-4 text-secondary/50" />
                    ) : (
                      <span className="w-4 h-4 text-accent inline-flex items-center justify-center text-base leading-none">
                        🗺️
                      </span>
                    )}
                    {preSelectedTour ? "Tour" : "Choose a Tour"}
                  </label>

                  {preSelectedTour ? (
                    /* Locked read-only card — came from tour-details page */
                    <div className="flex items-start gap-3 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary text-sm truncate">
                          {preSelectedTour.title}
                        </p>
                        {preSelectedTour.basePrice && (
                          <p className="text-xs text-accent font-bold mt-0.5">
                            ${preSelectedTour.basePrice}
                          </p>
                        )}
                        <p className="text-xs text-secondary/50 mt-1 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Pre-selected from your tour page
                        </p>
                      </div>
                    </div>
                  ) : tours.length > 0 ? (
                    /* Dropdown — came from landing page */
                    <Select
                      value={selectedBooking.tour?._id ?? ""}
                      onValueChange={handleTourSelectById}
                    >
                      <SelectTrigger className="w-full border-secondary/30 focus:ring-accent h-11">
                        <SelectValue placeholder="Select a tour…" />
                      </SelectTrigger>
                      <SelectContent>
                        {tours.map((tour) => (
                          <SelectItem
                            key={tour._id}
                            value={tour._id}
                            className="py-2.5"
                          >
                            {tour.title}
                            {tour.basePrice ? ` — $${tour.basePrice}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-secondary/70 text-center py-3 bg-gray-50 rounded-md">
                      No tours available.
                    </p>
                  )}
                </div>
              )}

              {/* Guest Counter */}
              {selectedBooking.tour && selectedBooking.shift && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Users className="w-4 h-4 text-accent" />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestNumber((n) => Math.max(1, n - 1))}
                      disabled={guestNumber <= 1}
                      className="w-9 h-9 rounded-full border-2 border-secondary/20 flex items-center justify-center hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold text-primary w-8 text-center">
                      {guestNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGuestNumber((n) => Math.min(maxGuests, n + 1))
                      }
                      disabled={guestNumber >= maxGuests}
                      className="w-9 h-9 rounded-full border-2 border-secondary/20 flex items-center justify-center hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-secondary/60">
                      {guestNumber === 1 ? "person" : "people"}
                    </span>
                  </div>
                  {maxGuests < 99 && (
                    <p className="text-xs text-secondary/40">
                      Max {maxGuests} guests for this tour
                    </p>
                  )}
                </div>
              )}

              {/* Specialties / Add-ons */}
              {selectedBooking.tour &&
                selectedBooking.shift &&
                Array.isArray(selectedBooking.tour.specialties) &&
                selectedBooking.tour.specialties.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <span className="text-accent">✨</span>
                        Add-ons
                        <span className="text-xs text-secondary/50 font-normal">
                          (optional)
                        </span>
                      </label>
                      {selectedSpecialties.length > 0 && (
                        <button
                          onClick={() => setSelectedSpecialties([])}
                          className="text-xs text-secondary/50 hover:text-red-400 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {selectedBooking.tour.specialties.map((spec) => {
                        const isSelected = selectedSpecialties.some(
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
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-accent bg-accent/10 shadow-sm"
                                : "border-secondary/15 bg-white hover:border-accent/40 hover:bg-accent/5"
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {isSelected ? (
                                <CheckCircle2 className="w-5 h-5 text-accent" />
                              ) : (
                                <Circle className="w-5 h-5 text-secondary/30" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-primary truncate">
                                  {spec.name}
                                </p>
                                <span
                                  className={`text-sm font-bold shrink-0 ${
                                    isSelected
                                      ? "text-accent"
                                      : "text-secondary/70"
                                  }`}
                                >
                                  {spec.price > 0
                                    ? `+$${spec.price}${guestNumber > 1 ? ` × ${guestNumber}` : ""}`
                                    : "Free"}
                                </span>
                              </div>
                              {spec.description && (
                                <p className="text-xs text-secondary/60 mt-0.5 leading-relaxed">
                                  {spec.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Summary & CTA */}
              <div className="mt-auto">
                {selectedBooking.date && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary/50">
                      Booking Summary
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary/60">Date</span>
                        <span className="font-semibold text-primary text-right max-w-[60%]">
                          {dateFormatted}
                        </span>
                      </div>
                      {selectedBooking.shift && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-secondary/60">Shift</span>
                          <span className="font-semibold text-primary">
                            {selectedBooking.shift.name} &middot;{" "}
                            {selectedBooking.shift.startTime}
                          </span>
                        </div>
                      )}
                      {selectedBooking.tour && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-secondary/60">Tour</span>
                          <span className="font-semibold text-primary text-right max-w-[60%] truncate">
                            {selectedBooking.tour.title}
                          </span>
                        </div>
                      )}
                      {selectedBooking.tour?.basePrice && (
                        <>
                          <div className="flex items-center justify-between text-sm pt-1 border-t border-primary/10">
                            <span className="text-secondary/60">
                              Base price
                            </span>
                            <span className="font-semibold text-primary">
                              ${selectedBooking.tour.basePrice}
                            </span>
                          </div>
                          {selectedSpecialties.map((s) => (
                            <div
                              key={s.name}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-secondary/60 truncate max-w-[60%]">
                                {s.name}
                                {guestNumber > 1 && s.price > 0 && (
                                  <span className="text-[10px] ml-1 text-secondary/40">
                                    ${s.price} × {guestNumber}
                                  </span>
                                )}
                              </span>
                              <span className="font-semibold text-accent">
                                +${s.price * guestNumber}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between text-sm pt-1 border-t border-primary/10">
                            <span className="font-bold text-primary">
                              Total
                            </span>
                            <span className="font-bold text-accent text-base">
                              ${totalPrice}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={handleProceed}
                      disabled={
                        !selectedBooking.date ||
                        !selectedBooking.shift ||
                        !selectedBooking.tour ||
                        isCheckingAvailability
                      }
                      className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:opacity-90 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {isCheckingAvailability ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking availability…
                        </>
                      ) : (
                        `Next: Your Details → $${totalPrice}`
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
