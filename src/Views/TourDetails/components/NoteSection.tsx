"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface NoteSectionProps {
  note?: string;
}

export default function NoteSection({ note }: NoteSectionProps) {
  if (!note) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-neutral-medium/10 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-xl">
                <Info className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-heading font-bold text-accent text-lg tracking-tight">
                Important Information
              </h4>
            </div>

            <div className="space-y-4">
              <p className="text-primary/80 text-lg leading-relaxed font-body whitespace-pre-line">
                {note}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
