"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function ItineraryTimeline({ tour }: any) {
  if (!tour.itinerary || tour.itinerary.length === 0) return null;

  // Flatten all activities from the itinerary array
  const activities = tour.itinerary.flatMap((item: any) =>
    item.activities
      ? item.activities.map((act: any) => ({
          ...act,
          dayTitle: item.title,
        }))
      : [],
  );

  if (activities.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Clock className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            Tour Timeline
          </h3>
          <p className="text-secondary/60 text-sm mt-1">Your 2-hour journey</p>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {/* Vertical line */}
        {activities.length > 1 && (
          <div
            className="absolute left-3.5 top-8 bottom-0 w-1 bg-accent"
            style={{ height: `calc(100% - 32px)` }}
          />
        )}

        {/* Activities */}
        <div className="space-y-8">
          {activities.map((activity: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-6 group"
            >
              {/* Time Circle */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-8 h-8 rounded-full bg-accent border-4 border-[#f8f1dd] shadow-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 rounded-full text-accent text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-primary/90 leading-relaxed">
                      <span className="font-bold text-accent">
                        {activity.activity.split(" ").slice(0, 2).join(" ")}
                      </span>{" "}
                      <span className="text-secondary/70">
                        {activity.activity.split(" ").slice(2).join(" ")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
