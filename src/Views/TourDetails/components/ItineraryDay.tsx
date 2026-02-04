"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function ItineraryDay({ tour, day }: any) {
  const dayData = tour.itinerary.find((item: any) => item.day === day);

  if (!dayData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-dark/5 p-6 md:p-8 shadow-sm mb-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white font-bold">
          {day}
        </div>
        <h3 className="font-heading text-xl md:text-2xl font-bold">
          {dayData.title}
        </h3>
      </div>

      <div className="relative pl-8">
        {/* Timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-accent/20" />

        <div className="space-y-6">
          {dayData.activities.map((activity: any, index: number) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[1.375rem] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-white" />

              <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                <div className="flex items-center gap-2 text-accent bg-accent/5 px-2 py-0.5 rounded text-xs font-bold w-fit uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
                <p className="text-dark/80 text-base md:text-lg leading-relaxed">
                  {activity.activity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
