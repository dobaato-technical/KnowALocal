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
    <section className="py-16 md:py-20 bg-secondary/15">
      <div className="max-w-[78rem] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 block">
            Local Flavors
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-2 text-shadow-accent">
            Tour Specialties
          </h2>
          <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto mt-4">
            Discover the culinary delights unique to this tour
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => (
            <motion.div
              key={`${specialty.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-neutral-medium/20 border border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-lg h-full"
            >
              {/* Background Accent */}
              <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors duration-300" />

              {/* Content */}
              <div className="relative p-6 flex flex-col h-full gap-4">
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {specialty.id ? (
                    iconMap[specialty.id] || (
                      <ShoppingCart className="w-12 h-12 text-accent" />
                    )
                  ) : (
                    <ShoppingCart className="w-12 h-12 text-accent" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-heading text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                  {specialty.name}
                </h3>

                {/* Description */}
                <p className="text-secondary/70 text-sm md:text-base flex-grow">
                  {specialty.description}
                </p>

                {/* Price Tag */}
                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <span className="text-secondary/60 text-sm font-medium">
                    Included in Tour
                  </span>
                  <span className="inline-flex items-center justify-center bg-accent text-white font-bold rounded-lg px-4 py-2 text-base md:text-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    ${specialty.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
