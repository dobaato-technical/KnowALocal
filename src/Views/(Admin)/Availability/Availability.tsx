"use client";

import {
  getAllAvailability,
  getUnavailableDatesForMonth,
  setAvailable,
  setUnavailable,
  toggleAvailability,
  type Availability,
} from "@/api";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AvailabilityPage() {
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [reason, setReason] = useState("");
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [allAvailability, setAllAvailability] = useState<Availability[]>([]);

  // Fetch unavailable dates for current month
  // OPTIMIZED: Wrapped fetchUnavailableDates with useCallback for stable function reference
  const fetchUnavailableDates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUnavailableDatesForMonth(
        currentYear,
        currentMonth,
      );
      if (response.success) {
        setUnavailableDates(response.data || []);
      } else {
        console.error("Failed to fetch unavailable dates:", response.message);
        setMessage({
          type: "error",
          text: `Failed to load dates: ${response.message}`,
        });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      console.error("Error fetching unavailable dates:", err);
      setMessage({
        type: "error",
        text: `Error loading dates: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
      setTimeout(() => setMessage(null), 5000);
    }
    setLoading(false);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchUnavailableDates();
  }, [fetchUnavailableDates]);

  const fetchAllAvailability = async () => {
    const response = await getAllAvailability();
    if (response.success) {
      setAllAvailability(response.data || []);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const isUnavailable = unavailableDates.includes(date);
    setShowReasonForm(false);
    setReason("");

    // Auto-action: If clicking unavailable date, confirm to make available
    if (isUnavailable) {
      // Just select it, show the button
      setShowReasonForm(false);
    } else {
      // If clicking available date, show form to set as unavailable
      setShowReasonForm(true);
    }
  };

  const handleSetUnavailable = async () => {
    if (!selectedDate) return;

    setActionInProgress(true);
    const response = await setUnavailable(
      selectedDate,
      reason || "Not available",
    );

    if (response.success) {
      setUnavailableDates([...unavailableDates, selectedDate]);
      setMessage({
        type: "success",
        text: `${selectedDate} has been marked as unavailable`,
      });
      setSelectedDate(null);
      setReason("");
      setShowReasonForm(false);
      fetchAllAvailability();
    } else {
      setMessage({
        type: "error",
        text: `Failed to set date as unavailable: ${response.message}`,
      });
    }
    setActionInProgress(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSetAvailable = async () => {
    if (!selectedDate) return;

    setActionInProgress(true);
    const response = await setAvailable(selectedDate);

    if (response.success) {
      setUnavailableDates(unavailableDates.filter((d) => d !== selectedDate));
      setMessage({
        type: "success",
        text: `${selectedDate} has been marked as available`,
      });
      setSelectedDate(null);
      setShowReasonForm(false);
      setReason("");
      fetchAllAvailability();
    } else {
      setMessage({
        type: "error",
        text: `Failed to set date as available: ${response.message}`,
      });
    }
    setActionInProgress(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async () => {
    if (!selectedDate) return;

    setActionInProgress(true);
    const response = await toggleAvailability(selectedDate);

    if (response.success) {
      const isNowUnavailable = response.data?.avaibality;

      if (isNowUnavailable) {
        setUnavailableDates([...unavailableDates, selectedDate]);
      } else {
        setUnavailableDates(unavailableDates.filter((d) => d !== selectedDate));
      }

      setMessage({
        type: "success",
        text: isNowUnavailable
          ? `${selectedDate} is now unavailable`
          : `${selectedDate} is now available`,
      });
      setShowReasonForm(false);
      setReason("");
      fetchAllAvailability();
    } else {
      setMessage({
        type: "error",
        text: `Failed to toggle availability: ${response.message}`,
      });
    }
    setActionInProgress(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const isDateUnavailable =
    selectedDate && unavailableDates.includes(selectedDate);
  const selectedDateInfo =
    selectedDate && allAvailability.find((a) => a.date === selectedDate);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Manage Availability
          </h1>
          <p className="text-secondary/70 mb-4">
            Set dates as unavailable to prevent customer bookings
          </p>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Date Input */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-secondary/10 p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Select a Date
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-primary mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => handleDateClick(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary/70 uppercase block mb-2">
                    Month View
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currentMonth}
                      onChange={(e) =>
                        setCurrentMonth(parseInt(e.target.value))
                      }
                      className="flex-1 px-3 py-2 border border-secondary/20 rounded-lg focus:border-accent focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2000, i).toLocaleDateString("en-US", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={currentYear}
                      onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                      className="px-3 py-2 border border-secondary/20 rounded-lg focus:border-accent focus:outline-none"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="bg-secondary/5 rounded-lg p-4">
                  <p className="text-xs font-semibold text-secondary/70 mb-2">
                    📊 Unavailable dates in {currentMonth}/{currentYear}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unavailableDates
                      .filter((date) =>
                        date.startsWith(
                          `${currentYear}-${String(currentMonth).padStart(
                            2,
                            "0",
                          )}`,
                        ),
                      )
                      .map((date) => (
                        <span
                          key={date}
                          className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded cursor-pointer hover:bg-red-300"
                          onClick={() => handleDateClick(date)}
                        >
                          {new Date(date).getDate()}
                        </span>
                      ))}
                    {unavailableDates.filter((date) =>
                      date.startsWith(
                        `${currentYear}-${String(currentMonth).padStart(
                          2,
                          "0",
                        )}`,
                      ),
                    ).length === 0 && (
                      <p className="text-xs text-secondary/70">
                        No unavailable dates
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Date Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-secondary/10 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                {selectedDate ? "Date Details" : "Select a Date"}
              </h3>

              {selectedDate ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-secondary/70 uppercase">
                      Selected Date
                    </label>
                    <p className="text-lg font-semibold text-primary mt-1">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="border-t border-secondary/10 pt-4">
                    <label className="text-xs font-semibold text-secondary/70 uppercase block mb-2">
                      Status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        isDateUnavailable
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isDateUnavailable ? "Unavailable" : "Available"}
                    </span>
                  </div>

                  {selectedDateInfo && selectedDateInfo.reason && (
                    <div>
                      <label className="text-xs font-semibold text-secondary/70 uppercase">
                        Reason
                      </label>
                      <p className="text-sm text-secondary mt-1">
                        {selectedDateInfo.reason}
                      </p>
                    </div>
                  )}

                  {isDateUnavailable ? (
                    <div className="space-y-3 pt-4 border-t border-secondary/10">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSetAvailable}
                          disabled={actionInProgress}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2"
                        >
                          {actionInProgress ? "..." : "✓ Available"}
                        </Button>
                        <Button
                          onClick={handleToggle}
                          disabled={actionInProgress}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2"
                          title="Quick toggle between available/unavailable"
                        >
                          {actionInProgress ? "..." : "Toggle"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4 border-t border-secondary/10">
                      {!showReasonForm ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowReasonForm(true)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2"
                            disabled={actionInProgress}
                          >
                            ✕ Unavailable
                          </Button>
                          <Button
                            onClick={handleToggle}
                            disabled={actionInProgress}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2"
                            title="Quick toggle between available/unavailable"
                          >
                            {actionInProgress ? "..." : "Toggle"}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-semibold text-secondary/70 uppercase block mb-1">
                              Reason (optional)
                            </label>
                            <Input
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="e.g., Staff training, Maintenance"
                              className="text-sm"
                              disabled={actionInProgress}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setShowReasonForm(false);
                                setReason("");
                              }}
                              className="flex-1 text-sm bg-secondary/10 text-primary hover:bg-secondary/20"
                              disabled={actionInProgress}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSetUnavailable}
                              disabled={actionInProgress}
                              className="flex-1 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold"
                            >
                              {actionInProgress ? "..." : "Confirm"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-secondary/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-primary mb-1">
                    Click on a date to manage it
                  </p>
                  <p className="text-xs text-secondary/70">
                    Red dates are unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs font-semibold text-red-700 uppercase">
                  Unavailable Dates
                </p>
                <p className="text-2xl font-bold text-red-800">
                  {unavailableDates.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  Current Month
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {new Date(currentYear, currentMonth - 1).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-xs font-semibold text-secondary uppercase">
                  Available Dates This Month
                </p>
                <p className="text-2xl font-bold text-primary">
                  {new Date(currentYear, currentMonth, 0).getDate() -
                    unavailableDates.filter((date) =>
                      date.startsWith(
                        `${currentYear}-${String(currentMonth).padStart(2, "0")}`,
                      ),
                    ).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
