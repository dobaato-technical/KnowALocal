"use client";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CTALocalExpert() {
  return (
    <section className="relative bg-primary text-bg py-24 snap-start overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Badge/Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-2 bg-bg/10 backdrop-blur-sm text-bg px-4 py-2 rounded-full text-sm font-medium border border-bg/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Expert Guidance
            </span>
          </motion.div>

          <h2
            className="font-heading font-bold leading-tight"
            style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
          >
            Talk to a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Local Travel Expert</span>
              <span className="absolute bottom-2 left-0 w-full h-10 bg-accent/5 -rotate-2" />
            </span>
          </h2>

          <p className="text-bg/90 leading-relaxed text-lg">
            Not sure where to begin? Our local experts help you choose the right
            destinations, activities, and travel pace — all tailored to you.
          </p>

          {/* Features list */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3"
          >
            {[
              "Personalized itinerary planning",
              "Insider tips and hidden gems",
              "24/7 support during your trip",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-bg/90">
                <svg
                  className="w-5 h-5 text-accent flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button variant="secondary" className="shadow-lg hover:shadow-xl">
              Get In Touch
            </Button>
            <Button
              variant="outline"
              className="border-bg/30 text-bg hover:bg-bg/10 hover:border-bg"
            >
              View Examples
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 pt-4 border-t border-bg/20"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-accent/20 border-2 border-primary flex items-center justify-center text-xs"
                >
                  👤
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="text-bg font-medium">500+ travelers helped</p>
              <p className="text-bg/70">this month</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Main image container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              <Image
                src="/CTA-images/CTA-hero-kta.jpeg"
                alt="Local travel expert providing personalized guidance"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Decorative floating element */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 backdrop-blur-sm rounded-2xl rotate-12 hidden md:block"
          />
        </motion.div>
      </div>
    </section>
  );
}
