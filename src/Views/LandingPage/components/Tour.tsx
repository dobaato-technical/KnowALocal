"use client";

import Button from "@/components/ui/Button";
import tours from "@/data/travelLocations.json";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Tours() {
  const [showAll, setShowAll] = useState(false);
  const visibleTours = showAll ? tours : tours.slice(0, 4);

  return (
    <section className="snap-start bg-bg text-dark py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          Explore Our Tours
        </motion.h2>

        <p className="mt-4 max-w-xl text-dark/70">
          Handpicked experiences that showcase the natural beauty, culture, and
          adventure Canada has to offer.
        </p>

        {/* Cards */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {visibleTours.map((tour) => (
            <motion.div
              key={tour.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="relative h-[280px] rounded-2xl overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="mt-6 font-heading text-xl">{tour.title}</h3>

              <p className="mt-2 text-sm text-dark/70 max-w-md">
                {tour.description}
              </p>

              <div className="mt-4">
                <Button variant="link">Learn More</Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {tours.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-accent text-bg font-semibold rounded-md hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
