"use client";

import { Tour } from "@/api/modules/tours/tours.types";
import dynamic from "next/dynamic";

/* -------- Dynamic Imports -------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const TourDetailHero = dynamic(
  () => import("@/Views/TourDetails/components/TourDetailHero"),
  { ssr: false },
);

const TourInfoCards = dynamic(
  () => import("@/Views/TourDetails/components/TourInfoCards"),
  { ssr: false },
);

const ItineraryDay = dynamic(
  () => import("@/Views/TourDetails/components/ItineraryDay"),
  { ssr: false },
);

const BookingSidebar = dynamic(
  () => import("@/Views/TourDetails/components/BookingSidebar"),
  { ssr: false },
);

const GallerySection = dynamic(
  () => import("@/Views/TourDetails/components/GallerySection"),
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

const SafetyWarningsBox = dynamic(
  () => import("@/Views/TourDetails/components/SafetyWarningsBox"),
  { ssr: false },
);

const NoteSection = dynamic(
  () => import("@/Views/TourDetails/components/NoteSection"),
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
      <BookingSidebar tour={tour} />
      <TourInfoCards tour={tour} />
      <ItineraryDay tour={tour} />
      <SpecialtiesSection specialties={tour.specialties || []} />
      {tour.tourInclusions && (
        <TourInclusionsSection inclusions={tour.tourInclusions} />
      )}
      {tour.keyRequirements && (
        <SafetyWarningsBox warnings={tour.keyRequirements} />
      )}
      {tour.tourNote && <NoteSection note={tour.tourNote} />}
      {tour.galleryImages && tour.galleryImages.length > 0 && (
        <GallerySection images={tour.galleryImages} />
      )}

      <Footer />
    </main>
  );
}
