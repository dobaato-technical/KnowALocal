"use client";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function CTANewsletter() {
  return (
    <section className="bg-bg py-24 border-t border-dark/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading font-bold text-2xl"
        >
          Get Travel Inspiration in Your Inbox
        </motion.h3>

        <p className="mt-4 text-dark/70 max-w-xl mx-auto">
          Hidden places, seasonal travel tips, and curated Canadian experiences
          — no spam, just stories worth reading.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 w-64 border border-dark/20 rounded-lg focus:outline-none"
          />
          <Button variant="primary">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}
