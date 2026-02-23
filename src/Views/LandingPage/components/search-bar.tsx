"use client";

import AvailabilityCheckPopup from "@/components/Calendar/AvailabilityCheckPopup";
import { useState } from "react";

interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
        <button
          onClick={() => setShowAvailabilityModal(true)}
          className="w-full sm:w-64 h-12 sm:h-14 inline-flex items-center justify-center gap-2 font-bold rounded-xl text-sm sm:text-base tracking-wide transition-all bg-accent text-neutral-light hover:opacity-90 active:opacity-75"
        >
          Check Availability
        </button>
      </div>

      <AvailabilityCheckPopup
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
      />
    </div>
  );
}
