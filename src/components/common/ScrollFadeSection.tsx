"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollFadeSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Scroll Fade Section Component
 * Fades in content as user scrolls down the page
 * Creates smooth progressive reveal of sections
 */
export default function ScrollFadeSection({
  children,
  className = "",
}: ScrollFadeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Animate opacity from 0 to 1 based on scroll position
  const opacity = useTransform(scrollY, [0, 400, 800], [0, 0.5, 1], {
    clamp: true,
  });

  // Slight translateY animation for elegance
  const translateY = useTransform(scrollY, [0, 400, 800], [30, 15, 0], {
    clamp: true,
  });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: translateY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
