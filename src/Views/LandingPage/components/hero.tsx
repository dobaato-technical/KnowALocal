"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { SearchBar } from "./search-bar";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden scroll-mt-24"
    >
      {/* Background Image — CSS parallax via scale trick, no JS scroll listener */}
      <div className="absolute inset-0 scale-110">
        <Image
          src="/drive-images/Cape_Forchu_Lighthouse-DaveyandSky.jpg"
          alt="Cape Forchu Lighthouse"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Centered */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-5xl space-y-4 sm:space-y-6 md:space-y-8 text-center flex flex-col items-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight font-[family-name:var(--font-merriweather)]"
          >
            Get to know <span className="text-accent-color">Nova Scotia,</span>
            <br /> like a local
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl sm:max-w-3xl leading-relaxed font-medium font-[family-name:var(--font-merriweather)]"
          >
            Explore coastal escapes, scenic trails, and authentic local
            experiences curated for travelers who seek more than just
            destinations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 w-full flex justify-center"
          >
            <SearchBar />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-7 h-7 text-white" />
        </motion.div>
      </motion.div>
    </section>
  );
}
