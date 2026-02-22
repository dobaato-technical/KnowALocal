/**
 * Calendar Popup for Users
 * Read-only calendar that shows unavailable dates
 * Used in booking flows and tour selection
 */

"use client";

import Button from "@/components/ui/button";
import { X } from "lucide-react";
import Calendar from "./Calendar";

export interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  unavailableDates?: string[];
  currentYear?: number;
  currentMonth?: number;
  onMonthChange?: (year: number, month: number) => void;
}

export default function CalendarPopup({
  isOpen,
  onClose,
  unavailableDates = [],
  currentYear,
  currentMonth,
  onMonthChange,
}: CalendarPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Check Availability</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Calendar */}
        <div className="p-6">
          <Calendar
            unavailableDates={unavailableDates}
            readOnly={true}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onMonthChange={onMonthChange}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-secondary/10 p-6 flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-accent hover:bg-accent/90 text-primary"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
