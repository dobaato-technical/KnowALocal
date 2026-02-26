"use client";

import { motion } from "framer-motion";
import { Globe, MapPin, Users } from "lucide-react";

const highlights = [
  {
    icon: Users,
    title: "Small Group Experiences",
    description:
      "Personalized tours for 1-4 guests with customizable itineraries.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "Guided by passionate locals Trisha & Keisha who know every hidden gem.",
  },
  {
    icon: Globe,
    title: "Sustainable Adventures",
    description:
      "Flexible pick-up, rainy day alternatives, and unforgettable coastal experiences.",
  },
];

export default function AboutUs() {
  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-neutral-dark text-sm tracking-widest uppercase font-medium">
              Know A Local Awaits
            </span>

            <h2
              className="font-heading text-primary mt-4 mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 48px)" }}
            >
              About Us
            </h2>

            <p className="text-neutral-dark/90 text-base sm:text-lg leading-relaxed mb-6">
              Know A Local was created with one simple idea: the best way to
              experience rural Nova Scotia is through the people who live here.
              We offer small, locally guided tours that showcase the hidden
              gems, coastal beauty, and everyday charm you won’t always find on
              a map. From quiet seaside stops to scenic drives and local
              favourites, our tours are designed to feel relaxed, personal, and
              authentic.
            </p>

            <p className="text-neutral-dark/80 text-base sm:text-lg leading-relaxed mb-10">
              As locals ourselves, we’re passionate about sharing the places we
              love while supporting rural communities and encouraging meaningful
              tourism beyond the usual routes. Whether you’re visiting for the
              first time or returning to explore more deeply, our goal is to
              help you slow down, connect with the region, and truly get to know
              Nova Scotia — like a local.
            </p>

            {/* Highlights */}
            <div className="space-y-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-neutral-medium flex items-center justify-center">
                      <item.icon
                        className="w-5 h-5 text-primary"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-primary text-lg font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-neutral-dark/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Overlapping tilted images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            {/* Back card - tilted left */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: -8 }}
              whileHover={{ zIndex: 20, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ zIndex: 1 }}
              className="absolute top-12 left-0 w-[70%] h-[60%] bg-secondary rounded-3xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src="/LandingImages/cape-forchu.jpg"
                alt="Cape Forchu Lighthouse"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>

            {/* Front card - tilted right */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: 8 }}
              whileHover={{ zIndex: 20, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ zIndex: 2 }}
              className="absolute bottom-12 right-0 w-[70%] h-[60%] bg-accent/90 rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            >
              <img
                src="/LandingImages/brier-island-whale-tours.jpg"
                alt="Brier Island Whale Tours"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>

            {/* Decorative accent circle */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-40 h-40 bg-accent/15 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
