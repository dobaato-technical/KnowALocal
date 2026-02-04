"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TourDetailHero({ tour }: any) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <Image
        src={tour.image}
        alt={tour.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              {tour.title}
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-2xl">
              {tour.fullDescription}
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-white/60 text-sm">Location</p>
                <p className="text-white font-semibold">{tour.location}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Duration</p>
                <p className="text-white font-semibold">{tour.duration}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Difficulty</p>
                <p className="text-white font-semibold">{tour.difficulty}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Rating</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {tour.rating}/5
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
