"use client";

import { motion } from "framer-motion";
import { LegalDisclaimerData } from "../types";

interface LegalDisclaimerContentProps {
  data: LegalDisclaimerData;
}

export default function LegalDisclaimerContent({
  data,
}: LegalDisclaimerContentProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg">
      <div className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Sections */}
        <div className="space-y-12 sm:space-y-14 md:space-y-16">
          {data.sections.map((section, sectionIndex) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-24"
            >
              {/* Section Header */}
              <div className="mb-6 sm:mb-7 md:mb-8 pb-4 sm:pb-5 md:pb-6 border-b-2 border-accent/30">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-2 sm:mb-3 leading-tight">
                  {section.title}
                </h2>
                <p className="text-secondary text-sm sm:text-base md:text-lg font-medium italic">
                  {section.description}
                </p>
              </div>

              {/* Content Paragraphs */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {section.content.map((paragraph, paraIndex) => (
                  <motion.div
                    key={`${section.id}-${paraIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: paraIndex * 0.05,
                    }}
                    className="pl-4 sm:pl-5 md:pl-6 border-l-4 border-accent whitespace-pre-line"
                  >
                    <p className="text-secondary/80 text-sm sm:text-base md:text-lg leading-relaxed font-body">
                      {paragraph}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Agreement Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-18 md:mt-20 pt-8 sm:pt-10 md:pt-12 border-t-2 border-secondary/20 text-center"
        >
          <p className="text-secondary/70 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
            By using Know a Local's services, you acknowledge that you have read
            and understood this Legal Disclaimer and agree to be bound by its
            terms.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
