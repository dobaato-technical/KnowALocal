"use client";

import { motion } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";

interface Requirement {
  title: string;
  description: string;
  severity?: "info" | "warning" | "critical";
  icon?: string;
}

interface KeyRequirementsSectionProps {
  requirements: Requirement[];
}

export default function KeyRequirementsSection({
  requirements,
}: KeyRequirementsSectionProps) {
  if (!requirements || requirements.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getSeverityStyles = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 hover:border-red-400";
      case "warning":
        return "bg-amber-50 border-amber-200 hover:border-amber-400";
      default:
        return "bg-blue-50 border-blue-200 hover:border-blue-400";
    }
  };

  const getSeverityBadgeColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <section className="py-12 bg-[#f8f1dd]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#335358] mb-2 font-heading">
            Before You Go
          </h2>
          <div className="h-1 w-16 bg-[#d69850] rounded mb-12"></div>

          <motion.div className="space-y-4">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-lg border-2 transition-all ${getSeverityStyles(
                  req.severity,
                )}`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 flex items-start pt-1">
                    {req.severity === "critical" ? (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Info className="w-6 h-6 text-blue-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-[#335358] text-lg">
                        {req.title}
                      </h3>
                      {req.severity && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityBadgeColor(
                            req.severity,
                          )}`}
                        >
                          {req.severity.charAt(0).toUpperCase() +
                            req.severity.slice(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-[#335358]/80 leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
