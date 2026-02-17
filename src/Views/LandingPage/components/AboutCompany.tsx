"use client";
import { motion } from "framer-motion";
import { MapPinned, Mountain, Waves } from "lucide-react";

const values = [
  {
    icon: MapPinned,
    title: "Locally Guided Experiences",
    desc: "Explore Nova Scotia with passionate locals who know the stories, culture, and hidden spots.",
  },
  {
    icon: Mountain,
    title: "Hidden Gems & Scenic Routes",
    desc: "Discover quiet seaside stops, scenic drives, and local favourites you won’t find on a typical map.",
  },
  {
    icon: Waves,
    title: "Authentic & Community-Focused",
    desc: "upport rural communities while enjoying personal, relaxed, and meaningful tourism experiences.",
  },
];

export default function About() {
  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: Overlapping tilted images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            {/* Back card - tilted right */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-8 right-0 w-[75%] h-[65%] bg-[#69836a] rounded-2xl  overflow-hidden"
            >
              <img
                src="/drive-images/Town-of-Yarmouth-DaveyandSky.jpg"
                alt="Town of Yarmouth"
                className="w-full h-full object-cover rounded-2xl"
              />
            </motion.div>

            {/* Front card - tilted left */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-8 left-0 w-[75%] h-[65%] bg-[#335358] rounded-2xl overflow-hidden"
            >
              <img
                src="/drive-images/Trout-Point-Lodge-Hot-Tub-DaveyandSky.jpg"
                alt="Trout Point Lodge Hot Tub"
                className="w-full h-full object-cover rounded-2xl"
              />
            </motion.div>

            {/* Decorative accent circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d69850]/20 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#774738] text-sm tracking-widest uppercase font-medium">
              About Us
            </span>

            <h2
              className="font-heading text-[#335358] mt-4 mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 48px)" }}
            >
              Know A Local
            </h2>

            <p className="text-[#335358]/80 text-base sm:text-lg leading-relaxed mb-8">
              Know A Local offers small, locally guided tours designed to help
              you experience rural Nova Scotia through the eyes of the people
              who call it home. We take you beyond the typical tourist paths to
              discover hidden gems, coastal beauty, and authentic local charm.
            </p>

            {/* Values list */}
            <div className="space-y-6 mt-10">
              {values.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-[#bcd2c2] flex items-center justify-center">
                      <item.icon
                        className="w-5 h-5 text-[#335358]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-[#335358] text-xl mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#335358]/70 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
