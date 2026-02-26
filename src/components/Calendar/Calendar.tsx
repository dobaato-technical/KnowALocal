"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  unavailableDates: string[];
  onDateClick: (date: string) => void;
  selectedDate?: string;
  currentYear: number;
  currentMonth: number;
  onMonthChange: (year: number, month: number) => void;
  compact?: boolean;
}

export default function Calendar({
  unavailableDates,
  onDateClick,
  selectedDate,
  currentYear,
  currentMonth,
  onMonthChange,
  compact = false,
}: CalendarProps) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      onMonthChange(currentYear - 1, 12);
    } else {
      onMonthChange(currentYear, currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onMonthChange(currentYear + 1, 1);
    } else {
      onMonthChange(currentYear, currentMonth + 1);
    }
  };

  const isUnavailable = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return unavailableDates.includes(dateStr);
  };

  const isSelected = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDate === dateStr;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div
      className={`bg-white rounded-lg border border-secondary/10 ${
        compact ? "p-3" : "p-6"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          compact ? "mb-3" : "mb-6"
        }`}
      >
        <button
          onClick={handlePrevMonth}
          className={`hover:bg-secondary/10 rounded-lg transition-colors ${
            compact ? "p-1" : "p-2"
          }`}
        >
          <ChevronLeft
            className={
              compact ? "w-4 h-4 text-secondary" : "w-5 h-5 text-secondary"
            }
          />
        </button>

        <h3
          className={`font-bold text-primary ${
            compact ? "text-sm" : "text-lg"
          }`}
        >
          {monthName}
        </h3>

        <button
          onClick={handleNextMonth}
          className={`hover:bg-secondary/10 rounded-lg transition-colors ${
            compact ? "p-1" : "p-2"
          }`}
        >
          <ChevronRight
            className={
              compact ? "w-4 h-4 text-secondary" : "w-5 h-5 text-secondary"
            }
          />
        </button>
      </div>

      {/* Days of week header */}
      <div
        className={`grid grid-cols-7 ${compact ? "gap-1 mb-2" : "gap-2 mb-4"}`}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className={`text-center font-semibold text-secondary/70 ${
              compact ? "text-[10px] py-1" : "text-xs py-2"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className={`grid grid-cols-7 ${compact ? "gap-1" : "gap-2"}`}>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const unavailable = isUnavailable(day);
          const selected = isSelected(day);
          const today = isToday(day);
          const past = isPastDate(day);

          return (
            <button
              key={day}
              onClick={() => {
                if (!unavailable && !past) {
                  const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  onDateClick(dateStr);
                }
              }}
              disabled={unavailable || past}
              className={`aspect-square rounded-lg font-semibold transition-all flex items-center justify-center ${
                compact ? "text-xs" : "text-sm"
              } ${
                selected
                  ? "bg-accent text-white border-2 border-accent"
                  : unavailable
                    ? "bg-red-100 text-red-600 opacity-60 cursor-not-allowed border-2 border-red-300"
                    : past
                      ? "bg-secondary/5 text-secondary/40 cursor-not-allowed"
                      : today
                        ? "bg-primary/10 text-primary border-2 border-primary hover:bg-primary/20"
                        : "bg-secondary/5 text-primary hover:bg-secondary/10 border-2 border-transparent"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className={`border-t border-secondary/10 flex flex-wrap gap-x-4 gap-y-1 ${
          compact ? "mt-3 pt-2" : "mt-6 pt-4 space-y-2"
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded bg-accent"></div>
          <span className="text-secondary/70">Selected</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300"></div>
          <span className="text-secondary/70">Unavailable</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded border border-primary"></div>
          <span className="text-secondary/70">Today</span>
        </div>
      </div>
    </div>
  );
}
