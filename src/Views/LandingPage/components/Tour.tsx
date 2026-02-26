"use client";

import { getFeaturedTours, type TourPreview } from "@/api";
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

function Tours() {
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        const response = await getFeaturedTours();
        const data = response.data || [];
        // Shuffle and pick up to 4 random featured tours
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 4);
        setTours(shuffled);
      } catch (error) {
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTours();
  }, []);

  return (
    <div className="w-full text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading font-bold"
            style={{ fontSize: "clamp(24px, 5vw, 40px)" }}
          >
            Explore Our Tours
          </motion.h2>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 sm:gap-8 lg:gap-12">
            {/* Description */}
            <p className="text-dark/70 max-w-2xl leading-relaxed text-sm sm:text-base">
              Handpicked experiences that showcase the natural beauty, culture,
              and adventure Canada has to offer.
            </p>

            {/* Explore All Tours Button - Bold & Modern */}
            <Link
              href="/explore-all-tours"
              className="shrink-0 w-full sm:w-auto"
            >
              <motion.button
                whileHover="hover"
                initial="initial"
                className="relative text-accent font-medium text-base tracking-tight group whitespace-nowrap pb-2 w-full sm:w-auto text-center sm:text-left"
              >
                <motion.span
                  variants={{
                    initial: { x: 0 },
                    hover: { x: 4 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2"
                >
                  Explore All Tours
                  <motion.span
                    variants={{
                      initial: { x: 0, opacity: 1, rotate: 0, scale: 1 },
                      hover: { x: 8, opacity: 1, rotate: 45, scale: 1.2 },
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <ArrowRight size={22} />
                  </motion.span>
                </motion.span>

                <motion.div
                  className="absolute bottom-0 left-0 h-0.75 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "70%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-16">
            <LoadingSpinner label="Loading tours..." className="mb-8" />
            <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] bg-neutral-medium/30 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Cards */}
        {!isLoading && tours.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-dark/60">
              No tours available at the moment.
            </p>
          </div>
        )}

        {/* Cards */}
        {!isLoading && tours.length > 0 && (
          <div className="mt-16 grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((tour) => (
              <motion.div
                key={tour._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link href={`/tour-details/${tour._id}`}>
                  <div className="relative h-70 rounded-2xl overflow-hidden cursor-pointer bg-gray-200">
                    {tour.image?.asset?.url ? (
                      <Image
                        src={tour.image.asset.url}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 font-semibold">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for badge legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Rating Badge */}
                    {tour.rating && tour.rating > 0 && (
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-md flex items-center gap-1.5">
                        <span className="text-lg text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-900">
                          {tour.rating.toFixed(1)}/5
                        </span>
                      </div>
                    )}

                    {/* Price Tag */}
                    {tour.basePrice && (
                      <div className="absolute top-4 left-4 bg-accent/90 text-white px-3.5 py-2 rounded-2xl shadow-md font-bold">
                        ${tour.basePrice}
                      </div>
                    )}
                  </div>
                </Link>

                <h3 className="mt-6 font-heading text-xl">{tour.title}</h3>

                <p className="mt-2 text-sm text-dark/70 max-w-md line-clamp-2">
                  {tour.description}
                </p>

                <div className="mt-4">
                  <Link href={`/tour-details/${tour._id}`}>
                    <Button variant="subtle">View Detail</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Tours);
