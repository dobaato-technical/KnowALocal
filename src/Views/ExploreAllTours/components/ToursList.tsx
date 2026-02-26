"use client";

import { getToursPreview, type TourPreview } from "@/api";
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

const DIFFICULTIES = ["all", "easy", "moderate", "hard"] as const;
const TOUR_TYPES = ["all", "standard", "adventure", "hiking", "water"] as const;

function ToursList() {
  const [tours, setTours] = useState<TourPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount =
    (difficultyFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0);

  useEffect(() => {
    async function loadTours() {
      try {
        const response = await getToursPreview();
        const data = response.data || [];
        setTours(data);
      } catch (error) {
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTours();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-bg text-dark py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-heading font-bold text-3xl mb-4">
            All Available Tours
          </h2>
          <div className="mt-16">
            <LoadingSpinner label="Loading tours..." className="mb-8" />
            <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] bg-neutral-medium/30 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const filteredTours = tours.filter((t) => {
    const diffOk =
      difficultyFilter === "all" ||
      t.difficulty?.toLowerCase() === difficultyFilter;
    const typeOk =
      typeFilter === "all" || t.tourType?.toLowerCase() === typeFilter;
    return diffOk && typeOk;
  });

  return (
    <section className="bg-bg text-dark py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          All Available Tours
        </motion.h2>

        <p className="mt-4 max-w-xl text-dark/70">
          Handpicked experiences that showcase the natural beauty, culture, and
          adventure Canada has to offer.
        </p>

        {/* Filter Toggle Button */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filtersOpen || activeFilterCount > 0
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white border-neutral-medium text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setDifficultyFilter("all");
                setTypeFilter("all");
              }}
              className="inline-flex items-center gap-1 text-xs text-dark/50 hover:text-accent transition-colors"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 rounded-2xl border border-neutral-medium bg-white space-y-4">
                {/* Difficulty */}
                <div>
                  <p className="text-xs font-semibold text-dark/50 uppercase tracking-widest mb-2">
                    Difficulty
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficultyFilter(d)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border ${
                          difficultyFilter === d
                            ? "bg-accent text-white border-accent shadow-sm"
                            : "bg-transparent border-neutral-medium text-secondary hover:border-accent hover:text-accent"
                        }`}
                      >
                        {d === "all" ? "Any" : d}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Tour Type */}
                <div>
                  <p className="text-xs font-semibold text-dark/50 uppercase tracking-widest mb-2">
                    Tour Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TOUR_TYPES.map((ty) => (
                      <button
                        key={ty}
                        onClick={() => setTypeFilter(ty)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border ${
                          typeFilter === ty
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-transparent border-neutral-medium text-secondary hover:border-primary hover:text-primary"
                        }`}
                      >
                        {ty === "all" ? "Any" : ty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-dark/60">
              {tours.length === 0
                ? "No tours available at the moment."
                : "No tours match your filters."}
            </p>
            {tours.length > 0 && (
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setTypeFilter("all");
                }}
                className="mt-4 text-accent font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {filteredTours.length > 0 && (
          <div className="mt-10 grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/tour-details/${tour._id}`}>
                  <div className="relative h-70 rounded-2xl overflow-hidden cursor-pointer bg-gray-200">
                    {tour.image?.asset?.url ? (
                      <Image
                        src={tour.image.asset.url}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 font-semibold">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for badge legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Rating Badge */}
                    {tour.rating && tour.rating > 0 && (
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-md flex items-center gap-1.5">
                        <span className="text-lg text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-900">
                          {tour.rating.toFixed(1)}/5
                        </span>
                      </div>
                    )}

                    {/* Price Tag */}
                    {tour.basePrice && (
                      <div className="absolute top-4 left-4 bg-accent/90 text-white px-3.5 py-2 rounded-2xl shadow-md font-bold">
                        ${tour.basePrice}
                      </div>
                    )}
                  </div>
                </Link>

                <h3 className="mt-6 font-heading text-xl">{tour.title}</h3>

                <p className="mt-2 text-sm text-dark/70 max-w-md line-clamp-2">
                  {tour.description}
                </p>

                <div className="mt-4">
                  <Link href={`/tour-details/${tour._id}`}>
                    <Button variant="subtle">View Detail</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(ToursList);
