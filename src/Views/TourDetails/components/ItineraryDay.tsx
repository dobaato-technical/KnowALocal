"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ItineraryDay({ tour }: any) {
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
    <section className="pt-0 pb-20 md:pb-28 relative overflow-hidden font-[family-name:var(--font-merriweather)]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#335358]/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
            The Journey
          </motion.span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary leading-tight">
            Detailed Itinerary
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 rounded-full mb-8 shadow-lg"
          />
          <p className="text-secondary text-lg md:text-base max-w-7xl leading-relaxed font-body font-medium italic border-l-4 border-accent pl-6 py-2 mb-6 bg-gradient-to-r from-accent/5 to-transparent rounded-r-xl">
            {tour.fullDescription}
          </p>
          <p className="text-secondary/70 text-base md:text-lg max-w-2xl leading-relaxed font-body">
            Everything you need to know about your adventure is mentioned below.
          </p>
        </motion.div>

        {/* Timeline Items */}
        <div className="space-y-4 relative">
          {/* Vertical Line */}
          <div className="absolute left-3.5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />

          {/* Activities */}
          {activities.map((activity: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-5 group relative"
            >
              {/* Timeline Dot */}
              <div className="flex-shrink-0 pt-1 relative z-10">
                <div className="w-8 h-8 rounded-full bg-accent shadow-lg flex items-center justify-center text-neutral-light text-xs font-bold transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl gold-glow border-2 border-white">
                  {index + 1}
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className="backdrop-blur-sm rounded-xl border border-accent/20 p-3 md:p-4 transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-lg group-hover:-translate-y-1"
                  whileHover={{ y: -4 }}
                >
                  <h4 className="text-lg font-bold text-primary mb-2">
                    {activity.activity}
                  </h4>

                  {activity.dayTitle && (
                    <div className="flex items-center gap-1.5 text-secondary text-sm">
                      <MapPin className="w-3.5 h-3.5 text-accent/60" />
                      <span className="font-medium">{activity.dayTitle}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
