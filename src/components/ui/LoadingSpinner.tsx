"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  label,
  className = "",
}: LoadingSpinnerProps) {
  const dotSize =
    size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3";
  const gapClass =
    size === "sm" ? "gap-1.5" : size === "lg" ? "gap-3" : "gap-2";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className={`flex ${gapClass}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`${dotSize} rounded-full bg-accent block`}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      {label && (
        <p className="text-sm text-secondary/70 font-medium">{label}</p>
      )}
    </div>
  );
}
