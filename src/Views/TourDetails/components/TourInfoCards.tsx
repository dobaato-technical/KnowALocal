"use client";

import { motion } from "framer-motion";
import {
  Award,
  Compass,
  Mountain,
  ShieldCheck,
  Tag,
  Timer,
  Users,
} from "lucide-react";

export default function TourInfoCards({ tour }: any) {
  const details = [
    {
      icon: <Tag className="w-6 h-6" />,
      label: "Price",
      value: tour.basePrice ? `$${tour.basePrice}` : "N/A",
      color: "text-primary",
    },
    {
      icon: <Compass className="w-6 h-6" />,
      label: "Location",
      value: tour.location || "N/A",
      color: "text-primary",
    },
    {
      icon: <Timer className="w-6 h-6" />,
      label: "Duration",
      value: tour.duration,
      color: "text-primary",
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      label: "Difficulty",
      value: tour.difficulty,
      color: "text-primary",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Rating",
      value: `${tour.rating}/5`,
      color: "text-primary",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      label: "Verified",
      value: "Local Guide",
      color: "text-primary",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Group Size",
      value: tour.maxGroupSize ? `Up to ${tour.maxGroupSize}` : "N/A",
      color: "text-primary",
    },
  ];

  return (
    <section className="py-20 md:py-28  overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#335358]/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-6 md:gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group relative"
            >
              {/* Content */}
              <div className="relative flex flex-col items-center justify-center text-center p-2 md:p-3 h-full">
                {/* Icon Container */}
                <div className="mb-0.5 p-0 rounded-full transition-colors duration-300">
                  <div
                    className={`${detail.color} transition-transform duration-300`}
                  >
                    {detail.icon}
                  </div>
                </div>

                {/* Label */}
                <p className="text-secondary/60 text-xs font-bold uppercase tracking-[0.15em] mb-1">
                  {detail.label}
                </p>

                {/* Value */}
                <p className="text-primary font-heading font-bold text-sm md:text-base leading-snug">
                  {detail.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
