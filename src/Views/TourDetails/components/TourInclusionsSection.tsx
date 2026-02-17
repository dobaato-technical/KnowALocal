"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface Inclusion {
  title: string;
  description: string;
  icon?: string;
}

interface TourInclusionsSectionProps {
  inclusions: Inclusion[];
}

// Map icon names (from Sanity) to Lucide components
const iconMap: Record<
  string,
  React.ComponentType<{ size: number; strokeWidth: number }>
> = {
  check: Icons.Check,
  "check-circle": Icons.CheckCircle2,
  mapPin: Icons.MapPin,
  users: Icons.Users,
  camera: Icons.Camera,
  utensils: Icons.UtensilsCrossed,
  mountain: Icons.Mountain,
  map: Icons.Map,
  heart: Icons.Heart,
  compass: Icons.Compass,
  phone: Icons.Phone,
  package: Icons.Package,
  clock: Icons.Clock,
  shield: Icons.Shield,
  award: Icons.Award,
};

export default function TourInclusionsSection({
  inclusions,
}: TourInclusionsSectionProps) {
  if (!inclusions || inclusions.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4 font-heading tracking-tight">
              What's Included
            </h2>
            <div className="h-1.5 w-20 bg-accent rounded-full"></div>
          </div>

          <motion.div className="grid md:grid-cols-2 gap-6">
            {inclusions.map((inclusion, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 items-start"
              >
                {/* Tick Icon */}
                <div className="flex-shrink-0 text-[#d69850] mt-1">
                  <Icons.Check size={20} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#335358] text-base md:text-lg mb-1">
                    {inclusion.title}
                  </h3>
                  <p className="text-[#335358]/70 text-sm md:text-base leading-relaxed font-normal">
                    {inclusion.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
