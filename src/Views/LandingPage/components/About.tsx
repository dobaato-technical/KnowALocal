"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="snap-start bg-primary text-bg py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          About Know A Local
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 max-w-2xl leading-relaxed text-bg/90"
        >
          Know A Local is built for travelers who seek meaningful journeys, not
          just destinations. We curate authentic Canadian experiences that
          connect you with nature, culture, and local stories — all at a
          relaxed, thoughtful pace.
        </motion.p>
      </div>
    </section>
  );
}
