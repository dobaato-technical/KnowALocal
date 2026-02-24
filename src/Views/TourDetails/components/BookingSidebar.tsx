"use client";

import type { TourPreview } from "@/api";
import BookingModal from "@/components/Bookings/BookingModal";
import { BookOpen } from "lucide-react";
import { useState } from "react";

interface BookingSidebarProps {
  tour?: TourPreview;
}

export default function BookingSidebar({ tour }: BookingSidebarProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(214, 152, 80, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(214, 152, 80, 0);
          }
        }
        .floating-btn {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
      <button
        onClick={() => setShowBookingModal(true)}
        className="floating-btn fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-accent text-neutral-light font-bold text-sm md:text-base shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 border-2 border-accent/50 backdrop-blur-sm hover:border-white"
      >
        <BookOpen className="w-5 md:w-6 h-5 md:h-6 animate-pulse" />
        <span>Book Now</span>
      </button>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedTour={tour || null}
      />
    </>
  );
}
