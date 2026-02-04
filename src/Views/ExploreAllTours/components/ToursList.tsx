"use client";

import Button from "@/components/ui/Button";
import tours from "@/data/travelLocations.json";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ToursList() {
  return (
    <section className="bg-bg text-dark py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          All Available Tours
        </motion.h2>

        <p className="mt-4 max-w-xl text-dark/70">
          Handpicked experiences that showcase the natural beauty, culture, and
          adventure Canada has to offer.
        </p>

        {/* Cards Grid */}
        <div className="mt-16 grid gap-12 md:grid-cols-4">
          {tours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
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
    </section>
  );
}
