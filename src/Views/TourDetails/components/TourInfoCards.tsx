"use client";

import { motion } from "framer-motion";
import {
  Award,
  Compass,
  Mountain,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";

export default function TourInfoCards({ tour }: any) {
  const details = [
    {
      icon: <Compass className="w-8 h-8" />,
      label: "Location",
      value: tour.location,
      color: "text-primary",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      label: "Duration",
      value: tour.duration,
      color: "text-primary",
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      label: "Difficulty",
      value: tour.difficulty,
      color: "text-primary",
    },
    {
      icon: <Award className="w-8 h-8" />,
      label: "Rating",
      value: `${tour.rating}/5`,
      color: "text-primary",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      label: "Verified",
      value: "Local Guide",
      color: "text-primary",
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: "Group Size",
      value: "Up to 12",
      color: "text-primary",
    },
  ];

  return (
    <section className="py-20 bg-neutral-light">
      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`mb-5 transition-transform duration-300 group-hover:scale-110 ${detail.color}`}
              >
                {detail.icon}
              </div>
              <p className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-60">
                {detail.label}
              </p>
              <p className="text-primary font-heading font-bold text-base md:text-lg">
                {detail.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
