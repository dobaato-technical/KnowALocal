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

  const getBackgroundColor = (level?: string) => {
    switch (level) {
      case "danger":
        return "bg-red-50 border-red-300";
      case "warning":
        return "bg-amber-50 border-amber-300";
      default:
        return "bg-blue-50 border-blue-300";
    }
  };

  const getIcon = (level?: string) => {
    switch (level) {
      case "danger":
        return <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-700 flex-shrink-0" />;
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#335358] mb-2 font-heading">
            Safety & Important Information
          </h2>
          <div className="h-1 w-16 bg-red-500 rounded mb-12"></div>

          {/* Tower/Climbing Details */}
          {towerDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 p-6 bg-white border-2 border-red-200 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-[#335358] mb-4">
                🏭 Inside the Tower
              </h3>
              <div className="space-y-3 text-[#335358]/80">
                {towerDetails.stepCount && (
                  <p className="text-lg">
                    <span className="font-semibold">Total Steps:</span>{" "}
                    {towerDetails.stepCount} steps from base to lantern room
                  </p>
                )}
                {towerDetails.diameter && (
                  <p className="text-lg">
                    <span className="font-semibold">Tower Dimensions:</span>{" "}
                    Very narrow {towerDetails.diameter}-foot diameter tower with
                    steep, metal mesh stairs
                  </p>
                )}
                {towerDetails.description && (
                  <p className="text-lg">{towerDetails.description}</p>
                )}
                {towerDetails.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-900 mb-1">
                      Special Instructions:
                    </p>
                    <p className="text-yellow-900">
                      {towerDetails.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Warnings */}
          <motion.div className="space-y-4">
            {warnings &&
              warnings.map((warning, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`p-6 rounded-lg border-2 ${getBackgroundColor(
                    warning.level,
                  )} flex gap-4`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(warning.level)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#335358] mb-2 text-lg">
                      {warning.title}
                    </h4>
                    <p className="text-[#335358]/80 leading-relaxed">
                      {warning.description}
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
