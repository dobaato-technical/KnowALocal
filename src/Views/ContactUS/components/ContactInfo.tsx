"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function ContactInfo() {
  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-semibold text-primary mb-2">
          Contact Information
        </h2>
        <div className="h-1 w-16 bg-accent rounded"></div>
      </div>

      <p className="text-neutral-dark text-lg leading-relaxed">
        Whether you're looking for local recommendations, custom itineraries, or
        have questions about your upcoming adventure, our team is ready to
        assist you.
      </p>

      {/* Contact Details */}
      <div className="space-y-6">
        {/* Email */}
        <motion.div variants={itemVariants} className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
            <Mail className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Email</h3>
            <a
              href="mailto:knowalocaltours@gmail.com"
              className="text-neutral-dark hover:text-accent transition-colors"
            >
              knowalocaltours@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div variants={itemVariants} className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
            <Phone className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Phone</h3>
            <a
              href="tel:902-774-0710"
              className="text-neutral-dark hover:text-accent transition-colors"
            >
              902-774-0710
            </a>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div variants={itemVariants} className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
            <MapPin className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Location</h3>
            <p className="text-neutral-dark">Yarmouth, Nova Scotia</p>
          </div>
        </motion.div>
      </div>

      {/* Response Time */}
      <motion.div
        variants={itemVariants}
        className="p-4 rounded-lg bg-secondary/5 border border-secondary/20"
      >
        <p className="text-sm text-neutral-dark">
          <span className="font-semibold text-primary">Response Time:</span> We
          typically respond to inquiries within 24 hours during business days.
        </p>
      </motion.div>
    </motion.div>
  );
}
