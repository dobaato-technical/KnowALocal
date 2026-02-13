"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function TourDetailHero({ tour }: any) {
  // Use galleryImages if available, otherwise fallback to main image
  const images =
    tour.galleryImages && tour.galleryImages.length > 0
      ? tour.galleryImages.map((img: any) => img.asset.url)
      : tour.image?.asset?.url
        ? [tour.image.asset.url, tour.image.asset.url, tour.image.asset.url]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (images.length || 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      images.length ? (prev - 1 + images.length) % images.length : 0,
    );
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, images.length]);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {images.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
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

          {/* Advanced Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="p-3 md:p-4 rounded-full bg-white/15 hover:bg-white/30 transition-all duration-300 text-white backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="p-3 md:p-4 rounded-full bg-white/15 hover:bg-white/30 transition-all duration-300 text-white backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
            </motion.button>
          </div>

          {/* Enhanced Dots */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
            {images.map((_: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-accent w-8 h-3 shadow-lg"
                    : "bg-white/40 w-2 h-2 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-accent font-bold uppercase tracking-[0.2em] text-sm md:text-base mb-4 block drop-shadow-lg"
            >
              Experience Adventure
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-xl tracking-tight leading-tight font-heading">
              {tour.title}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1.5 bg-gradient-to-r from-accent to-orange-400 mx-auto mb-8 rounded-full shadow-lg"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg font-light"
            >
              {tour.location}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <motion.div className="w-1 h-2 bg-white/60 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
