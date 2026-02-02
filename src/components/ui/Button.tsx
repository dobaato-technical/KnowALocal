"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-body transition-all duration-200 ease-out",

        variant === "primary" &&
          "bg-primary text-bg px-6 py-3 rounded-md hover:bg-accent hover:scale-105",

        variant === "secondary" &&
          "bg-secondary text-bg px-6 py-3 rounded-md hover:scale-105",

        variant === "outline" &&
          "border border-primary text-primary hover:bg-primary hover:text-bg",

        variant === "link" &&
          "relative text-primary text-sm after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
