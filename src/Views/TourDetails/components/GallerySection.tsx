"use client";

import { motion } from "framer-motion";
import { ImageGallery } from "./carousel-circular-image-gallery";

interface GallerySectionProps {
  images?: any[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Gallery Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
            Gallery
          </motion.span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary">
            Tour Highlights
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-accent to-orange-400 rounded-full mx-auto shadow-lg"
          />
        </motion.div>

        {/* Gallery Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ImageGallery images={images} />
        </motion.div>
      </div>
    </section>
  );
}
