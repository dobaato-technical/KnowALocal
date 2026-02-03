"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

/**
 * Parallax Image Component
 * Creates depth effect by moving background image slower than scroll
 *
 * @param offset - Parallax intensity (default 40). Higher = more dramatic effect
 * @param className - Additional Tailwind classes
 * @param children - Content to overlay on parallax background
 */
export default function ParallaxImage({
  children,
  offset = 40,
  className = "",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Create parallax effect: background moves slower than scroll
  const y = useTransform(scrollY, [0, 1000], [0, -offset], {
    clamp: false,
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background layer */}
      <motion.div style={{ y }} className="absolute inset-0 w-full">
        {children}
      </motion.div>
    </div>
  );
}
