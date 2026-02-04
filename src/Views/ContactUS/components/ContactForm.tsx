"use client";

import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
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
    <div className="bg-primary/5 rounded-xl p-8 shadow-2xl border border-primary/10">
      <h2 className="text-2xl font-heading font-semibold text-primary mb-6">
        Send us a Message
      </h2>

      {/* Success Message */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-secondary/10 border border-secondary rounded-lg flex gap-3 items-center"
        >
          <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-secondary font-medium">
            Thank you! We'll get back to you soon.
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-neutral-medium/50 bg-neutral-light focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
            placeholder="John Doe"
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-neutral-medium/50 bg-neutral-light focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
            placeholder="john@example.com"
          />
        </motion.div>

        {/* Subject */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-neutral-medium/50 bg-neutral-light focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
            placeholder="Inquiry about custom itinerary"
          />
        </motion.div>

        {/* Message */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-neutral-medium/50 bg-neutral-light focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all resize-none"
            placeholder="Tell us more about your travel plans..."
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </motion.div>

        <p className="text-xs text-neutral-dark/60 text-center">
          We respect your privacy. Your information is safe with us.
        </p>
      </form>
    </div>
  );
}
