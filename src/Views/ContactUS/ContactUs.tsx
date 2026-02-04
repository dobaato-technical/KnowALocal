"use client";

import SectionHero from "@/components/common/SectionHero";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import DisclaimerSection from "./components/DisclaimerSection";

/* --------- Dynamic Imports --------- */
const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

/* --------- Component --------- */
export default function ContactUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <main className="relative bg-neutral-light">
      <Header />

      {/* ========== Hero Section ========== */}
      <SectionHero
        imageSrc="/CTA-images/travel-to-canada.jpeg"
        imageAlt="Contact Us"
        title="Get in Touch"
        subtitle="Have questions? We're here to help you plan your perfect journey."
      />

      {/* ========== Main Content ========== */}
      <section className="py-16 md:py-24 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* --------- Contact Information --------- */}
            <motion.div variants={itemVariants}>
              <ContactInfo />
            </motion.div>

            {/* --------- Contact Form --------- */}
            <motion.div variants={itemVariants}>
              <ContactForm />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== Disclaimer Section ========== */}
      <DisclaimerSection />

      <Footer />
    </main>
  );
}
