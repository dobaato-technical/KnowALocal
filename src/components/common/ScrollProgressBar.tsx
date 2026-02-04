"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll Progress Bar Component
 * Displays a vertical bar on the right side showing page scroll position
 * Only visible on desktop, hidden on mobile
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  // Scale height from 0 to 100% based on scroll
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Desktop version - fixed on right side */}
      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-neutral-medium rounded-full hidden lg:block z-40"
        style={{ opacity: 0.3 }}
      >
        {/* Progress indicator */}
        <motion.div
          className="w-full bg-accent-color rounded-full"
          style={{ height }}
        />
      </motion.div>

      {/* Alternative: Thin top progress bar (commented out) */}
      {/* 
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-color z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      />
      */}
    </>
  );
}
