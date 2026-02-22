/**
 * Reusable Calendar Component
 * Can be used both as full-page admin calendar and as popup for users
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export interface CalendarProps {
  onDateClick?: (date: string) => void;
  unavailableDates?: string[];
  currentYear?: number;
  currentMonth?: number;
  readOnly?: boolean; // If true, dates can't be clicked and only shows unavailable status
  selectedDate?: string;
  onMonthChange?: (year: number, month: number) => void;
}

export default function Calendar({
  onDateClick,
  unavailableDates = [],
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1,
  readOnly = false,
  selectedDate,
  onMonthChange,
}: CalendarProps) {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);

  // Update calendar when month/year changes
  useEffect(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDay = new Date(year, month, 0).getDate();

    setFirstDayOfWeek(firstDay);
    setDaysInMonth(Array.from({ length: lastDay }, (_, i) => i + 1));

    onMonthChange?.(year, month);
  }, [year, month, onMonthChange]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateClick = (day: number) => {
    if (readOnly) return;

    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    onDateClick?.(dateStr);
  };

  const isDateUnavailable = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return unavailableDates.includes(dateStr);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return dateStr === selectedDate;
  };

  const monthName = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Empty cells for days before month starts
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="w-full bg-white rounded-lg border border-secondary/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          disabled={readOnly}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>

        <h2 className="text-2xl font-bold text-primary min-w-48 text-center">
          {monthName} {year}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          disabled={readOnly}
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-secondary text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {daysInMonth.map((day) => {
          const isUnavailable = isDateUnavailable(day);
          const isSelected = isDateSelected(day);
          const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() + 1 === month &&
            new Date().getDate() === day;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={readOnly}
              className={`
                aspect-square rounded-lg font-medium text-sm transition-all
                flex items-center justify-center
                ${
                  isUnavailable
                    ? readOnly
                      ? "bg-red-100 text-red-700 cursor-default border-2 border-red-300"
                      : "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer border-2 border-red-300 hover:border-red-400"
                    : isSelected
                      ? "bg-accent text-primary border-2 border-accent"
                      : isToday
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : readOnly
                          ? "bg-secondary/5 text-primary cursor-default"
                          : "bg-secondary/5 text-primary hover:bg-secondary/20 cursor-pointer"
                }
              `}
              title={
                isUnavailable
                  ? readOnly
                    ? "Date unavailable for booking"
                    : "Click to set as available"
                  : isToday
                    ? "Today"
                    : undefined
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-secondary/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm text-secondary">Unavailable</span>
        </div>
        {!readOnly && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm text-secondary">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              <span className="text-sm text-secondary">Selected</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
