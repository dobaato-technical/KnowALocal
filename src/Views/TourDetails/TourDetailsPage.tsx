"use client";

import BookingSidebar from "@/Views/TourDetails/components/BookingSidebar";
import ItineraryDay from "@/Views/TourDetails/components/ItineraryDay";
import TourDetailHero from "@/Views/TourDetails/components/TourDetailHero";
import TourInfoCards from "@/Views/TourDetails/components/TourInfoCards";
import { toursMockData } from "@/Views/TourDetails/data/mock";
import Footer from "@/components/common/footer";
import Header from "@/components/common/navbar";
import { motion } from "framer-motion";
import Link from "next/link";

interface TourDetailsPageProps {
  params: {
    slug: string;
  };
}

export default function TourDetailsPage({ params }: TourDetailsPageProps) {
  // Deep Scan Find: Match by slug or ID as strings for maximum reliability
  const slug = params?.slug;
  const tour = toursMockData.find(
    (t) =>
      String(t.slug).toLowerCase() === String(slug).toLowerCase() ||
      String(t.id) === String(slug),
  );

  if (!tour) {
    return (
      <main className="bg-bg min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold mb-4 text-dark">
              Tour Not Found
            </h1>
            <p className="text-dark/60 mb-8">
              The tour you're looking for doesn't exist.
            </p>
            <Link
              href="/explore-all-tours"
              className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Back to Tours
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-bg min-h-screen overflow-x-hidden">
      <Header />

      <TourDetailHero tour={tour} />

      <TourInfoCards tour={tour} />

      <section className="py-16 md:py-20 bg-neutral-medium/30 relative">
        <div className="max-w-[78rem] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left Column: Itinerary */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 block">
                  The Journey
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6 text-primary">
                  Detailed Itinerary
                </h2>
                <div className="w-16 h-1.5 bg-accent rounded-2xl mb-8 shadow-sm" />
                <p className="text-secondary text-base md:text-lg max-w-3xl leading-relaxed font-body font-medium italic border-l-4 border-accent pl-5 py-1 mb-6">
                  {tour.fullDescription}
                </p>
                <p className="text-secondary/70 text-sm md:text-base max-w-2xl leading-relaxed font-body font-medium">
                  Everything you need to know about your adventure. Click on
                  each day to reveal the stories and experiences waiting for
                  you.
                </p>
              </motion.div>

              <div className="space-y-4">
                {tour.itinerary.map((itinerary) => (
                  <ItineraryDay
                    key={itinerary.day}
                    tour={tour}
                    day={itinerary.day}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Booking Sidebar */}
            <div className="lg:w-1/3 mt-12 lg:mt-0">
              <BookingSidebar tour={tour} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
