"use client";

import { motion } from "framer-motion";
import { MapPinned, Users, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      id: 1,
      title: "Guided by Locals",
      description:
        "Our guides are lifelong Yarmouth residents who genuinely care about sharing their home.",
      icon: Users,
    },
    {
      id: 2,
      title: "Hidden Gems",
      description:
        "We take you beyond guidebooks to discover authentic experiences locals actually love.",
      icon: MapPinned,
    },
    {
      id: 3,
      title: "Personalized Itineraries",
      description:
        "No cookie-cutter tours. Each experience is tailored to your interests and pace.",
      icon: Zap,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-light">
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
            What Sets Us Apart
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 font-heading">
            Why Choose Know A Local
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                className="group relative p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon Container */}
                <motion.div
                  className="mb-6"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-14 h-14 bg-accent/15 rounded-lg flex items-center justify-center group-hover:bg-accent/25 transition-colors duration-300">
                    <IconComponent
                      className="w-7 h-7 text-accent"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-primary mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-neutral-dark leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
