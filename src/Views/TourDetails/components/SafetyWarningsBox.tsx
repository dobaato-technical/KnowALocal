"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface SafetyWarningsBoxProps {
  warnings: string[];
}

export default function SafetyWarningsBox({
  warnings,
}: SafetyWarningsBoxProps) {
  if (!warnings || warnings.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4 font-heading tracking-tight">
              Key Rules & Requirements
            </h2>
            <div className="h-1.5 w-20 bg-accent rounded-full"></div>
          </div>

          <motion.div className="grid md:grid-cols-2 gap-6">
            {warnings.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 items-start"
              >
                {/* Tick Icon */}
                <div className="flex-shrink-0 text-[#d69850] mt-1">
                  <Icons.Check size={20} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-[#335358] text-base md:text-lg font-medium leading-relaxed">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
