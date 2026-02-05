"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { SearchBar } from "./search-bar";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect: background moves slower than scroll
  const bgY = useTransform(scrollY, [0, 400], [0, -100], { clamp: false });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/drive-images/Cape_Forchu_Lighthouse-DaveyandSky.jpg"
          alt="Cape Forchu Lighthouse"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content - Centered */}
      <div className="relative h-full flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-5xl space-y-8 text-center flex flex-col items-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            Discover <span className="text-accent-color">Nova Scotia,</span>
            <br />
            One Journey at a Time
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/95 max-w-3xl leading-relaxed font-medium"
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
            <SearchBar transparent={true} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
