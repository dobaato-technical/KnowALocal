"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Hook for scroll-triggered animations
 * Returns opacity value that animates from 0 to 1 as element enters viewport
 *
 * @returns Motion value for opacity (0-1)
 */
export function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [0, 1]);

  return { ref, opacity };
}

/**
 * Hook for parallax scrolling effect
 * @param offset - How much to offset the background (higher = more parallax). Default 50
 * @returns Motion value for Y transform
 */
export function useParallax(offset: number = 50) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -offset], { clamp: false });

  return y;
}

/**
 * Advanced scroll-triggered animation hook
 * Animates element when it enters viewport
 *
 * @param options.threshold - Viewport percentage before element enters (0-1). Default 0.5 (50%)
 * @returns Object with ref and motion values for opacity and translateY
 */
export function useScrollInView(options?: { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const threshold = options?.threshold ?? 0.5;

  // Calculate element position and animate based on scroll
  const opacity = useTransform(scrollY, [0, 500, 1000], [0, 0.5, 1], {
    clamp: true,
  });

  const translateY = useTransform(scrollY, [0, 500, 1000], [40, 20, 0], {
    clamp: true,
  });

  return { ref, opacity, translateY };
}

/**
 * Hook to detect when element is in viewport
 * Uses IntersectionObserver for better performance
 *
 * @returns Object with ref and inView boolean
 */
export function useInViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Optional: unobserve after first intersection
          // observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, inView };
}
