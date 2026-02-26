"use client";

import { motion } from "framer-motion";

export default function DescriptionSection({ tour }: any) {
  if (!tour.fullDescription) return null;

  return (
    <section className="pt-8 pb-16 md:pt-16 md:pb-28 relative overflow-hidden font-[family-name:var(--font-merriweather)]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#335358]/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
            Tour Overview
          </motion.span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary leading-tight">
            About This Tour
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 rounded-full mb-8 shadow-lg bg-gradient-to-r from-accent to-accent/40"
          />
        </motion.div>

        {/* Description Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="backdrop-blur-sm rounded-xl border border-accent/20 p-6 md:p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
            <p className="text-secondary text-base md:text-lg leading-relaxed font-body font-medium whitespace-pre-wrap">
              {tour.fullDescription}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
