"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TourDetailHero({ tour }: any) {
  const images = [
    tour.image,
    tour.image, // Placeholder for 2nd image
    tour.image, // Placeholder for 3rd image
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
        <button
          onClick={prevSlide}
          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-tight leading-tight font-[family-name:var(--font-merriweather)]">
              {tour.title}
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full shadow-lg" />
          </motion.div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-accent w-10 shadow-lg"
                : "bg-white/50 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
