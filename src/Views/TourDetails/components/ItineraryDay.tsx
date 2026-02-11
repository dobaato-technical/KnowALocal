"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ItineraryDay({ tour, day }: any) {
  const dayData = tour.itinerary.find((item: any) => item.day === day);
  const [isOpen, setIsOpen] = useState(false);

  if (!dayData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-neutral-light rounded-3xl border border-primary/10 shadow-lg overflow-hidden mb-5 transition-all hover:border-accent/20 group/card"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left"
      >
        <div className="flex items-center gap-5 md:gap-6">
          <div className="flex flex-col items-center justify-center min-w-[50px] h-[50px] md:min-w-[64px] md:h-[64px] rounded-2xl bg-primary text-neutral-light font-bold shadow-md group-hover/card:bg-accent transition-all duration-500 transform group-hover/card:scale-105">
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] opacity-70">
              Day
            </span>
            <span className="text-xl md:text-2xl font-heading -mt-0.5">
              {day}
            </span>
          </div>
          <div>
            <h3 className="font-heading text-lg md:text-xl font-bold text-primary group-hover/card:text-accent transition-colors duration-300">
              {dayData.title}
            </h3>
            <p className="text-secondary font-bold text-[8px] md:text-[10px] mt-0.5 uppercase tracking-[0.2em] opacity-60">
              Daily Journey Highlights
            </p>
          </div>
        </div>
        <div
          className={`p-2 md:p-2.5 rounded-full transition-all duration-500 ${isOpen ? "rotate-180 bg-accent text-neutral-light shadow-md" : "bg-primary/5 text-primary hover:bg-primary/10"}`}
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="px-6 md:px-10 pb-8 pt-2">
              <div className="h-px bg-primary/10 mb-6 w-full" />
              <div className="prose prose-sm md:prose-base max-w-none">
                <p className="text-primary/90 text-sm md:text-base leading-relaxed font-body font-medium">
                  {dayData.activities && dayData.activities.length > 0 ? (
                    dayData.activities.map((activity: any, index: number) => {
                      const words = activity.activity.split(" ");
                      const firstTwo = words.slice(0, 2).join(" ");
                      const rest = words.slice(2).join(" ");

                      return (
                        <span key={index} className="inline-block mb-2 mr-2">
                          <span className="text-accent font-bold decoration-primary/20 decoration-2 underline-offset-4">
                            {firstTwo}
                          </span>{" "}
                          <span className="italic text-secondary font-semibold">
                            {rest}
                          </span>
                          {index < dayData.activities.length - 1 ? ". " : "."}
                        </span>
                      );
                    })
                  ) : (
                    <span>No activities available for this day.</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
