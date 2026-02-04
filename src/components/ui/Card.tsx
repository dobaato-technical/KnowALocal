"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Card size variant */
  size?: "default" | "lg";
  /** Highlight variant with accent left border */
  highlight?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card Component - Design System Implementation
 *
 * Standard cards are neutral-light. Highlight cards are neutral-medium with accent border.
 *
 * @example
 * <Card>Standard card content</Card>
 * <Card highlight>Featured card content</Card>
 */
export function Card({
  children,
  size = "default",
  highlight = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        "shadow-sm",
        size === "default" && "p-6",
        size === "lg" && "p-8",
        highlight
          ? "bg-neutral-medium border-l-4 border-accent"
          : "bg-neutral-light",
        className,
      )}
    >
      {children}
    </div>
  );
}
