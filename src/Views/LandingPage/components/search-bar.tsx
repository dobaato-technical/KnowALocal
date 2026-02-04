"use client";

import { DatePicker } from "@/components/common/DatePicker";
import travelLocations from "@/data/travelLocations.json";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

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
      <div className="w-full max-w-4xl">
        {/* Search Fields */}
        <div
          className={`rounded-3xl p-6 md:p-8 shadow-2xl ${
            transparent
              ? "bg-white/10 backdrop-blur-lg border-2 border-white/30"
              : "bg-gradient-to-br from-[#f8f1dd] to-white border-2 border-[#bcd2c2]/50"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Destination */}
            <div className="relative group">
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
                className={`w-full pl-11 pr-11 h-14 rounded-xl transition-all appearance-none cursor-pointer text-base font-medium ${
                  transparent
                    ? "border-2 border-white/40 bg-white/20 text-white placeholder:text-white/60 focus:border-white focus:bg-white/30 backdrop-blur-sm"
                    : "border-2 border-[#bcd2c2] bg-white text-[#335358] focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20"
                }`}
              >
                <option value="" className="text-gray-700">
                  Where to?
                </option>
                {travelLocations.map((location) => (
                  <option
                    key={location.id}
                    value={location.title}
                    className="text-gray-700"
                  >
                    {location.title}
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

            {/* Duration */}
            <div>
              <label
                className={`block text-xs font-semibold mb-3 tracking-wide uppercase ${
                  transparent ? "text-white/90" : "text-[#335358]"
                }`}
              >
                Travel Date
              </label>
              <DatePicker
                value={duration}
                onChange={setDuration}
                placeholder="Select Date"
              />
            </div>

            {/* Search Button */}
            <div className="md:pt-7">
              <button
                onClick={handleSearch}
                className={`group w-full h-14 inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 text-base tracking-wide ${
                  transparent
                    ? "bg-accent-color text-white hover:bg-accent-color/90 shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-[#774738] to-[#d69850] hover:from-[#d69850] hover:to-[#774738] text-white shadow-lg hover:shadow-xl"
                }`}
              >
                <span>Check Availability</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
