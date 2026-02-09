"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Mountain, Waves } from "lucide-react";

export default function OurValues() {
  const values = [
    {
      id: 1,
      title: "Local Knowledge",
      description:
        "Born and raised here. We don't just work in Yarmouth—we live and love it.",
      icon: MapPin,
    },
    {
      id: 2,
      title: "Slow Travel",
      description:
        "Take your time. Experience over itinerary. Quality over quantity.",
      icon: Waves,
    },
    {
      id: 3,
      title: "Authentic Experiences",
      description:
        "Skip the tourist traps. Discover what locals actually love about this place.",
      icon: Heart,
    },
    {
      id: 4,
      title: "Nature First",
      description:
        "Sustainable tourism that respects and preserves the ecosystems we explore.",
      icon: Mountain,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-semibold uppercase tracking-wide text-sm">
            Our Foundation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 font-heading">
            Core Values
          </h2>
          <p className="text-lg text-neutral-dark mt-4 max-w-2xl mx-auto">
            These principles guide everything we do and how we share Yarmouth
            with the world.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={value.id}
                variants={cardVariants}
                className="group bg-neutral-light rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <IconComponent
                      className="w-8 h-8 text-accent"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 font-heading">
                  {value.title}
                </h3>
                <p className="text-neutral-dark leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
