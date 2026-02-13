"use client";

import { Calendar } from "@/components/ui/calendar";
import { getTours, type Tour } from "@/sanity/lib/queries";
import { CheckCircle2, ChevronDown, Clock, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SearchBarProps {
  transparent?: boolean;
  onSearch?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  destination: string;
  duration: string;
  quickFilter?: string;
}

export function SearchBar({ transparent = false, onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState<string[]>(
    [],
  );
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        // Fetch tours from Sanity
        const fetchedTours = await getTours();
        setTours(fetchedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Fetch schedule data from Cal.com on component mount
  useEffect(() => {
    (async function () {
      try {
        setIsLoadingSchedule(true);
        const response = await fetch("/api/schedules");
        const data = await response.json();
        console.log("📅 Schedule data fetched:", data);
        setScheduleData(data);
      } catch (error) {
        console.error("❌ Error fetching schedule:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setIsLoadingSchedule(false);
      }
    })();
  }, []);

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate && scheduleData?.data) {
      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = selectedDate.getDay();

      const slots: string[] = [];

      // Check if we have working hours data (minutes-based)
      if (
        scheduleData.data.workingHours &&
        Array.isArray(scheduleData.data.workingHours)
      ) {
        const dayWorkingHours = scheduleData.data.workingHours.filter(
          (wh: any) => wh.days && wh.days.includes(dayOfWeek),
        );

        dayWorkingHours.forEach((wh: any) => {
          if (
            typeof wh.startTime === "number" &&
            typeof wh.endTime === "number"
          ) {
            // Convert minutes to HH:MM format
            const startHours = Math.floor(wh.startTime / 60);
            const startMins = wh.startTime % 60;
            const endHours = Math.floor(wh.endTime / 60);
            const endMins = wh.endTime % 60;

            const startTime = `${String(startHours).padStart(2, "0")}:${String(startMins).padStart(2, "0")}`;
            const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

            slots.push(`${startTime} - ${endTime}`);
          }
        });
      }
      // Fallback to ISO datetime format if available
      else if (
        scheduleData.data.availability &&
        Array.isArray(scheduleData.data.availability)
      ) {
        const timeZone = scheduleData.data.timeZone || "UTC";
        const daySlots = scheduleData.data.availability[dayOfWeek];

        if (daySlots && Array.isArray(daySlots)) {
          daySlots.forEach((slot: any) => {
            if (slot.start && slot.end) {
              const startDate = new Date(slot.start);
              const endDate = new Date(slot.end);

              const startTime = startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: timeZone,
              });

              const endTime = endDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: timeZone,
              });

              slots.push(`${startTime} - ${endTime}`);
            }
          });
        }
      }

      setSlotsForSelectedDate(slots);
      setSelectedTimeSlot("");
      console.log("📅 Available slots for day", dayOfWeek, ":", slots);
    }
  }, [selectedDate, scheduleData]);

  const handleCheckAvailability = async () => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    if (!selectedTimeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus("loading");

    try {
      // Parse the selected time slot (format: "HH:MM - HH:MM")
      const [startTimeStr] = selectedTimeSlot.split(" - ");
      const [hours, minutes] = startTimeStr.split(":").map(Number);

      // Create ISO datetime string
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const startTime = `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`;

      // Calculate end time (assuming 30 min or 2 hour slot - adjust as needed)
      const endDate = new Date(selectedDate);
      endDate.setHours(hours + 2, minutes);
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
      const endDay = String(endDate.getDate()).padStart(2, "0");
      const endHour = String(endDate.getHours()).padStart(2, "0");
      const endMinute = String(endDate.getMinutes()).padStart(2, "0");
      const endTime = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:00Z`;

      console.log("📅 Checking availability for:", {
        startTime,
        endTime,
        slot: selectedTimeSlot,
      });

      // Call Cal.com API to check availability
      const response = await fetch(
        `/api/cal/availability?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ API Error:", data);
        setAvailabilityStatus("unavailable");
        toast.error("❌ Slot has been taken");
        return;
      }

      // Check if slots exist and are available
      // Cal.com returns nested structure: { data: { slots: {...} }, status: 'success' }
      const slots = data.data?.slots;
      const hasSlots =
        (Array.isArray(slots) && slots.length > 0) ||
        (typeof slots === "object" &&
          slots !== null &&
          Object.keys(slots).length > 0);

      if (hasSlots) {
        setAvailabilityStatus("available");
        toast.success("✅ Slot is available! Proceed to book.");
        setShowAvailabilityModal(true);
        console.log("✅ Slot available:", slots);
      } else {
        setAvailabilityStatus("unavailable");
        toast.error("❌ Slot has been taken");
        console.log("❌ Slot not available - empty slots response:", slots);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityStatus("unavailable");
      toast.error("Error checking availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBookNow = async () => {
    if (!bookingName.trim() || !bookingEmail.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsBooking(true);
    try {
      // Parse the time slot (e.g., "10:00 - 11:00")
      const timeParts = selectedTimeSlot.split(" - ");
      const [startHour, startMin] = timeParts[0].split(":").map(Number);
      const [endHour, endMin] = timeParts[1].split(":").map(Number);

      // Create local date strings without UTC conversion
      // Cal.com expects the time in the specified timezone
      const year = selectedDate!.getFullYear();
      const month = String(selectedDate!.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate!.getDate()).padStart(2, "0");

      const startTimeStr = `${year}-${month}-${day}T${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}:00`;
      const endTimeStr = `${year}-${month}-${day}T${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}:00`;

      console.log("📅 Booking Details:");
      console.log("  Selected Date:", selectedDate!.toLocaleDateString());
      console.log("  Selected Time:", selectedTimeSlot);
      console.log("  Start Time (Local):", startTimeStr);
      console.log("  End Time (Local):", endTimeStr);

      const response = await fetch("/api/cal/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          startTime: startTimeStr,
          endTime: endTimeStr,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Booking Error:", data);
        toast.error("Booking failed. Please try again.");
        return;
      }

      toast.success("✅ Booking confirmed! Check your email for confirmation.");
      setShowAvailabilityModal(false);
      setBookingName("");
      setBookingEmail("");
      setSelectedDate(undefined);
      setSelectedTimeSlot("");
      console.log("✅ Booking successful:", data);
    } catch (error) {
      console.error("Error booking:", error);
      toast.error("Error creating booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleSearch = () => {
    const filters: SearchFilters = {
      destination,
      duration,
      quickFilter: activeFilter || undefined,
    };
    onSearch?.(filters);
  };

  const handleQuickFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto">
        {/* Search Fields */}
        <div
          className={`rounded-3xl p-6 md:p-8 shadow-2xl ${
            transparent
              ? "bg-white/10 backdrop-blur-lg border-2 border-white/30"
              : "bg-gradient-to-br from-[#f8f1dd] to-white border-2 border-[#bcd2c2]/50"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
            {/* Destination */}
            <div className="relative group sm:col-span-1 lg:col-span-1">
              <label
                className={`block text-xs font-semibold mb-3 tracking-wide uppercase ${
                  transparent ? "text-white/90" : "text-[#335358]"
                }`}
              >
                Destination
              </label>
              <MapPin
                className={`absolute left-3 top-12 w-5 h-5 transition-colors pointer-events-none z-10 ${
                  transparent
                    ? "text-white/70 group-hover:text-white"
                    : "text-[#69836a] group-hover:text-[#335358]"
                }`}
              />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isLoading}
                className={`w-full pl-11 pr-11 h-14 rounded-xl transition-all appearance-none cursor-pointer text-base font-medium ${
                  transparent
                    ? "border-2 border-white/40 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:bg-white/30 backdrop-blur-sm"
                    : "border-2 border-[#bcd2c2] bg-white text-[#335358] focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="" className="text-gray-700">
                  {isLoading ? "Loading destinations..." : "Where to?"}
                </option>
                {tours.map((tour) => (
                  <option
                    key={tour._id}
                    value={tour.title}
                    className="text-gray-700"
                  >
                    {tour.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-12 w-5 h-5 transition-colors pointer-events-none z-10 ${
                  transparent
                    ? "text-white/70 group-hover:text-white"
                    : "text-[#69836a] group-hover:text-[#335358]"
                }`}
              />
            </div>

            {/* Duration / Calendar */}
            <div>
              <label
                className={`block text-xs font-semibold mb-3 tracking-wide uppercase ${
                  transparent ? "text-white/90" : "text-[#335358]"
                }`}
              >
                Tour Date
              </label>
              <button
                onClick={() => setShowCalendarModal(!showCalendarModal)}
                className={`w-full h-14 px-4 rounded-xl transition-all font-medium text-base text-left flex items-center justify-between ${
                  transparent
                    ? "border-2 border-white/40 bg-white/20 text-white placeholder:text-white/60 hover:border-white"
                    : "border-2 border-[#bcd2c2] bg-white text-[#335358] hover:border-[#335358]"
                }`}
              >
                <span>
                  {duration ||
                    (selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Select Date")}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    showCalendarModal ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Calendar Modal */}
              {showCalendarModal && (
                <>
                  {/* Modal Overlay */}
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setShowCalendarModal(false)}
                  />
                  {/* Modal */}
                  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-[#335358]">
                        Select Date & Time
                      </h3>
                      <button
                        onClick={() => setShowCalendarModal(false)}
                        className="text-[#335358] hover:text-[#774738] transition-colors p-1 hover:bg-[#f8f1dd] rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Calendar and Time Picker - Side by Side */}
                    <div className="flex gap-6">
                      {/* Left: Calendar Component */}
                      <div className="flex-1 flex justify-center">
                        <div className="scale-75 -ml-8 -mr-8">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              if (date) {
                                const formattedDate = date.toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                );
                                setDuration(formattedDate);
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </div>
                      </div>

                      {/* Right: Time Picker - Schedule Based */}
                      <div className="flex-1 flex flex-col justify-center">
                        {selectedDate ? (
                          <div className="space-y-4">
                            {/* Time Slots Section */}
                            <div>
                              <label className="block text-xs font-semibold mb-3 text-[#335358] uppercase tracking-wide">
                                Available Times
                              </label>

                              {isLoadingSchedule ? (
                                <div className="flex items-center justify-center p-4 text-[#335358] text-xs">
                                  <span>Loading schedule...</span>
                                </div>
                              ) : slotsForSelectedDate.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-[#f8f1dd]/30 rounded-lg border border-[#bcd2c2]/50">
                                  {slotsForSelectedDate.map((slot, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setSelectedTimeSlot(slot)}
                                      className={`w-full px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                                        selectedTimeSlot === slot
                                          ? "bg-[#335358] text-white"
                                          : "bg-white text-[#335358] border border-[#bcd2c2] hover:bg-[#f8f1dd]"
                                      }`}
                                    >
                                      <Clock className="w-4 h-4 flex-shrink-0" />
                                      <span>{slot}</span>
                                      {selectedTimeSlot === slot && (
                                        <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 bg-[#f8f1dd]/50 rounded text-center">
                                  <p className="text-xs text-[#335358] font-medium">
                                    No available slots for this date
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Selected Time Display */}
                            {selectedTimeSlot && (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs font-medium text-green-800">
                                  ✓{" "}
                                  {selectedDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}{" "}
                                  @ {selectedTimeSlot}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-[#335358] text-sm">
                            Select a date first
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Modal Footer - Compact */}
                    <div className="border-t border-[#bcd2c2]/30 pt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setShowCalendarModal(false);
                        }}
                        className="flex-1 h-8 px-3 rounded-lg transition-all font-medium text-xs text-[#335358] bg-white border border-[#bcd2c2] hover:bg-[#f8f1dd]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowCalendarModal(false);
                        }}
                        disabled={!selectedDate}
                        className="flex-1 h-8 px-3 rounded-lg transition-all font-medium text-xs text-white bg-gradient-to-r from-[#774738] to-[#d69850] hover:from-[#d69850] hover:to-[#774738] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pt-7">
              <button
                onClick={handleCheckAvailability}
                disabled={
                  !selectedDate || !selectedTimeSlot || isCheckingAvailability
                }
                className={`w-full h-12 sm:h-14 inline-flex items-center justify-center gap-2 font-bold rounded-xl text-sm sm:text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${
                  transparent
                    ? "bg-accent-color text-white"
                    : "bg-[#774738] hover:bg-[#6b3b2e] text-white"
                }`}
              >
                <span>
                  {isCheckingAvailability
                    ? "Checking..."
                    : "Check Availability"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Confirmation Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Big Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2
                  className="w-12 h-12 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Available Text */}
            <h2 className="text-2xl font-bold text-[#335358] mb-2">
              Slot Available!
            </h2>
            <p className="text-[#335358]/70 mb-6">
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              @ {selectedTimeSlot}
            </p>

            {/* Booking Form */}
            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-[#335358] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-[#bcd2c2] rounded-lg focus:outline-none focus:border-[#335358] text-[#335358]"
                  disabled={isBooking}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#335358] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={bookingEmail}
                  onChange={(e) => setBookingEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-[#bcd2c2] rounded-lg focus:outline-none focus:border-[#335358] text-[#335358]"
                  disabled={isBooking}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setBookingName("");
                  setBookingEmail("");
                }}
                disabled={isBooking}
                className="w-full px-6 py-3 rounded-xl transition-all font-bold text-[#335358] bg-white border-2 border-[#bcd2c2] hover:bg-[#f8f1dd] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleBookNow}
                disabled={
                  isBooking || !bookingName.trim() || !bookingEmail.trim()
                }
                className="w-full px-6 py-3 rounded-xl transition-all font-bold text-white bg-gradient-to-r from-[#774738] to-[#d69850] hover:from-[#d69850] hover:to-[#774738] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "Processing..." : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
