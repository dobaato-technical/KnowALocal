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
import Calendar from "@/components/Calendar/Calendar";
import { showToast } from "@/lib/toast-utils";
import { CheckCircle2, Circle, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CustomerInfoModal from "./CustomerInfoModal";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTour?: TourPreview | null;
}

interface ShiftAvailability {
  shiftId: number;
  hasSlots: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  preSelectedTour,
}: BookingModalProps) {
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [disabledShiftIds, setDisabledShiftIds] = useState<number[]>([]);
  const [shiftAvailability, setShiftAvailability] = useState<
    Map<number, ShiftAvailability>
  >(new Map());
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedTour, setSelectedTour] = useState<TourPreview | null>(
    preSelectedTour || null,
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<
    SelectedSpecialty[]
  >([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [shiftsRes, toursRes, unavailableRes] = await Promise.all([
          getAllShifts(),
          getToursPreview(),
          getUnavailableDatesForMonth(currentYear, currentMonth),
        ]);
        if (shiftsRes.success) setShifts(shiftsRes.data || []);
        if (toursRes.success) setTours(toursRes.data || []);
        if (unavailableRes.success)
          setUnavailableDates(unavailableRes.data || []);
      } catch {
        showToast("Failed to load booking data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [isOpen, currentYear, currentMonth]);

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const checkAllShiftAvailability = useCallback(
    async (date: string) => {
      if (shifts.length === 0) return;
      try {
        setAvailabilityLoading(true);
        const [disabledRes, availabilityResults] = await Promise.all([
          getDisabledShiftsForDate(date),
          Promise.all(
            shifts.map((s) => checkShiftSlotAvailability(date, s.id)),
          ),
        ]);
        if (disabledRes.success) setDisabledShiftIds(disabledRes.data || []);
        const map = new Map<number, ShiftAvailability>();
        availabilityResults.forEach((res, i) => {
          const shift = shifts[i];
          if (res.success && res.data && shift) {
            map.set(shift.id, {
              shiftId: shift.id,
              hasSlots: res.data.hasSlots,
            });
          }
        });
        setShiftAvailability(map);
      } catch {
        showToast("Failed to check shift availability", "error");
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [shifts],
  );

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedShift(null);
    checkAllShiftAvailability(date);
  };

  const handleShiftClick = (shift: Shift) => {
    if (disabledShiftIds.includes(shift.id)) {
      showToast(
        "This shift is disabled — a whole day booking exists for this date",
        "error",
      );
      return;
    }
    const avail = shiftAvailability.get(shift.id);
    if (avail && !avail.hasSlots) {
      showToast("This shift is already fully booked", "error");
      return;
    }
    setSelectedShift((prev) => (prev?.id === shift.id ? null : shift));
  };

  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tour = tours.find((t) => t._id === e.target.value) || null;
    setSelectedTour(tour);
    setSelectedSpecialties([]); // reset specialties when tour changes
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
    if (!selectedDate || !selectedShift || !selectedTour) {
      showToast("Please select a date, shift, and tour", "error");
      return;
    }

    // Re-check availability right before proceeding to avoid stale UI state
    try {
      setIsCheckingAvailability(true);
      const [disabledRes, availRes] = await Promise.all([
        getDisabledShiftsForDate(selectedDate),
        checkShiftSlotAvailability(selectedDate, selectedShift.id),
      ]);

      if (
        disabledRes.success &&
        (disabledRes.data || []).includes(selectedShift.id)
      ) {
        showToast(
          "This shift is no longer available — a whole-day booking exists for this date.",
          "error",
        );
        checkAllShiftAvailability(selectedDate);
        setSelectedShift(null);
        return;
      }

      if (availRes.success && availRes.data && !availRes.data.hasSlots) {
        showToast(
          "This shift was just booked. Please select a different option.",
          "error",
        );
        checkAllShiftAvailability(selectedDate);
        setSelectedShift(null);
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

  if (!isOpen) return null;

  if (showCustomerModal && selectedDate && selectedShift && selectedTour) {
    return (
      <CustomerInfoModal
        selectedDate={selectedDate}
        selectedShift={selectedShift}
        selectedTour={selectedTour}
        selectedSpecialties={selectedSpecialties}
        onClose={onClose}
        onBack={() => setShowCustomerModal(false)}
      />
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:p-6 py-3 border-b border-secondary/10 bg-linear-to-r from-primary/5 to-accent/5">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Check Availability
          </h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-accent transition-colors p-2 hover:bg-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-secondary/60">Loading availability...</p>
            </div>
          ) : (
            <div className="space-y-7">
              {/* Step 1 — Date */}
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-3">
                  Step 1 — Select a Date
                </p>
                <Calendar
                  unavailableDates={unavailableDates}
                  onDateClick={handleDateClick}
                  selectedDate={selectedDate || undefined}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  onMonthChange={handleMonthChange}
                />
              </div>

              {/* Step 2 — Shift */}
              {selectedDate && (
                <div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wide mb-3">
                    Step 2 — Select a Shift
                  </p>
                  {availabilityLoading ? (
                    <p className="text-sm text-secondary/60 py-4 text-center">
                      Checking shift availability...
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {shifts.length > 0 ? (
                        shifts.map((shift) => {
                          const avail = shiftAvailability.get(shift.id);
                          const isDisabled =
                            disabledShiftIds.includes(shift.id) ||
                            (avail ? !avail.hasSlots : false);
                          const isSelected = selectedShift?.id === shift.id;
                          return (
                            <button
                              key={shift.id}
                              onClick={() => handleShiftClick(shift)}
                              disabled={isDisabled}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? "border-accent bg-accent/10"
                                  : isDisabled
                                    ? "border-secondary/10 bg-secondary/5 opacity-50 cursor-not-allowed"
                                    : "border-secondary/15 bg-white hover:border-accent/50 hover:bg-accent/5"
                              }`}
                            >
                              <p className="font-bold text-primary text-sm">
                                {shift.name}
                              </p>
                              <p className="text-xs text-secondary/60 mt-0.5">
                                {shift.startTime} – {shift.endTime}
                              </p>
                              <p
                                className={`text-xs font-semibold mt-2 ${isDisabled ? "text-red-500" : "text-green-600"}`}
                              >
                                {isDisabled ? "✗ Unavailable" : "✓ Available"}
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-secondary/60 text-center py-4 col-span-2">
                          No shifts available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 — Tour */}
              {selectedShift && (
                <div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wide mb-3">
                    Step 3 — Select a Tour
                  </p>
                  <select
                    value={selectedTour?._id || ""}
                    onChange={handleTourChange}
                    className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:border-accent focus:outline-none bg-white text-primary"
                  >
                    <option value="">Choose a tour...</option>
                    {tours.map((tour) => (
                      <option key={tour._id} value={tour._id}>
                        {tour.title}
                        {tour.basePrice ? ` — $${tour.basePrice}` : ""}
                      </option>
                    ))}
                  </select>

                  {selectedTour && (
                    <div className="mt-2 px-4 py-2.5 bg-accent/5 border border-accent/20 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {selectedTour.title}
                      </span>
                      {selectedTour.basePrice && (
                        <span className="text-accent font-bold">
                          ${selectedTour.basePrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4 — Specialties (optional) */}
              {selectedTour &&
                selectedShift &&
                Array.isArray(selectedTour.specialties) &&
                selectedTour.specialties.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-accent uppercase tracking-wide">
                        Step 4 — Add-ons{" "}
                        <span className="text-secondary/50 font-normal normal-case">
                          (optional)
                        </span>
                      </p>
                      {selectedSpecialties.length > 0 && (
                        <button
                          onClick={() => setSelectedSpecialties([])}
                          className="text-xs text-secondary/50 hover:text-red-400 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {selectedTour.specialties.map((spec) => {
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
                            className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-accent bg-accent/8 shadow-sm"
                                : "border-secondary/15 bg-white hover:border-accent/40 hover:bg-accent/3"
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
                                  className={`text-sm font-bold shrink-0 ${isSelected ? "text-accent" : "text-secondary/70"}`}
                                >
                                  {spec.price > 0 ? `+$${spec.price}` : "Free"}
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

                    {selectedSpecialties.length > 0 && (
                      <div className="mt-3 px-3.5 py-2.5 bg-primary/5 border border-primary/15 rounded-lg flex items-center justify-between">
                        <span className="text-xs text-secondary/70">
                          {selectedSpecialties.length} add-on
                          {selectedSpecialties.length > 1 ? "s" : ""} selected
                        </span>
                        <span className="text-sm font-bold text-primary">
                          +$
                          {selectedSpecialties.reduce(
                            (sum, s) => sum + s.price,
                            0,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {selectedDate && selectedShift && selectedTour && (
          <div className="p-4 sm:p-6 border-t border-secondary/10 bg-white">
            <button
              onClick={handleProceed}
              disabled={isCheckingAvailability}
              className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 active:opacity-75 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isCheckingAvailability ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking availability…
                </>
              ) : (
                "Next: Your Details →"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
