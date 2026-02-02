"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How far in advance should I book my trip?",
    answer:
      "We recommend booking at least 3-6 months in advance for international trips, especially during peak seasons. This ensures better availability for flights, accommodations, and activities. However, we also handle last-minute bookings and can create amazing experiences with shorter notice.",
  },
  {
    question: "Do you offer customized itineraries?",
    answer:
      "Absolutely! Every traveler is unique, and so should be their journey. Our local experts work closely with you to understand your preferences, budget, and travel style. We craft personalized itineraries that match your interests, whether you're seeking adventure, relaxation, culture, or a mix of everything.",
  },
  {
    question: "What's included in your travel packages?",
    answer:
      "Our packages typically include accommodations, guided tours, some meals, airport transfers, and 24/7 support during your trip. The exact inclusions vary by destination and package type. We provide detailed breakdowns for each itinerary, and you can always add or remove services to fit your needs.",
  },
  {
    question: "Is travel insurance necessary?",
    answer:
      "While not mandatory, we strongly recommend travel insurance for all trips. It protects you against unexpected events like trip cancellations, medical emergencies, lost baggage, and more. We can help you find the right coverage that fits your travel plans and provide guidance on what to look for in a policy.",
  },
  {
    question: "What if I need to cancel or modify my booking?",
    answer:
      "Our cancellation and modification policies vary depending on the destination and time until departure. Generally, the earlier you notify us, the more flexible we can be. We always work to find the best solution for our clients and will clearly explain all policies before you confirm your booking.",
  },
  {
    question: "Do you provide support during the trip?",
    answer:
      "Yes! We offer 24/7 support throughout your journey. Whether you need to adjust your itinerary, have questions about activities, or encounter any issues, our team is always just a call or message away. We also provide local contact numbers for immediate assistance in your destination.",
  },
  {
    question:
      "Can you accommodate special dietary requirements or accessibility needs?",
    answer:
      "Absolutely. We work hard to ensure all travelers have a comfortable and enjoyable experience. Please inform us of any dietary restrictions, mobility requirements, or other special needs when booking, and we'll make the necessary arrangements with hotels, restaurants, and activity providers.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, bank transfers, and digital payment platforms. Most bookings require a deposit to secure your reservation, with the balance due before departure. We'll provide a clear payment schedule and keep you informed every step of the way.",
  },
];

interface FAQItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemComponent({ item, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "border border-primary/20 rounded-lg overflow-hidden transition-all duration-300",
        isOpen && "bg-primary/5 border-primary/40 shadow-md",
      )}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-primary/5 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <h3 className="font-heading text-primary text-lg font-semibold pr-4">
          {item.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-2">
              <p className="text-text/80 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 snap-start">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2
            className="font-heading font-bold text-primary mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-text/70 text-lg max-w-2xl mx-auto">
            Got questions? We've got answers. If you don't find what you're
            looking for, feel free to reach out to our team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItemComponent
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
