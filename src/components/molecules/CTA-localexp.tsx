"use client";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function CTALocalExpert() {
  return (
    <section className="bg-primary text-bg py-24 snap-start">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-heading font-bold"
            style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
          >
            Talk to a Local Travel Expert
          </h2>

          <p className="mt-6 text-bg/90 leading-relaxed">
            Not sure where to begin? Our local experts help you choose the right
            destinations, activities, and travel pace — all tailored to you.
          </p>

          <div className="mt-8">
            <Button variant="secondary">Get In Touch</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden"
        >
          <img
            src="/CTA-images/CTA-hero-kta.jpeg"
            alt="Local guide"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
