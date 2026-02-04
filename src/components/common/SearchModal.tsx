"use client";

import { DatePicker } from "@/components/common/DatePicker";
import travelLocations from "@/data/travelLocations.json";
import { ArrowRight, ChevronDown, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  destination: string;
  duration: string;
  quickFilter?: string;
}

export function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleSearch = () => {
    const filters: SearchFilters = {
      destination,
      duration,
      quickFilter: activeFilter || undefined,
    };
    onSearch?.(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-[#335358]" />
        </button>

        {/* Modal Header */}
        <h2 className="text-3xl font-bold text-[#335358] mb-2">
          Find Your Perfect Adventure
        </h2>
        <p className="text-[#69836a] mb-8">
          Search for tours and book your experience in Nova Scotia
        </p>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Destination */}
          <div className="relative group">
            <label className="block text-xs font-semibold mb-3 tracking-wide uppercase text-[#335358]">
              Destination
            </label>
            <MapPin className="absolute left-3 top-12 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors pointer-events-none z-10" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-11 pr-11 h-14 rounded-xl border-2 border-[#bcd2c2] bg-white text-[#335358] focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all appearance-none cursor-pointer text-base font-medium"
            >
              <option value="">Where to?</option>
              {travelLocations.map((location) => (
                <option key={location.id} value={location.title}>
                  {location.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-12 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors pointer-events-none z-10" />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold mb-3 tracking-wide uppercase text-[#335358]">
              Travel Date
            </label>
            <DatePicker
              value={duration}
              onChange={setDuration}
              placeholder="Select Date"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 h-14 px-6 font-semibold rounded-xl border-2 border-[#bcd2c2] text-[#335358] hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 h-14 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#774738] to-[#d69850] hover:from-[#d69850] hover:to-[#774738] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Check Availability</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
