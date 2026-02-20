"use client";

import Button from "@/components/ui/button";
import { getToursPreview, type TourPreview } from "@/sanity/lib/queries";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ToursList() {
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        console.log("🔍 ToursList: Fetching tours...");
        const data = await getToursPreview();
        console.log("✅ ToursList: Fetched", data.length, "tours");
        console.log("📋 First tour:", data[0]);
        setTours(data);
      } catch (error) {
        console.error("❌ ToursList: Error loading tours:", error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTours();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-bg text-dark py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-heading font-bold text-3xl mb-4">
            All Available Tours
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-100 bg-neutral-medium/30 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        {/* Empty State */}
        {tours.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-dark/60">
              No tours available at the moment.
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {tours.length > 0 && (
          <div className="mt-16 grid gap-12 md:grid-cols-4">
            {tours.map((tour) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/tour-details/${tour.slug.current}`}>
                  <div className="relative h-70 rounded-2xl overflow-hidden cursor-pointer bg-gray-200">
                    {tour.image?.asset?.url ? (
                      <Image
                        src={tour.image.asset.url}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
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

                <p className="mt-2 text-sm text-dark/70 max-w-md">
                  {tour.description}
                </p>

                <div className="mt-4">
                  <Link href={`/tour-details/${tour.slug.current}`}>
                    <Button variant="subtle">View Detail</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
