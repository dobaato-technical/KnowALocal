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
}

export default function TravelCard({
  image,
  title,
  description,
  variant = "default",
}: TravelCardProps) {
  return (
    <div
      className={cn(
        "group bg-surface rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg",

        variant === "featured" && "border-2 border-accent",

        variant === "compact" && "max-w-sm",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative w-full",
          variant === "compact" ? "h-40" : "h-48",
        )}
      >
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className={cn("p-6", variant === "compact" && "p-4")}>
        <h3 className="font-heading text-primary text-lg">{title}</h3>

        <p className="description mt-2">{description}</p>

        <div className="mt-4">
          <Button variant="link">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
