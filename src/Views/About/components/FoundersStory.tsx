"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FoundersStory() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <span className="text-accent font-semibold uppercase tracking-wide text-sm">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 mb-6 font-heading">
                Trisha & Keisha
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-neutral-dark leading-relaxed">
                Our guides, Trisha and Keisha, were born and raised in rural
                Nova Scotia’s Tri-County region — a place that shaped who we are
                and how we see the world.
              </p>

              <p className="text-lg text-neutral-dark leading-relaxed">
                Growing up here meant learning how to make fun out of nothing
                and developing a deep appreciation for the land, the coast, and
                the people who call it home.
              </p>

              <p className="text-lg text-neutral-dark leading-relaxed">
                Today, we’re proud to share that same sense of place with
                visitors. As locals, we don’t just guide tours — we share
                personal stories, local knowledge, and the little details you
                only learn by growing up here. Our goal is to help you feel
                welcomed and connected, so your time in Nova Scotia feels less
                like a tour and more like spending the day with someone who
                truly knows the area.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <div className="border-l-4 border-accent pl-4">
                <blockquote className="text-xl text-primary font-semibold italic">
                  "Yarmouth isn't just where we live—it's in our blood. We want
                  everyone who visits to feel that same connection."
                </blockquote>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Large image (top left, spans) */}
            <div className="col-span-1 md:col-span-2 relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/LandingImages/hero-bg.jpg"
                alt="Trisha and Keisha exploring Yarmouth"
                fill
                className="object-cover"
              />
            </div>

            {/* Smaller images */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/LandingImages/hero-bg.jpg"
                alt="Local experience"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/LandingImages/hero-bg.jpg"
                alt="Yarmouth coastline"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
