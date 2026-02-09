"use client";

import { motion } from "framer-motion";

export default function PrivacyHero() {
  return (
    <section className="relative py-28 sm:py-36 md:py-48 lg:py-64 flex items-center justify-center overflow-hidden bg-primary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orb 1 */}
        <motion.div
          className="absolute top-5 sm:top-10 -left-20 sm:-left-10 w-40 sm:w-64 h-40 sm:h-64 bg-accent/5 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating orb 2 */}
        <motion.div
          className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating orb 3 */}
        <motion.div
          className="absolute top-1/2 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-accent/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0 0", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl sm:max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-neutral-light mb-3 sm:mb-4 md:mb-6 leading-tight">
            Privacy Policy
          </h1>

          <p className="font-body text-xs sm:text-sm md:text-lg lg:text-xl text-neutral-light/90 leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect
            your information.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 sm:mt-10 md:mt-16 lg:mt-20"
        >
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-neutral-light/60">
            <span className="text-xs sm:text-sm font-medium">
              Scroll to explore
            </span>
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
