"use client";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CTAPlanJourney() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/drive-images/Port-Maitland-Unbound-Media.jpg"
        alt="Travel Canada"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-accent/20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold"
          style={{ fontSize: "clamp(36px, 4vw, 48px)" }}
        >
          Ready to Plan Your Canadian Escape?
        </motion.h2>

        <p className="mt-6 max-w-2xl mx-auto text-white/90">
          From rugged coastlines to peaceful lakes, we design journeys that
          match your pace, passion, and curiosity.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Button variant="primary">Start Planning</Button>
          <Button variant="outline">View Tours</Button>
        </div>
      </div>
    </section>
  );
}
