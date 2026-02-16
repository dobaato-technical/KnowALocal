"use client";

import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface SafetyWarning {
  title: string;
  description: string;
  level?: "info" | "warning" | "danger";
}

interface SafetyWarningsBoxProps {
  warnings: SafetyWarning[];
  towerDetails?: {
    stepCount?: number;
    description?: string;
    diameter?: number;
    specialInstructions?: string;
  };
}

export default function SafetyWarningsBox({
  warnings,
  towerDetails,
}: SafetyWarningsBoxProps) {
  if ((!warnings || warnings.length === 0) && !towerDetails) return null;

  const getAccentColor = (level?: string) => {
    switch (level) {
      case "danger":
        return "#ff6b6b";
      case "warning":
        return "#ffd93d";
      default:
        return "#d69850";
    }
  };

  const getIcon = (level?: string) => {
    switch (level) {
      case "danger":
        return (
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "#ff6b6b" }}
          />
        );
      case "warning":
        return (
          <AlertCircle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "#ffd93d" }}
          />
        );
      default:
        return (
          <Info
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "#d69850" }}
          />
        );
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#335358]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#d69850] mb-4 font-heading tracking-tight">
              Safety & Important Information
            </h2>
            <div className="h-1.5 w-24 bg-[#d69850] rounded-full"></div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Tower Details */}
            {towerDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl">🏭</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#d69850]">
                    Inside the Tower
                  </h3>
                </div>

                {/* Tower Stats */}
                <div className="space-y-5">
                  {towerDetails.stepCount && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="pb-5 border-b border-[#d69850]/30"
                    >
                      <p className="text-[#d69850] font-semibold text-lg mb-2">
                        Total Steps
                      </p>
                      <p className="text-white/90 text-base leading-relaxed">
                        {towerDetails.stepCount} steps from base to lantern room
                      </p>
                    </motion.div>
                  )}

                  {towerDetails.diameter && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="pb-5 border-b border-[#d69850]/30"
                    >
                      <p className="text-[#d69850] font-semibold text-lg mb-2">
                        Tower Dimensions
                      </p>
                      <p className="text-white/90 text-base leading-relaxed">
                        Very narrow {towerDetails.diameter}-foot diameter tower
                        with steep, metal mesh stairs
                      </p>
                    </motion.div>
                  )}

                  {towerDetails.description && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="pb-5 border-b border-[#d69850]/30"
                    >
                      <p className="text-white/90 text-base leading-relaxed">
                        {towerDetails.description}
                      </p>
                    </motion.div>
                  )}

                  {towerDetails.specialInstructions && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="mt-6 p-5 border-2 border-[#d69850]/50 rounded-lg bg-[#d69850]/10 backdrop-blur-sm"
                    >
                      <p className="font-semibold text-[#d69850] mb-3 text-lg">
                        ⚠️ Special Instructions
                      </p>
                      <p className="text-white/90 leading-relaxed">
                        {towerDetails.specialInstructions}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Right Column: Warnings - Timeline Progression */}
            <motion.div className="relative">
              {/* Timeline container with flex layout */}
              <div className="relative">
                {/* Vertical connecting line */}
                {warnings && warnings.length > 1 && (
                  <div
                    className="absolute left-4 top-4 bottom-4 w-1"
                    style={{
                      background: `linear-gradient(to bottom, #d69850 0%, #d69850 100%)`,
                      opacity: 0.5,
                    }}
                  />
                )}

                {/* Timeline items */}
                <div className="flex flex-col gap-10">
                  {warnings &&
                    warnings.map((warning, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="flex gap-6 group"
                      >
                        {/* Icon circle - fixed position */}
                        <div
                          className="flex-shrink-0 relative z-10"
                          style={{ marginTop: "2px" }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2.5 bg-[#335358] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                            style={{
                              borderColor: getAccentColor(warning.level),
                              boxShadow: `0 0 12px ${getAccentColor(
                                warning.level,
                              )}40`,
                            }}
                          >
                            {getIcon(warning.level)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1 transition-all duration-300 group-hover:translate-x-1">
                          <h4
                            className="font-bold text-lg mb-2"
                            style={{ color: getAccentColor(warning.level) }}
                          >
                            {warning.title}
                          </h4>
                          <p className="text-white/75 leading-relaxed text-sm">
                            {warning.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                  {!warnings || warnings.length === 0 ? (
                    <p className="text-white/60 italic">
                      No additional warnings
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
