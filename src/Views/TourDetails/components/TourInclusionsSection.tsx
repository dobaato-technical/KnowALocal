"use client";

import { motion } from "framer-motion";

interface Inclusion {
  title: string;
  description: string;
  icon?: string;
}

interface TourInclusionsSectionProps {
  inclusions: Inclusion[];
}

export default function TourInclusionsSection({
  inclusions,
}: TourInclusionsSectionProps) {
  if (!inclusions || inclusions.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#335358] mb-2 font-heading">
            What's Included
          </h2>
          <div className="h-1 w-16 bg-[#d69850] rounded mb-12"></div>

          <motion.div className="grid md:grid-cols-2 gap-6">
            {inclusions.map((inclusion, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 p-6 bg-[#f8f1dd]/50 rounded-lg border border-[#bcd2c2]/30 hover:border-[#d69850]/50 transition-colors"
              >
                {/* Icon */}
                {inclusion.icon && (
                  <div className="flex-shrink-0 text-3xl">{inclusion.icon}</div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#335358] text-lg mb-2">
                    {inclusion.title}
                  </h3>
                  <p className="text-[#335358]/80 text-sm leading-relaxed">
                    {inclusion.description}
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
