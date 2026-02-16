"use client";

import { motion } from "framer-motion";

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

  const groupedByCategory = {
    critical: requirements.filter((r) => r.severity === "critical"),
    warning: requirements.filter((r) => r.severity === "warning"),
    info: requirements.filter((r) => r.severity === "info"),
  };

  const getCategoryStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-300";
      case "warning":
        return "border-amber-300";
      case "info":
        return "border-blue-300";
      default:
        return "border-gray-300";
    }
  };

  const getIndicatorColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-amber-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryTitle = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Critical Requirements";
      case "warning":
        return "Important Warnings";
      case "info":
      default:
        return "Good to Know";
    }
  };

  const renderColumn = (severity: "critical" | "warning" | "info") => {
    const items = groupedByCategory[severity];

    const borderColorClass =
      severity === "critical"
        ? "border-red-300"
        : severity === "warning"
          ? "border-amber-300"
          : "border-blue-300";

    return (
      <motion.div variants={itemVariants} className="flex flex-col gap-6">
        {/* Column Header */}
        <div className={`w-full pb-6 border-b-2 ${borderColorClass}`}>
          <h3 className="text-lg md:text-xl px-16 font-semibold text-[#335358]">
            {getCategoryTitle(severity)}
          </h3>
        </div>

        {/* Column Content */}
        {items.length > 0 ? (
          <div className="flex flex-col gap-6">
            {items.map((req, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4"
              >
                {/* Indicator */}
                <div
                  className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${getIndicatorColor(severity)}`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#335358]  text-base mb-2">
                    {req.title}
                  </h4>
                  <p className="text-[#335358]/70 text-sm leading-relaxed">
                    {req.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-[#335358]/50 text-sm">No items in this category</p>
        )}
      </motion.div>
    );
  };

  return (
    <section className="w-full py-16 md:py-20 bg-[#f8f1dd]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full"
        >
          {/* Header Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#335358] mb-4 font-heading tracking-tight">
              Before You Go
            </h2>
            <div className="h-1.5 w-20 bg-[#d69850] rounded-full"></div>
          </div>

          {/* Grid Section */}
          <motion.div className="grid md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 w-full">
            <motion.div variants={itemVariants} className="h-full">
              {renderColumn("critical")}
            </motion.div>
            <motion.div variants={itemVariants} className="h-full">
              {renderColumn("warning")}
            </motion.div>
            <motion.div variants={itemVariants} className="h-full">
              {renderColumn("info")}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
