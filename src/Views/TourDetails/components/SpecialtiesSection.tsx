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
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#f8f1dd] via-white to-[#f8f1dd]/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/8 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#335358]/8 rounded-full -ml-48 -mb-48 blur-3xl" />

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
            className="h-1.5 bg-gradient-to-r from-accent to-orange-400 rounded-full mx-auto shadow-lg"
          />
          <p className="text-secondary/70 text-lg max-w-3xl mx-auto mt-8">
            Enhance your tour experience with our carefully curated add-ons
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <motion.div
              key={`${specialty.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl h-full"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/40 border border-white/60 group-hover:border-accent/40 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-orange-100/5 transition-opacity duration-300" />

              {/* Shadow on hover */}
              <div className="absolute inset-0 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 rounded-2xl" />

              {/* Content */}
              <div className="relative p-8 flex flex-col h-full gap-6">
                {/* Icon Container */}
                <motion.div
                  className="flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-accent/20 to-orange-100/20 group-hover:from-accent/30 group-hover:to-orange-100/30 transition-all duration-300 w-fit"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                    {specialty.id ? (
                      iconMap[specialty.id] || (
                        <ShoppingCart className="w-10 h-10" />
                      )
                    ) : specialty.icon ? (
                      <span className="text-4xl">{specialty.icon}</span>
                    ) : (
                      <ShoppingCart className="w-10 h-10" />
                    )}
                  </div>
                </motion.div>

                {/* Name */}
                <div>
                  <h3 className="font-heading text-2xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300 leading-snug">
                    {specialty.name}
                  </h3>
                  {specialty.isClimbing && (
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                      Adventure Activity
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-secondary/70 text-base leading-relaxed flex-grow">
                  {specialty.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 group-hover:border-accent/30 transition-colors">
                  <div>
                    <span className="text-secondary/60 text-sm font-medium block">
                      Add-on Price
                    </span>
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-accent to-orange-400 text-white font-bold rounded-xl px-5 py-3 text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 mt-2">
                      ${specialty.price}
                    </span>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingCart className="w-6 h-6 text-accent" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
