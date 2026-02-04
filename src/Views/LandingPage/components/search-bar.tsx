"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  MapPin,
  Search,
} from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  transparent?: boolean;
  onSearch?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  destination: string;
  travelType: string;
  duration: string;
  budget: number;
  quickFilter?: string;
}

export function SearchBar({ transparent = false, onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState(5000);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = () => {
    const filters: SearchFilters = {
      destination,
      travelType,
      duration,
      budget,
      quickFilter: activeFilter || undefined,
    };
    onSearch?.(filters);
  };

  const handleQuickFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="w-full px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#774738] mb-3">
            Discover Canada's Hidden Treasures
          </h2>
          <p className="text-lg text-[#69836a] font-medium">
            Find the perfect adventure in the Himalayas
          </p>
        </div>

        {/* Search Fields */}
        <div
          className={`rounded-3xl p-8 ${
            transparent
              ? "bg-white/95 backdrop-blur-md border-2 border-[#bcd2c2]/30 shadow-2xl"
              : "bg-gradient-to-br from-[#f8f1dd] to-white border-2 border-[#bcd2c2]/50 shadow-2xl"
          }`}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Destination */}
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors" />
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-2 border-[#bcd2c2] bg-white text-[#335358] placeholder:text-[#69836a]/60 focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all"
              />
            </div>

            {/* Travel Type */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors pointer-events-none z-10" />
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full pl-11 pr-11 h-12 rounded-2xl border-2 border-[#bcd2c2] bg-white text-[#335358] focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Travel Type</option>
                <>
                  <option value="trekking">Trekking</option>
                  <option value="cultural">Cultural</option>
                  <option value="adventure">Adventure</option>
                  <option value="spiritual">Spiritual</option>
                </>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors pointer-events-none z-10" />
            </div>

            {/* Duration */}
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors" />
              <Input
                placeholder="Duration (days)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-2 border-[#bcd2c2] bg-white text-[#335358] placeholder:text-[#69836a]/60 focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all"
              />
            </div>

            {/* Budget */}
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#69836a] group-hover:text-[#335358] transition-colors" />
              <Input
                placeholder="Budget (NPR)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="pl-11 h-12 rounded-2xl border-2 border-[#bcd2c2] bg-white text-[#335358] placeholder:text-[#69836a]/60 focus:border-[#335358] focus:ring-2 focus:ring-[#335358]/20 transition-all"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            variant="primary"
            onClick={handleSearch}
            className="w-full md:w-auto"
          >
            <Search className="w-5 h-5" />
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
}
