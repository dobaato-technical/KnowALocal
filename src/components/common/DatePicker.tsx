"use client";

import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const formattedDate = selectedDate.toISOString().split("T")[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateObj = value ? new Date(value + "T00:00:00") : null;
  const isSelectedMonth =
    selectedDateObj &&
    selectedDateObj.getMonth() === currentDate.getMonth() &&
    selectedDateObj.getFullYear() === currentDate.getFullYear();

  return (
    <div className="relative group" ref={containerRef}>
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors cursor-pointer z-10" />
      <input
        type="text"
        value={formatDisplayDate(value)}
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        className="w-full pl-11 pr-4 h-12 rounded-2xl border-2 border-[#bcd2c2] bg-white text-[#335358] placeholder:text-[#69836a]/60 focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all cursor-pointer"
      />

      {/* Calendar Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar Modal */}
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/80 animate-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#335358]">Select Date</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-[#335358]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-[#335358] to-[#69836a] rounded-2xl p-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-bold text-white text-center flex-1">
                {monthName}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, dayIndex) => (
                <div
                  key={`day-${dayIndex}`}
                  className="text-center text-sm font-bold text-[#335358]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={index}>
                  {day === null ? (
                    <div className="h-10" />
                  ) : (
                    <button
                      onClick={() => {
                        handleDateClick(day);
                        setIsOpen(false);
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        isSelectedMonth && selectedDateObj?.getDate() === day
                          ? "bg-gradient-to-br from-[#d69850] to-[#774738] text-white shadow-lg scale-105"
                          : "text-[#335358] hover:bg-gradient-to-br hover:from-[#e8f4f8] hover:to-[#d4e8f0] hover:shadow-md"
                      }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
