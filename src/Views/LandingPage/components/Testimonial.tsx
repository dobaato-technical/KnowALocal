"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  username: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The experience was absolutely transformative. Exceeded all my expectations.",
    name: "Sarah Johnson",
    username: "@sarahjohnson",
  },
  {
    id: 2,
    quote:
      "Incredible attention to detail and personalized service throughout.",
    name: "Michael Chen",
    username: "@mchen_travels",
  },
  {
    id: 3,
    quote: "Best local experience I've ever had. Highly recommend to everyone!",
    name: "Emma Williams",
    username: "@emmaexplores",
  },
  {
    id: 4,
    quote: "Made my trip unforgettable with authentic local connections.",
    name: "James Rodriguez",
    username: "@jrodriguez_travel",
  },
  {
    id: 5,
    quote: "Professional, reliable, and genuinely passionate about their work.",
    name: "Lisa Park",
    username: "@lisa_adventures",
  },
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);

      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        if (currentIndex > maxIndexForNewWidth) {
          setCurrentIndex(Math.max(0, maxIndexForNewWidth));
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        const visibleCount = getVisibleCount(windowWidth);
        const maxIndex = testimonials.length - visibleCount;

        if (currentIndex >= maxIndex) {
          setDirection(-1);
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        } else {
          setDirection(1);
          setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
        }
      }, 4000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, windowWidth]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  if (!isMounted) return null;

  return (
    <div className="w-full px-4 py-8 sm:py-12 md:py-16 bg-primary dark:bg-primary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent font-medium text-xs sm:text-sm uppercase tracking-wider">
            What Our Travelers Say
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mt-3 sm:mt-4 px-4">
            Transformative Travel Experiences
          </h3>
          <div className="w-16 sm:w-20 h-1 bg-accent mx-auto mt-4 sm:mt-6 rounded-full"></div>
        </motion.div>

        {/* Testimonials Container */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons */}
          <div className="flex justify-center sm:justify-end gap-2 mb-6 sm:mb-8">
            <motion.button
              whileHover={{ scale: canGoPrev ? 1.1 : 1 }}
              whileTap={{ scale: canGoPrev ? 0.95 : 1 }}
              onClick={goPrev}
              disabled={!canGoPrev}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 ${
                canGoPrev
                  ? "bg-accent shadow-md hover:shadow-lg text-primary cursor-pointer"
                  : "bg-accent/30 text-accent/50 cursor-not-allowed"
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: canGoNext ? 1.1 : 1 }}
              whileTap={{ scale: canGoNext ? 0.95 : 1 }}
              onClick={goNext}
              disabled={!canGoNext}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 ${
                canGoNext
                  ? "bg-accent shadow-md hover:shadow-lg text-primary cursor-pointer"
                  : "bg-accent/30 text-accent/50 cursor-not-allowed"
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden relative px-1 sm:px-2">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 20,
              }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`flex-shrink-0 w-full sm:w-1/2 xl:w-1/3 px-2 sm:px-3`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="relative overflow-hidden rounded-lg sm:rounded-xl p-6 sm:p-8 h-full bg-white border border-accent/30 shadow-md hover:shadow-lg transition-shadow duration-300"
                    whileHover={{
                      boxShadow: "0 10px 15px -3px rgba(214, 152, 80, 0.15)",
                    }}
                  >
                    {/* Quote Icon Background */}
                    <div className="absolute -top-4 -right-4 opacity-5">
                      <Quote size={100} className="text-accent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Quote Text - Centered */}
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm sm:text-base text-center text-neutral-dark font-medium leading-relaxed">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                      </div>

                      {/* Author Info - Bottom */}
                      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-accent/20">
                        <div className="text-center">
                          <h4 className="font-bold text-sm sm:text-base text-accent">
                            {testimonial.name}
                          </h4>
                          <p className="text-neutral-dark text-xs sm:text-sm mt-1">
                            {testimonial.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-2">
            {Array.from(
              { length: Math.max(1, testimonials.length - visibleCount + 1) },
              (_: any, index: any) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === currentIndex}
                >
                  <motion.div
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? "bg-accent" : "bg-accent/40"
                    }`}
                    animate={{
                      scale: index === currentIndex ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: index === currentIndex ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  />
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-accent/30"
                      animate={{
                        scale: [1, 1.6],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
