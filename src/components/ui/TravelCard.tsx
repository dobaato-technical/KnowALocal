"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Button from "./Button";

type CardVariant = "default" | "featured" | "compact";

interface TravelCardProps {
  image: string;
  title: string;
  description: string;
  variant?: CardVariant;
  className?: string;
}

export default function TravelCard({
  image,
  title,
  description,
  variant = "default",
  className,
}: TravelCardProps) {
  return (
    <div
      className={cn(
        "group bg-surface rounded-lg overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        "border border-transparent",
        variant === "featured" && "border-2 border-accent shadow-md",
        variant === "compact" && "max-w-sm",
        className,
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          variant === "compact" ? "h-40" : "h-48",
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Optional gradient overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured badge */}
        {variant === "featured" && (
          <div className="absolute top-4 right-4 bg-accent text-bg px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-6", variant === "compact" && "p-4")}>
        <h3 className="font-heading text-primary text-xl mb-2 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <p
          className={cn(
            "text-text/80 leading-relaxed line-clamp-3",
            variant === "compact" && "text-sm line-clamp-2",
          )}
        >
          {description}
        </p>

        {/* CTA Section */}
        <div className="mt-4 flex items-center justify-between">
          <Button variant="subtle" className="group-hover:after:w-full">
            Learn more
          </Button>

          {/* Optional: Add an arrow icon that animates on hover */}
          <span className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
