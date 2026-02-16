"use client";

import { motion } from "framer-motion";
import {
  Apple,
  Cake,
  Fish,
  Flame,
  ShoppingCart,
  Soup,
  Utensils,
  Wine,
  Zap,
} from "lucide-react";
import { SpecialtiesSectionProps } from "./types";

// Icon mapping based on specialty IDs
const iconMap: Record<string, React.ReactNode> = {
  "cape-1": <Utensils className="w-12 h-12 text-accent" />,
  "cape-2": <Soup className="w-12 h-12 text-accent" />,
  "cape-3": <Cake className="w-12 h-12 text-accent" />,
  "port-1": <Utensils className="w-12 h-12 text-accent" />,
  "port-2": <Fish className="w-12 h-12 text-accent" />,
  "port-3": <Cake className="w-12 h-12 text-accent" />,
  "smuggler-1": <Wine className="w-12 h-12 text-accent" />,
  "smuggler-2": <Fish className="w-12 h-12 text-accent" />,
  "smuggler-3": <Cake className="w-12 h-12 text-accent" />,
  "lake-1": <Flame className="w-12 h-12 text-accent" />,
  "lake-2": <Zap className="w-12 h-12 text-accent" />,
  "lake-3": <Apple className="w-12 h-12 text-accent" />,
};

export const SpecialtiesSection = ({
  specialties,
}: SpecialtiesSectionProps) => {
  if (!specialties || specialties.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
            Add-ons & Experiences
          </motion.span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary leading-tight">
            Tour Specialties
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-accent rounded-full mx-auto"
          />
          <p className="text-secondary/70 text-lg max-w-3xl mx-auto mt-8">
            Enhance your tour experience with our carefully curated add-ons
          </p>
        </motion.div>

        <div className="space-y-4">
          {specialties.map((specialty, index) => (
            <motion.div
              key={`${specialty.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex items-center gap-6 p-6 rounded-lg bg-[#f8f1dd]/40 border border-[#bcd2c2]/30 hover:border-[#d69850]/50 hover:bg-[#f8f1dd]/60 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                  {specialty.id ? (
                    iconMap[specialty.id] || (
                      <ShoppingCart className="w-8 h-8" />
                    )
                  ) : specialty.icon ? (
                    <span className="text-3xl">{specialty.icon}</span>
                  ) : (
                    <ShoppingCart className="w-8 h-8" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#335358] text-base md:text-lg mb-1">
                  {specialty.name}
                </h3>
                <p className="text-[#335358]/70 text-sm leading-relaxed">
                  {specialty.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[#d69850] font-bold text-lg md:text-xl">
                  ${specialty.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
