"use client";

// import { cn } from "@/lib/utils";
// import { ButtonHTMLAttributes } from "react";

// type ButtonVariant = "primary" | "secondary" | "outline" | "link";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
// }

// export default function Button({
//   variant = "primary",
//   className,
//   children,
//   ...props
// }: ButtonProps) {
//   return (
//     <button
//       className={cn(
//         "font-body transition-all duration-200 ease-out",

//         variant === "primary" &&
//           "bg-primary text-bg px-6 py-3 rounded-md hover:bg-accent hover:scale-105",

//         variant === "secondary" &&
//           "bg-secondary text-bg px-6 py-3 rounded-md hover:scale-105",

//         variant === "outline" &&
//           "border border-primary text-primary hover:bg-primary hover:text-bg",

//         variant === "link" &&
//           "relative text-primary text-sm after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",

//         className,
//       )}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

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
        "font-body transition-all duration-200 ease-out inline-flex items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",

        // Size variants
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-base",
        size === "lg" && "px-8 py-4 text-lg",

        // Style variants
        variant === "primary" &&
          "bg-primary text-bg rounded-md hover:bg-accent active:scale-95 shadow-sm hover:shadow-md",
        variant === "secondary" &&
          "bg-secondary text-bg rounded-md hover:opacity-90 active:scale-95 shadow-sm",
        variant === "outline" &&
          "border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-bg active:scale-95",
        variant === "link" &&
          "relative text-primary p-0 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",

        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
