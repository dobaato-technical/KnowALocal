"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "subtle";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Primary = accent. Secondary = outlined. Subtle = text-only. */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button content */
  children: ReactNode;
}

/**
 * Button Component - Design System Implementation
 *
 * Golden Rule: Accent color ONLY appears on primary buttons
 *
 * @example
 * <Button variant="primary">Get Started</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button variant="subtle">View details →</Button>
 */
export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "font-medium transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // Sizes
        size === "sm" && "px-4 py-2 rounded-md text-sm",
        size === "md" && "px-6 py-3 rounded-lg",

        // Variants
        variant === "primary" &&
          "bg-accent text-neutral-light hover:opacity-90 active:opacity-75",
        variant === "secondary" &&
          "border-2 border-primary text-primary hover:bg-neutral-medium hover:text-primary active:bg-opacity-90",
        variant === "subtle" &&
          "text-accent hover:text-accent p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:w-0 hover:after:w-1/2 after:transition-all after:duration-300",

        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
