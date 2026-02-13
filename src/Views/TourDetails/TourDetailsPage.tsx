"use client";

import { Tour } from "@/sanity/lib/queries";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

/* -------- Dynamic Imports -------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const TourDetailHero = dynamic(
  () => import("@/Views/TourDetails/components/TourDetailHero"),
  {
    ssr: false,
  },
);

const TourInfoCards = dynamic(
  () => import("@/Views/TourDetails/components/TourInfoCards"),
  {
    ssr: false,
  },
);

const ItineraryDay = dynamic(
  () => import("@/Views/TourDetails/components/ItineraryDay"),
  {
    ssr: false,
  },
);

const BookingSidebar = dynamic(
  () => import("@/Views/TourDetails/components/BookingSidebar"),
  {
    ssr: false,
  },
);

const ImageGallery = dynamic(
  () =>
    import("@/Views/TourDetails/components/carousel-circular-image-gallery").then(
      (mod) => mod.ImageGallery,
    ),
  { ssr: false },
);

const SpecialtiesSection = dynamic(
  () =>
    import("@/Views/TourDetails/components/SpecialtiesSection").then(
      (mod) => mod.SpecialtiesSection,
    ),
  { ssr: false },
);

const TourInclusionsSection = dynamic(
  () => import("@/Views/TourDetails/components/TourInclusionsSection"),
  { ssr: false },
);

const KeyRequirementsSection = dynamic(
  () => import("@/Views/TourDetails/components/KeyRequirementsSection"),
  { ssr: false },
);

const SafetyWarningsBox = dynamic(
  () => import("@/Views/TourDetails/components/SafetyWarningsBox"),
  { ssr: false },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

interface TourDetailsPageProps {
  tour: Tour;
}

export default function TourDetailsPage({ tour }: TourDetailsPageProps) {
  return (
    <main className="bg-bg min-h-screen overflow-x-hidden">
      <Header />

      <TourDetailHero tour={tour} />

      <TourInfoCards tour={tour} />

      {/* Adventure Tour Sections */}
      {tour.tourType === "adventure" && (
        <>
          {tour.tourInclusions && (
            <TourInclusionsSection inclusions={tour.tourInclusions} />
          )}

          <div className="grid md:grid-cols-2 gap-0">
            {tour.keyRequirements && (
              <div className="md:col-span-1">
                <KeyRequirementsSection requirements={tour.keyRequirements} />
              </div>
            )}
          </div>

          {tour.safetyWarnings && (
            <SafetyWarningsBox
              warnings={tour.safetyWarnings}
              towerDetails={
                tour.towerOrClimbingDetails
                  ? {
                      stepCount: tour.towerOrClimbingDetails.stepCount,
                      description: tour.towerOrClimbingDetails.description,
                      diameter: tour.towerOrClimbingDetails.diameter,
                      specialInstructions:
                        tour.towerOrClimbingDetails.specialInstructions,
                    }
                  : undefined
              }
            />
          )}
        </>
      )}

      <SpecialtiesSection specialties={tour.specialties || []} />

      {/* Itinerary & Booking Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white via-[#f8f1dd]/20 to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#335358]/5 rounded-full -mr-48 -mb-48 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Column: Itinerary */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-14"
              >
                <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
                  The Journey
                </motion.span>
                <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary leading-tight">
                  Detailed Itinerary
                </h2>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1.5 bg-gradient-to-r from-accent to-orange-400 rounded-full mb-8 shadow-lg"
                />
                <p className="text-secondary text-lg md:text-base max-w-3xl leading-relaxed font-body font-medium italic border-l-4 border-accent pl-6 py-2 mb-8 bg-gradient-to-r from-accent/5 to-transparent rounded-r-xl">
                  {tour.fullDescription}
                </p>
                <p className="text-secondary/70 text-base md:text-lg max-w-2xl leading-relaxed font-body">
                  Everything you need to know about your adventure. Click on
                  each day to reveal the stories and experiences waiting for
                  you.
                </p>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {tour.itinerary?.map((itinerary, idx) => (
                  <motion.div
                    key={itinerary.day}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ItineraryDay tour={tour} day={itinerary.day} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Booking Sidebar */}
            <motion.div
              className="lg:w-1/3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="sticky top-24">
                <BookingSidebar tour={tour} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#f8f1dd] relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
              Gallery
            </motion.span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6 text-primary">
              Tour Highlights
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1.5 bg-gradient-to-r from-accent to-orange-400 rounded-full mx-auto shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ImageGallery images={tour.galleryImages} />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
