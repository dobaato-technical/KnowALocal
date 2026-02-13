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
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#f8f1dd] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#335358]/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Background Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 rounded-2xl border border-white/60 shadow-lg group-hover:shadow-xl group-hover:border-accent/30 transition-all duration-300" />

              {/* Content */}
              <div className="relative flex flex-col items-center justify-center text-center p-6 md:p-8 h-full">
                {/* Icon Container */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.1,
                  }}
                  className="mb-6 p-3 rounded-full bg-gradient-to-br from-accent/20 to-orange-100/20 group-hover:from-accent/30 group-hover:to-orange-100/30 transition-colors duration-300"
                >
                  <div
                    className={`${detail.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {detail.icon}
                  </div>
                </motion.div>

                {/* Label */}
                <p className="text-secondary/60 text-xs md:text-sm font-bold uppercase tracking-[0.15em] mb-2.5 group-hover:text-accent transition-colors duration-300">
                  {detail.label}
                </p>

                {/* Value */}
                <p className="text-primary font-heading font-bold text-base md:text-lg leading-snug">
                  {detail.value}
                </p>

                {/* Accent line on hover */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: 40 }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-gradient-to-r from-accent to-orange-400 rounded-full mt-3"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
