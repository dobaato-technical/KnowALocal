"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface SectionHeroProps {
  /** Hero image source */
  imageSrc: string;
  /** Hero image alt text */
  imageAlt: string;
  /** Main heading */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional CTA or additional content */
  children?: ReactNode;
  /** Optional custom className */
  className?: string;
  /** Optional gradient overlay opacity (0-1) */
  overlayOpacity?: number;
}

/**
 * Reusable Section Hero Component
 *
 * Used across multiple pages (Contact Us, About, Tours, etc.)
 * Provides consistent hero experience with parallax, overlay, and text styling
 *
 * @example
 * <SectionHero
 *   imageSrc="/images/contact.jpg"
 *   imageAlt="Contact Us"
 *   title="Get in Touch"
 *   subtitle="We'd love to hear from you"
 * />
 */
export default function SectionHero({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  children,
  className = "",
  overlayOpacity = 0.65,
}: SectionHeroProps) {
  return (
    <section
      className={`relative h-96 md:h-[500px] w-full overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0 bg-linear-to-r from-black to-black/20"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-4"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-tight leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Additional content (e.g., CTA buttons) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
