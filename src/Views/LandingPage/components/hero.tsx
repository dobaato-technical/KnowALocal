"use client";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function hero() {
  return (
    <section className="relative h-screen w-full snap-start overflow-hidden">
      {/* Background Image */}
      <Image
        src="/drive-images/Cape_Forchu_Lighthouse-DaveyandSky.jpg"
        alt="Canada travel destination"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl px-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-bg flex flex-col gap-1 items-start text-primary-lite font-extrabold max-w-5xl tracking-tighter leading-tighter"
            style={{
              fontSize: "clamp(80px, 4vw, 92px)",
            }}
          >
            <span className="leading-tight">
              {" "}
              Discover <span className="text-primary">Canada,</span>
            </span>
            <span className="leading-tight"> One Journey at a Time</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-7xl text-bg/100 font-body text-xl"
          >
            Explore coastal escapes, scenic trails, and authentic local
            experiences curated for travelers who seek more than just
            destinations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10"
          >
            <Button variant="primary">Explore Tours</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
