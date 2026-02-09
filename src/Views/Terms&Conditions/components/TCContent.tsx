"use client";

import { motion } from "framer-motion";
import { TCData } from "../types";

interface TCContentProps {
  data: TCData;
}

export default function TCContent({ data }: TCContentProps) {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-bg">
      <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Sections */}
        <div className="space-y-8 sm:space-y-10 md:space-y-14 lg:space-y-16">
          {data.sections.map((section, sectionIndex) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="scroll-mt-12 sm:scroll-mt-16 md:scroll-mt-20 lg:scroll-mt-24"
            >
              {/* Section Header */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 border-b-2 border-accent/30">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mb-1 sm:mb-2 md:mb-3 leading-tight">
                  {section.title}
                </h2>
                <p className="text-secondary text-xs sm:text-sm md:text-base lg:text-lg font-medium italic">
                  {section.description}
                </p>
              </div>

              {/* Clauses */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {section.clauses.map((clause, clauseIndex) => (
                  <motion.div
                    key={`${section.id}-${clauseIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: clauseIndex * 0.05,
                    }}
                    className="pl-3 sm:pl-4 md:pl-5 lg:pl-6 border-l-4 border-accent"
                  >
                    <h3 className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary mb-1 sm:mb-2">
                      {clause.heading}
                    </h3>
                    <p className="text-secondary/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-body">
                      {clause.content}
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
          className="mt-12 sm:mt-14 md:mt-18 lg:mt-20 pt-6 sm:pt-8 md:pt-10 lg:pt-12 border-t-2 border-secondary/20 text-center"
        >
          <p className="text-secondary/70 text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 leading-relaxed">
            By booking with Know a Local, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
          <p className="text-secondary text-xs sm:text-xs md:text-sm lg:text-base font-medium break-words">
            For questions or concerns, please contact{" "}
            <a
              href="mailto:knowalocaltours@gmail.com"
              className="text-accent hover:text-accent/80 transition-colors font-semibold underline"
            >
              knowalocaltours@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
