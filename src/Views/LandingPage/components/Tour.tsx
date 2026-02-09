"use client";

import Button from "@/components/ui/Button";
import tours from "@/data/travelLocations.json";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Tours() {
  const [showAll, setShowAll] = useState(false);
  const visibleTours = showAll ? tours : tours.slice(0, 4);

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
              className="flex-shrink-0 w-full sm:w-auto"
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
                  className="absolute bottom-0 left-0 h-[3px] bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "70%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-12 md:grid-cols-4">
          {visibleTours.map((tour) => (
            <motion.div
              key={tour.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link href={`/tour-details/${tour.slug}`}>
                <div className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge */}
                  {tour.rating && tour.rating > 0 && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-md flex items-center gap-1.5">
                      <span className="text-lg text-yellow-500">★</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tour.rating.toFixed(1)}/5
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <h3 className="mt-6 font-heading text-xl">{tour.title}</h3>

              <p className="mt-2 text-sm text-dark/70 max-w-md">
                {tour.description}
              </p>

              <div className="mt-4">
                <Link href={`/tour-details/${tour.slug}`}>
                  <Button variant="subtle">Learn More</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
