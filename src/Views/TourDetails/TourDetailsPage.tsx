"use client";

import ItineraryDay from "@/Views/TourDetails/components/ItineraryDay";
import TourDetailHero from "@/Views/TourDetails/components/TourDetailHero";
import { toursMockData } from "@/Views/TourDetails/data/mock";
import Footer from "@/components/common/footer";
import Header from "@/components/common/navbar";
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
    <main className="bg-bg min-h-screen">
      <Header />
      <TourDetailHero tour={tour} />

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Tour Itinerary
            </h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

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
      </section>

      <Footer />
    </main>
  );
}
