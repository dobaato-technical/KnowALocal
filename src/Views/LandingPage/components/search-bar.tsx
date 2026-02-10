"use client";

import { getTours, type Tour } from "@/sanity/lib/queries";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Initialize Cal.com calendar
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

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
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full h-14 px-4 rounded-xl transition-all font-medium text-base text-left flex items-center justify-between ${
                  transparent
                    ? "border-2 border-white/40 bg-white/20 text-white placeholder:text-white/60 hover:border-white"
                    : "border-2 border-[#bcd2c2] bg-white text-[#335358] hover:border-[#335358]"
                }`}
              >
                <span>{duration || "Select Date"}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    showCalendar ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showCalendar && (
                <>
                  {/* Modal Overlay */}
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setShowCalendar(false)}
                  />
                  {/* Modal */}
                  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-5xl mx-auto px-4 max-h-[90vh]">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-8 border-b border-[#bcd2c2]/20">
                        <h3 className="text-2xl font-bold text-[#335358]">
                          Select Your Tour Date
                        </h3>
                        <button
                          onClick={() => setShowCalendar(false)}
                          className="text-[#335358] hover:text-[#774738] transition-colors p-2 hover:bg-[#f8f1dd] rounded-lg"
                        >
                          <svg
                            className="w-6 h-6"
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
                      {/* Modal Content */}
                      <div className="p-8 flex-1 overflow-auto min-h-[500px]">
                        <Cal
                          namespace="30min"
                          calLink="know-a-local-okxsgd/30min"
                          style={{ width: "100%", height: "100%" }}
                          config={{
                            layout: "month_view",
                            useSlotsViewOnSmallScreen: "true",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pt-7">
              <button
                onClick={handleSearch}
                className={`group w-full h-12 sm:h-14 inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base tracking-wide ${
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
