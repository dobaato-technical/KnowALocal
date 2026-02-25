"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Button from "./button";

type CardVariant = "default" | "featured" | "compact";

interface TravelLocation {
  id: number;
  title: string;
  image: string;
  description: string;
  rating?: number;
}

interface TravelCardProps {
  image: string;
  title: string;
  description: string;
  variant?: CardVariant;
  className?: string;
  rating?: number; // 0-5 star rating
  price?: number;
  location?: TravelLocation; // Full location object for scalability
}

export default function TravelCard({
  image,
  title,
  description,
  variant = "default",
  className,
  rating = 0,
  price,
  location,
}: TravelCardProps) {
  // Use rating from location object if available, otherwise use the prop
  const cardRating = location?.rating ?? rating;
  // Render star rating
  const renderStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={cn(
            "text-lg",
            i <= Math.floor(rate) ? "text-yellow-400" : "text-gray-300",
          )}
        >
          ★
        </span>,
      );
    }
    return stars;
  };
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

        {/* Rating Badge */}
        {cardRating > 0 && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <div className="flex">{renderStars(cardRating)}</div>
            <span className="text-sm font-semibold text-gray-800 ml-1">
              {cardRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price Badge */}
        {price && (
          <div className="absolute top-4 left-4 bg-accent text-bg px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            ${price}
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
          <Button variant="subtle" className="group-hover:after:w-1/2">
            View Detail
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
