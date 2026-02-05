"use client";

import { DatePicker } from "@/components/common/DatePicker";
import Button from "@/components/ui/Button";
import { Info } from "lucide-react";
import { useState } from "react";

export default function BookingSidebar({ tour }: any) {
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <div className="bg-neutral-light rounded-[2rem] border border-primary/10 shadow-xl p-8 lg:p-10 sticky top-32">
      <div className="space-y-6">
        <div className="group">
          <label className="block text-[10px] font-bold text-primary mb-2 uppercase tracking-widest transition-colors group-focus-within:text-accent">
            Select Departure Date
          </label>
          <div className="relative">
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-primary mb-2 uppercase tracking-widest transition-colors group-focus-within:text-accent">
            Adventure Group Size
          </label>
          <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-2.5 border-2 border-primary/5 transition-all focus-within:border-accent/30 shadow-inner">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-primary text-lg font-bold hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95"
            >
              −
            </button>
            <div className="text-center">
              <span className="block text-xl font-bold text-primary font-heading leading-none">
                {guests}
              </span>
              <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">
                Explorers
              </span>
            </div>
            <button
              onClick={() => setGuests(guests + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-primary text-lg font-bold hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-neutral-light py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all border-none transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => alert("Checking availability...")}
          >
            Check Availability
          </Button>
          <Button
            variant="secondary"
            className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white py-4 rounded-xl font-bold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => alert("Applying now...")}
          >
            Apply Now
          </Button>
        </div>

        <div className="mt-8 py-5 border-t border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-secondary font-medium leading-relaxed">
                Includes expert local guidance, premium gear, and gourmet
                coastal refreshments.
                <span className="block mt-0.5 text-primary/40 font-bold uppercase tracking-tighter">
                  Flex-cancel available
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
