"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#424242] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-4xl border border-[#e5e7eb]
            text-[#424242] placeholder-[#9ca3af]
            transition-colors duration-200
            focus:outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20
            disabled:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
